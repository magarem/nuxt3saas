import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { to, name, subject, html } = body

  // Crie o transporte SMTP com Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'magawebtec@gmail.com',
      pass: 'kcrq ugnu okmo lmjs', // ou sua senha, se não tiver 2FA
    },
  })

  // Monta o email
  const mailOptions = {
    from: '"magaweb" <magawebtec@gmail.com>',
    to: to,
    name: name,
    subject: subject,
    // text: `Olá, ${name}, confirme seu cadastro.`,
    html: html
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true, message: 'Email enviado com sucesso!' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Erro ao enviar o email.' }
  }
})
