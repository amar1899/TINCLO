import nodemailer from 'nodemailer';

/**
 * Create transporter — tries Gmail first, falls back to Ethereal test account
 */
const getTransporter = async () => {
  // If Gmail credentials are properly configured, use Gmail
  if (
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your_gmail_app_password_here'
  ) {
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }),
      from: process.env.EMAIL_FROM || `TINCLO Jobs <${process.env.EMAIL_USER}>`,
    };
  }

  // Fallback: Ethereal (free test SMTP — emails viewable at ethereal.email)
  const testAccount = await nodemailer.createTestAccount();
  console.log('📧 Using Ethereal test email account:', testAccount.user);
  return {
    transporter: nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    from: `TINCLO Jobs <${testAccount.user}>`,
    isTest: true,
    testUser: testAccount.user,
    testPass: testAccount.pass,
  };
};

/**
 * Send job application confirmation email
 */
export const sendApplicationConfirmation = async ({ to, name, jobTitle, company, location, salary }) => {
  const { transporter, from, isTest } = await getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; }
        .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 18px; color: #1a202c; margin-bottom: 16px; }
        .job-card { background: linear-gradient(135deg, #f0f4ff, #faf0ff); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #667eea; }
        .job-title { font-size: 22px; font-weight: 700; color: #667eea; margin: 0 0 8px; }
        .job-company { font-size: 16px; font-weight: 600; color: #2d3748; margin: 0 0 16px; }
        .job-detail { margin: 8px 0; font-size: 14px; color: #4a5568; }
        .status-badge { display: inline-block; background: #c6f6d5; color: #22543d; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 14px; margin: 16px 0; }
        .next-steps { background: #f7fafc; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .next-steps h3 { color: #2d3748; margin: 0 0 12px; font-size: 16px; }
        .next-steps ul { margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8; }
        .footer { background: #f7fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #718096; font-size: 13px; margin: 4px 0; }
        .logo { font-size: 20px; font-weight: 900; color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💼 Application Submitted!</h1>
          <p>Your application has been received by TINCLO</p>
        </div>
        <div class="body">
          <p class="greeting">Hi <strong>${name}</strong>,</p>
          <p style="color:#4a5568;line-height:1.6;">Great news! Your application has been successfully submitted through <strong>TINCLO</strong>. Here's a summary:</p>
          <div class="job-card">
            <div class="job-title">${jobTitle}</div>
            <div class="job-company">🏢 ${company}</div>
            <div class="job-detail">📍 ${location}</div>
            <div class="job-detail">💰 ${salary || 'Salary not disclosed'}</div>
          </div>
          <div class="status-badge">✅ Application Status: Submitted</div>
          <div class="next-steps">
            <h3>📋 What happens next?</h3>
            <ul>
              <li>The hiring team will review your application</li>
              <li>If shortlisted, you'll be contacted within 5-7 business days</li>
              <li>Keep your profile updated on TINCLO for better visibility</li>
              <li>Continue exploring more opportunities on TINCLO</li>
            </ul>
          </div>
          <p style="color:#4a5568;font-size:14px;">Best of luck with your application! 🚀</p>
        </div>
        <div class="footer">
          <div class="logo">💼 TINCLO</div>
          <p>Your smart job matching platform</p>
          <p>This is an automated confirmation. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject: `✅ Application Confirmed: ${jobTitle} at ${company} — TINCLO`,
    html,
  });

  if (isTest) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('📧 Test email preview URL:', previewUrl);
    return { previewUrl };
  }

  console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
  return { messageId: info.messageId };
};

/**
 * Validate email domain — block disposable emails
 */
export const validateEmailDomain = async (email) => {
  const domain = email.split('@')[1];
  if (!domain) return false;

  const blockedDomains = [
    'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
    'yopmail.com', 'sharklasers.com', 'spam4.me', 'trashmail.com',
    'dispostable.com', 'fakeinbox.com', 'maildrop.cc', 'getairmail.com',
    'discard.email', 'spamgourmet.com', 'trashmail.me', 'temp-mail.org',
  ];

  return !blockedDomains.includes(domain.toLowerCase());
};
