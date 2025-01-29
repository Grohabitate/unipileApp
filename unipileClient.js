
import 'dotenv/config';
import { UnipileClient } from 'unipile-node-sdk';

const UNIPILE_DSN = process.env.UNIPILE_DSN;
const UNIPILE_TOKEN = process.env.UNIPILE_TOKEN;

export const client = new UnipileClient(UNIPILE_DSN, UNIPILE_TOKEN);
