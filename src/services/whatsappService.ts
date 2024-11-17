import { Client } from 'whatsapp-web.js';

export const runExistingSession = async (
    clientId: string,
    sessionData: any
) => {
    const client = new Client({
        session: sessionData, // Load the existing session data
        puppeteer: {
            headless: false,
        },
    });

    // Event listeners for the WhatsApp client
    client.on('ready', () => {
        console.log(`Client ${clientId} is running with the existing session.`);
    });

    client.on('authenticated', (session: any) => {
        console.log(`Client ${clientId} re-authenticated successfully.`);
    });

    // Start the client and wait for it to be ready
    await client.initialize();

    return client; // Return the client or session data
};
