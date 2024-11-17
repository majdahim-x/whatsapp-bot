import { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';

export const runExistingSession = async (
    clientId: string,
    sessionData: any
) => {
    console.log(`Running existing session for client ${clientId}`);

    const client = new Client({
        // session: sessionData, // Load the existing session data
        puppeteer: {
            headless: false,
        },
        // authStrategy: new RemoteAuth({
        //     clientId: clientId,
        //     store: sessionData,
        //     backupSyncIntervalMs: 1000 * 60 * 60 * 24 * 7, // 1 week
        // }),
        authStrategy: new LocalAuth({ clientId: clientId }),
    });

    // Event listeners for the WhatsApp client
    client.on('ready', () => {
        console.log(`Client ${clientId} is running with the existing session.`);
    });

    client.on('authenticated', (session: any) => {
        console.log(`Client ${clientId} re-authenticated successfully.`);
        // Save the new session data
        sessionData = session;
    });

    // Start the client and wait for it to be ready
    await client.initialize();

    return client; // Return the client or session data
};
