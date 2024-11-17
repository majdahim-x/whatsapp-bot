import express from 'express';
import {
    createWhatsAppClient,
    sendMessage,
    logoutClient,
    getClientStatus,
    runExistingSessionEndpoint,
} from '../controllers/whatsappController';

const router = express.Router();

// Initialize a client
router.post('/initialize', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: 'Client ID is required' });
    }

    try {
        await createWhatsAppClient(id);
        res.json({ message: `Client ${id} initialized.` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get client status
router.get('/status/:id', (req, res) => {
    const { id } = req.params;
    const status = getClientStatus(id);
    res.json({ id, status });
});

// Send a message
router.post('/send-message', async (req, res) => {
    const { id, number, message } = req.body;

    if (!id || !number || !message) {
        res.status(400).json({
            error: 'Client ID, number, and message are required',
        });
    }

    try {
        await sendMessage(id, number, message);
        res.json({ message: `Message sent to ${number} using client ${id}.` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Logout a client
router.post('/logout', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ error: 'Client ID is required' });
    }

    try {
        await logoutClient(id);
        res.json({ message: `Client ${id} logged out.` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/run-session', async (req, res) => {
    await runExistingSessionEndpoint(req, res);
});
export default router;
