// server/api/users/index.get.js
import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const domain = event.context.params.domain;
    const db = getDatabase(domain); // Replace 'your_domain'

    const usersData = db.prepare('SELECT id, nome FROM users').all();

    db.close();

    return usersData;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: 'Failed to fetch users.' };
  }
});