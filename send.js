const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

const mailersend = new MailerSend({apiKey: xx});

const recipients = [new Recipient("magawebtec@gmail.com", "Fidelitos ninja")];

const emailParams = new EmailParams().setFrom("magaweb@magaweb.com.br").setFromName("Your Name").setRecipients(recipients).setSubject("Subject").setHtml("Greetings from the team, you got this message through MailerSend.").setText("Greetings from the team, you got this message through MailerSend.");

mailersend.send(emailParams);
