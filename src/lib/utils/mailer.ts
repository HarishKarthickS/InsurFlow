import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  // For production, use real SMTP settings from environment
  // For now, we'll try to use environment variables, or log to console if missing
  
  const hasConfig = process.env.EMAIL_SERVER && process.env.EMAIL_FROM;
  
  if (!hasConfig) {
    console.log('--- EMAIL MOCK ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html.substring(0, 100)}...`);
    console.log('-------------------');
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
