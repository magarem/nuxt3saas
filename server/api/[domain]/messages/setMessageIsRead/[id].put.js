import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const messageId = getRouterParam(event, 'id');
  const db = getDatabase(event.context.params.domain);

  try {
    const statement = db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?');
    const info = statement.run(messageId);

    if (info.changes > 0) {
      return { message: `Message with ID ${messageId} marked as read.` };
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: `Message with ID ${messageId} not found.`,
      });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not update message status.',
      message: error.message,
    });
  } finally {
    db.close();
  }
});