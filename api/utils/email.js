import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html, text }) {
  const emailService = process.env.EMAIL_SERVICE || 'smtp';
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM || 'Liliye <noreply@liliye.love>';

  if (!emailUser || !emailPass || emailUser === 'demo@liliye.love') {
    console.log(`[EMAIL SIMULATED - No credentials set] To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      text,
      html
    });

    console.log(`[EMAIL SENT] MessageId: ${info.messageId} To: ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR]', err);
    return { success: false, error: err.message };
  }
}

export function buildNotificationEmailHtml({ title, messageText, actionUrl, actionText }) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px; background-color: #fff0f5; border-radius: 24px; border: 1px solid #ffd0e0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ff2a75; font-size: 26px; margin: 0; font-weight: 700;">💖 ${title}</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 18px; box-shadow: 0 10px 25px rgba(255, 42, 117, 0.08); margin-bottom: 24px;">
        <p style="font-size: 16px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">${messageText}</p>
        ${actionUrl ? `
          <div style="text-align: center; margin-top: 24px;">
            <a href="${actionUrl}" style="background-color: #ff2a75; color: white; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 15px; display: inline-block;">${actionText || 'Open Conversation'}</a>
          </div>
        ` : ''}
      </div>
      <div style="text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">Liliye Private Experience • Till The End Of Time</p>
      </div>
    </div>
  `;
}
