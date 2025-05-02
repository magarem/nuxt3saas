import 'dotenv/config';
import fs from "fs";
import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";

export default defineEventHandler(async (event) => {
    const req = await readBody(event)


    console.log('req:', req);

    const mailerSend = new MailerSend({
    apiKey: "",
    });

    const sentFrom = new Sender("magaweb@magaweb.com.br", "Magaweb");

    const recipients = [
      new Recipient(req.to, req.destinatario)
    ];

   
      const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(req.subject)
      .setHtml(req.html)
      
      const ret = await mailerSend.email.send(emailParams);
   
   return ret.statusCode
})