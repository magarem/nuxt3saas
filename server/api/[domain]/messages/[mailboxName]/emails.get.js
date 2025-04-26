import {getDatabase} from '~/server/utils/db';
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
	const mailboxName = event.context.params.mailboxName;

	try {
		const domain = event.context.params.domain;
		console.log('domain/////222//////:', domain);
		console.log('mailboxName/////222//////:', mailboxName);


		const authToken = getCookie(event, "auth_token"); // Get the auth_token directly
		const decoded = jwt.verify(authToken, "chave_secreta");

console.log('decoded:', decoded);


		const db = getDatabase(domain);
		// Replace 'your_domain'

		// Get the mailbox ID based on the name
		// const mailboxResult =  db.get('SELECT id FROM Mailboxes WHERE name = ?', [mailboxName]);


		const mailboxResult = db.prepare(`SELECT id FROM Mailboxes WHERE name = '${mailboxName}'`).get();

		console.log('mailboxResult:', mailboxResult);

		if (mailboxResult && mailboxResult.id) {
			const mailboxId = mailboxResult.id;

			// Fetch emails for the specific mailbox
			console.log('mailboxId:', mailboxId);
    let emailsData = [];
      if (mailboxName === 'Sent') {
         emailsData = db.prepare(`
          SELECT
            m.id,
            m.sender,
            m.receiver,
            m.subject,
            m.body,
            m.sent_at AS date,
            m.is_read
          FROM messages m
          WHERE m.sender = ${decoded.id}
          ORDER BY m.sent_at DESC
          `).all();

          console.log('emailsData:', emailsData);
          db.close();

          return emailsData.map(email => ({
            id: `e${
              email.id
            }`, // Create a client-side ID
            from: email.sender,
            subject: email.subject,
            body: email.body,
            date: new Date(email.date),
            isRead: !!email.is_read, // Convert 0/1 to boolean
          }));
          
      }

      if (mailboxName === 'Inbox') {
        console.log('inbox~~decoded.id:', decoded.id);
         emailsData = db.prepare(`
          SELECT
            m.id,
            m.sender,
            m.receiver,
            m.subject,
            m.body,
            m.sent_at AS date,
            m.is_read
          FROM messages m
          WHERE m.receiver = ${decoded.id}
          ORDER BY m.sent_at DESC
          `).all();

          console.log('emailsData:', emailsData);

          db.close();

			return emailsData.map(email => ({
				id: `e${
					email.id
				}`, // Create a client-side ID
				from: email.sender,
				subject: email.subject,
				body: email.body,
				date: new Date(email.date),
				isRead: !!email.is_read, // Convert 0/1 to boolean
			}));
      }

			
			
		} else {
			 db.close();
			return {error: `Mailbox "${mailboxName}" not found.`};
		}
	} catch (error) {
		console.error('Error fetching emails:', error);
		return {error: 'Failed to fetch emails.'};
	}
});
