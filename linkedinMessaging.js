
import { client } from './unipileClient.js';


export async function getAllChats() {
  return client.messaging.getAllChats();
}


export async function getMessages(chatId) {
  return client.messaging.getAllMessages({ chatId });
}


export async function sendMessage(chatId, message) {
  return client.messaging.sendMessage({ chatId, message });
}

