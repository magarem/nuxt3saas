import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { from, to, subject, body: messageBody } = body;
  const domain = event.context.params.domain;

  try {
    const db = getDatabase(domain);
    // const stmt = db.prepare("SELECT id FROM Mailboxes WHERE name = 'Sent'");
    // const sentMailboxResult = stmt.run();
    
    const stmt = db.prepare("SELECT id FROM Mailboxes WHERE name = 'Sent'");
    const sentMailboxResult = stmt.get(); // usa .get() para uma única linha

    console.log('sentMailboxResult:', sentMailboxResult);
    
    // Get the mailbox_id for 'Sent'
    // const sentMailboxResult = await db.get('SELECT id FROM Mailboxes WHERE name = ?', ['Sent']);

    if (sentMailboxResult && sentMailboxResult.id) {
      const sentMailboxId = sentMailboxResult.id;


      console.log('from, to, subject, messageBody, sentMailboxId:', from, to, subject, messageBody, sentMailboxId);
      const stmt2 = db.prepare(`
        INSERT INTO messages (sender, receiver, subject, body, mailbox_id)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt2.run(from, to, subject, messageBody, sentMailboxId);
        console.log('result:', result);

    //   const result = await db.run(
    //     `
    //     INSERT INTO messages (sender, receiver, subject, body, mailbox_id)
    //     VALUES (?, ?, ?, ?, ?)
    //     `,
    //     [from, to, subject, messageBody, sentMailboxId]
    //   );

       db.close();

      if (result.lastInsertRowid) {
        return { success: true, messageId: result.lastInsertRowid };
      } else {
        throw new Error('Failed to save message.');
      }
    } else {
      await db.close();
      throw new Error('Could not find the "Sent" mailbox.');
    }
  } catch (error) {
    console.error('Error saving message to database:', error);
    return { success: false, error: error.message };
  }
});