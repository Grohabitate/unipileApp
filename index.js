
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';


import { listUnipileAccounts } from './unipileAccounts.js';
import { generateUnipileAuthLink } from './AuthWizard.js';
import { getAllChats, getMessages, sendMessage } from './linkedinMessaging.js';

const app = express();
app.use(bodyParser.json()); 

const PORT = process.env.PORT || 3000;

app.get('/accounts', async (req, res) => {
  try {
    const accounts = await listUnipileAccounts();
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/auth/linkedin/generate', async (req, res) => {
  try {
    const data = await generateUnipileAuthLink();
    res.json(data);
  } catch (err) {
    console.error('Error generating auth link:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/chats', async (req, res) => {
  try {
    const chats = await getAllChats();
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: err.message });
  }
});


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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

