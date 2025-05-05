import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  event.node.req.socket.setTimeout(0);
  event.node.req.socket.setNoDelay(true);
  event.node.req.socket.setKeepAlive(true);

  event.node.res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendNotificationCount = async () => {
    // Simule a busca da contagem de notificações não lidas do seu banco de dados
    const unreadCount = Math.floor(Math.random() * 10);
    event.node.res.write(`data: ${JSON.stringify({ count: unreadCount })}\n\n`);
  };

  // Envie a contagem inicial
  await sendNotificationCount();

  // Envie a contagem periodicamente (simulação)
  const intervalId = setInterval(sendNotificationCount, 3000);

  // Lide com a desconexão do cliente
  event.node.req.on('close', () => {
    clearInterval(intervalId);
    console.log('Client disconnected from SSE.');
  });
});