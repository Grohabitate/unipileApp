import 'dotenv/config';
import fetch from 'node-fetch';

const UNIPILE_TOKEN = process.env.UNIPILE_TOKEN;


export async function generateUnipileAuthLink() {
  const url = `${process.env.UNIPILE_DSN}/api/v1/hosted/accounts/link`;
  

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-API-KEY': UNIPILE_TOKEN,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'create',
      providers: ['LINKEDIN'], 
      api_url: process.env.UNIPILE_DSN,
      expiresOn: '2026-12-22T12:00:00.701Z',
      success_redirect_url: 'https://yourapp.com/auth/success',
      failure_redirect_url: 'https://yourapp.com/auth/failure',
      notify_url: 'https://yourapp.com/unipile-webhook',
      name: 'myUserId123'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate link: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
