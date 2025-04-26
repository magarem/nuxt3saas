import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const { domain } = getRouterParams(event);


    console.log('domain///////////:', domain);
    const db =  getDatabase(domain); // Replace 'your_domain'



    const mailboxesData = db.prepare(`SELECT id, name FROM Mailboxes`).all();

    console.log('mailboxesData:', mailboxesData);
     db.close();

    return mailboxesData.map(mailbox => ({
      name: mailbox.name,
      icon: getMailboxIcon(mailbox.name), // Function to determine icon based on name
      unread: 0, // Initialize unread count (you'll likely fetch this separately)
      id: mailbox.id, // Optionally include the ID if needed on the frontend
    }));
  } catch (error) {
    console.error('Error fetching mailboxes:', error);
    return { error: 'Failed to fetch mailboxes.' };
  }
});

function getMailboxIcon(mailboxName) {
  switch (mailboxName) {
    case 'Inbox':
      return 'pi-inbox';
    case 'Sent':
      return 'pi-send';
    case 'Drafts':
      return 'pi-file-edit';
    case 'Trash':
      return 'pi-trash';
    default:
      return 'pi-folder'; // Default icon
  }
}