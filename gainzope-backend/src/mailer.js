import { config } from './config.js';

/**
 * Parses sender string like "GAINZOPE <updates@gainzope.in>" or "updates@gainzope.in"
 * into { name, email } object required by Brevo API.
 */
export function parseSender(fromStr) {
  if (!fromStr) return { name: 'Gainzope', email: 'gainzope.business@gmail.com' };

  // Format 1: "Name <email@domain.com>"
  const angleMatch = fromStr.match(/^(.*?)\s*<([^>]+)>$/);
  if (angleMatch) {
    return {
      name: angleMatch[1].trim() || 'Gainzope',
      email: angleMatch[2].trim()
    };
  }

  // Format 2: "Name email@domain.com"
  const spaceMatch = fromStr.match(/^(.*?)\s+([^\s@]+@[^\s@]+\.[^\s@]+)$/);
  if (spaceMatch) {
    return {
      name: spaceMatch[1].trim() || 'Gainzope',
      email: spaceMatch[2].trim()
    };
  }

  // Format 3: "email@domain.com"
  if (fromStr.includes('@')) {
    return { name: 'Gainzope', email: fromStr.trim() };
  }

  return { name: 'Gainzope', email: 'gainzope.business@gmail.com' };
}

/**
 * Ensures Brevo API key is available.
 */
export function assertMailerConfigured() {
  if (!config.brevoApiKey) {
    throw new Error('Email sending is not configured. Add BREVO_API_KEY to the backend .env.');
  }
}

/**
 * Send a single transactional email via Brevo API v3
 * @param {Object} options
 * @param {string|string[]|{email: string, name?: string}[]} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 * @param {{name: string, email: string}} [options.sender]
 */
export async function sendEmail({ to, subject, html, text, sender }) {
  assertMailerConfigured();

  const senderObj = sender || parseSender(config.emailFrom);
  const recipients = (Array.isArray(to) ? to : [to]).map((item) =>
    typeof item === 'string' ? { email: item } : item
  );

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.brevoApiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      sender: senderObj,
      to: recipients,
      subject,
      htmlContent: html,
      textContent: text || undefined
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || 'Brevo email service failed to send email.';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data.code;
    error.details = data;
    throw error;
  }

  return data;
}

/**
 * Send broadcast / campaign emails to multiple recipients using Brevo messageVersions.
 * Each recipient receives their own isolated copy (no cross-visible recipients).
 * @param {Object} options
 * @param {string[]} options.recipients
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 * @param {{name: string, email: string}} [options.sender]
 * @param {number} [options.batchSize=100]
 */
export async function sendBatchEmails({ recipients, subject, html, text, sender, batchSize = 100 }) {
  assertMailerConfigured();

  const senderObj = sender || parseSender(config.emailFrom);

  for (let index = 0; index < recipients.length; index += batchSize) {
    const chunk = recipients.slice(index, index + batchSize);
    const messageVersions = chunk.map((email) => ({
      to: [{ email: typeof email === 'string' ? email : email.email }]
    }));

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': config.brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        sender: senderObj,
        subject,
        htmlContent: html,
        textContent: text || undefined,
        messageVersions
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data.message || 'Brevo email service failed during batch broadcast.';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.code = data.code;
      error.details = data;
      throw error;
    }
  }

  return { success: true, count: recipients.length };
}
