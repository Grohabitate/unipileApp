
import 'dotenv/config';
import fetch from 'node-fetch';

const UNIPILE_TOKEN = process.env.UNIPILE_TOKEN;


export async function listUnipileAccounts() {
  const url = 'https://api10.unipile.com:14082/api/v1/accounts';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': UNIPILE_TOKEN,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list accounts: ${errorText}`);
  }

  return response.json();
}


