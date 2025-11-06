import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    // Send notification to admin
    await client.emails.send({
      from: fromEmail,
      to: 'admin@idevr.com', // Replace with your actual admin email
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log(`[EMAIL] Contact form notification sent for: ${data.subject}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send contact notification:', error);
    // Don't throw error - contact form should still work even if email fails
    return false;
  }
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify Your Email - I-DevR Code',
      html: `
        <h2>Welcome to I-DevR Code!</h2>
        <p>Thank you for registering. Please use the following code to verify your email address:</p>
        <h1 style="font-size: 48px; font-weight: bold; color: #6366f1; letter-spacing: 8px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The I-DevR Code Team</p>
      `,
    });

    console.log(`[EMAIL] OTP sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send OTP email:', error);
    // Fallback to console logging for development
    console.log(`[EMAIL FALLBACK] OTP for ${email}: ${otp}`);
    return false;
  }
}

export async function sendPurchaseConfirmation(data: {
  email: string;
  username: string;
  templateTitle: string;
  amount: number;
}) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Purchase Confirmation - ${data.templateTitle}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Hi ${data.username},</p>
        <p>Your purchase of <strong>${data.templateTitle}</strong> has been confirmed.</p>
        <p><strong>Amount paid:</strong> $${(data.amount / 100).toFixed(2)}</p>
        <p>You can download your template from your account page at any time.</p>
        <p>This purchase includes lifetime updates and support.</p>
        <br>
        <p>Best regards,<br>The I-DevR Code Team</p>
      `,
    });

    console.log(`[EMAIL] Purchase confirmation sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send purchase confirmation:', error);
    return false;
  }
}
