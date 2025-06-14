import { H3Event, createError } from 'h3';
import { getUserFromEvent } from '~/server/utils/auth'; // reuse your auth helper

export default defineEventHandler(async (event: H3Event) => {
    // Try to get the authenticated user
    const user = await getUserFromEvent(event);

    if (!user) {
        // No token or invalid token
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    return { success: true, user: user.user };
});
