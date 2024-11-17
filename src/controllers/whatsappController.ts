import { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import Session, { ISession } from '../models/sessionModel';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { runExistingSession } from '../services/whatsappService';

const clients: Record<string, Client> = {};
const sessions: Record<string, { status: string; qr?: string }> = {};
const store = new MongoStore({ mongoose });

// Initialize or retrieve a WhatsApp client
export const createWhatsAppClient = async (id: string): Promise<Client> => {
    // if (clients[id]) {
    //     return clients[id];
    // }
    const existingSession = await Session.findOne({ clientId: id });

    if (existingSession) {
        // If a session exists, return the session data (you can include sessionData if needed)
        //throw new Error(`Client ${id} already initialized.`);
        throw new Error(`Client ${id} already initialized.`);
    }

    console.log(`Initializing client with ID: ${id}`);
    const client = new Client({
        // authStrategy: new LocalAuth({ clientId: id }),
        authStrategy: new RemoteAuth({
            store,
            clientId: id,
            backupSyncIntervalMs: 1000 * 60 * 60 * 24 * 7, // 1 week
        }),
    });

    client.on('qr', (qr) => {
        console.log(`QR Code for client ${id}:`);
        qrcode.generate(qr, { small: true });
        sessions[id] = { status: 'PENDING', qr };
    });

    client.on('ready', () => {
        console.log(`Client ${id} is ready.`);
        sessions[id] = { status: 'READY' };
    });

    client.on('disconnected', async () => {
        console.log(`Client ${id} disconnected.`);
        delete clients[id];
        sessions[id] = { status: 'DISCONNECTED' };
        await Session.deleteOne({ clientId: id });
    });

    // Save session on authentication
    client.on('authenticated', async (session) => {
        console.log(`Client ${id} authenticated.`);
        await Session.findOneAndUpdate(
            { clientId: id },
            { sessionData: session },
            { upsert: true }
        );
    });

    clients[id] = client;
    sessions[id] = { status: 'INITIALIZING' };
    client.initialize();

    return client;
};

// Send a message
export const sendMessage = async (
    id: string,
    number: string,
    message: string
): Promise<void> => {
    if (!clients[id]) {
        throw new Error(`No client found with ID: ${id}`);
    }
    await clients[id].sendMessage(number, message);
};

// Logout a client
export const logoutClient = async (id: string): Promise<void> => {
    if (!clients[id]) {
        throw new Error(`No client found with ID: ${id}`);
    }
    await clients[id].logout();
    delete clients[id];
    sessions[id] = { status: 'LOGGED OUT' };
};

// Get client status
export const getClientStatus = (id: string) => {
    return sessions[id] || { status: 'NOT INITIALIZED' };
};

export const runExistingSessionEndpoint = async (req: Request, res: Response) => {
    const { clientId } = req.body; // Assuming the clientId is passed in the request body
  
    try {
      // Look for an existing session in the database
      const existingSession = await Session.findOne({ clientId });
  
      if (!existingSession) {
        return res.status(404).json({ message: 'No session found for this clientId' });
      }
  
      // Run the existing session using the session data from MongoDB
      const client = await runExistingSession(clientId, existingSession.sessionData);
  
      res.status(200).json({
        message: `Session for client ${clientId} is now running.`,
        sessionData: existingSession.sessionData,
      });
    } catch (error) {
      console.error('Error running existing session:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };