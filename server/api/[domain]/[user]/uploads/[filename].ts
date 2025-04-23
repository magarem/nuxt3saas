// server/api/[domain]/[user]/uploads/[filename].ts

import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const { domain, user, filename } = event.context.params;


  console.log(domain, user, filename);
  
  const filePath = join('server/uploads', domain, user, filename);

  try {
    const fileBuffer = await readFile(filePath);

    // Defina o tipo de conteúdo com base na extensão do arquivo
    const contentType = filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.jpg') || filename.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'application/octet-stream';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Arquivo não encontrado' }));
  }
});
