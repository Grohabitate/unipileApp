// index.js
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import { listUnipileAccounts } from './unipileAccounts.js';
import { generateUnipileAuthLink } from './AuthWizard.js';
import { getAllChats, getMessages, sendMessage } from './linkedinMessaging.js';
import { updateUserUnipileToken } from './lib/user.js'; // Ensure you have this function implemented

const app = express();

// Middleware
app.use(bodyParser.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API Routes

// Get Unipile Accounts
app.get('/accounts', async (req, res) => {
  try {
    const accounts = await listUnipileAccounts();
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate LinkedIn Auth Link via Unipile
app.get('/auth/linkedin/generate', async (req, res) => {
  try {
    const data = await generateUnipileAuthLink();
    res.json(data);
  } catch (err) {
    console.error('Error generating auth link:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Chats
app.get('/chats', async (req, res) => {
  try {
    const chats = await getAllChats();
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Messages for a Specific Chat
app.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessages(chatId);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send a Message to a Specific Chat
app.post('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const sendResponse = await sendMessage(chatId, message);
    res.json({ success: true, sendResponse });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
});

// Handle Unipile Callback (Webhook)
app.post('/api/unipile/callback', async (req, res) => {
  try {
    const payload = req.body;

    // Extract necessary information from payload
    // Adjust based on Unipile's actual payload structure
    const { userId, unipileToken } = payload; // Example fields

    if (!userId || !unipileToken) {
      return res.status(400).json({ error: 'Missing userId or unipileToken' });
    }

    // Update the user's Unipile token in the database
    await updateUserUnipileToken(userId, unipileToken);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error handling Unipile callback:', err);
    res.status(500).json({ error: err.message });
  }
});

// Handle Undefined Routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

