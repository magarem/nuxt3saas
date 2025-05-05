// server/api/ws.js
import { defineEventHandler } from 'h3';
import { wss } from '~/server/utils/websocket-server';

export default defineEventHandler(() => {
  console.log('Rota /api/ws acessada (o servidor WebSocket já está rodando)');
  return 'WebSocket server is running (see logs)';
});