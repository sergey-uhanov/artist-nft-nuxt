import nodemailer from 'nodemailer';

import {t} from '~~/i18n'

export async function sendVerificationEmail(email: string, token: string, locale: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const link = `${process.env.NUXT_BASE_URL}verify?token=${token}`;


    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: t(locale, 'auth.mail.subject'),
        html: `
      <p>${t(locale, 'auth.mail.confirmPrompt')}</p>
      <a href="${link}">${link}</a>
      <p>${t(locale, 'auth.mail.linkValid', {hours: 24})}</p>
    `
    })
}
