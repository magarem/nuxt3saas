import 'dotenv/config';
import fs from "fs";
import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";

export default defineEventHandler(async (event) => {
    const req = await readBody(event)


    console.log('req:', req);

    const mailerSend = new MailerSend({
    // apiKey: "mlsn.813418e9d77877ab64f06d6b1893af5758740d58099fafd6f837ed9dee78ce43",
    apiKey: "mlsn.4f89879fe6b402e097d453d29e99fcdd0bcdbce01744581ab48819b359098ebe",
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