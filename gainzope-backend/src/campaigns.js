import { z } from 'zod';
import { config } from './config.js';
import { db } from './db.js';
import { sendEmail, sendBatchEmails } from './mailer.js';

const campaignSchema = z.object({
  content: z.string().trim().min(10).max(12000),
  preview: z.string().trim().max(160).optional().default(''),
  subject: z.string().trim().min(3).max(160),
  testEmail: z.string().trim().email().max(254).optional()
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function emailMarkup(campaign) {
  const body = escapeHtml(campaign.content).replace(/\n/g, '<br />');
  const preview = campaign.preview ? '<div style="display:none;max-height:0;overflow:hidden;opacity:0">' + escapeHtml(campaign.preview) + '</div>' : '';
  return preview + '<main style="max-width:600px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#10110e;line-height:1.65"><p style="margin:0 0 28px;font-size:18px;font-weight:800">GAINZOPE</p><div style="font-size:16px">' + body + '</div><hr style="border:0;border-top:1px solid #e5e5df;margin:32px 0 18px" /><p style="margin:0;color:#6c7068;font-size:12px">You are receiving this because you signed up for GAINZOPE updates.</p></main>';
}

export async function sendTestCampaign(input) {
  const campaign = campaignSchema.parse(input);
  if (!campaign.testEmail) throw new Error('A test email address is required.');

  if (!config.brevoApiKey) {
    console.log(`[Dev Simulation] Test email simulated for ${campaign.testEmail}: ${campaign.subject}`);
    return {
      message: `[Dev Simulation] Test email generated for ${campaign.testEmail}. Set BREVO_API_KEY in .env for live dispatch.`,
      simulated: true
    };
  }

  await sendEmail({
    to: campaign.testEmail.toLowerCase(),
    subject: campaign.subject,
    html: emailMarkup(campaign),
    text: campaign.content
  });

  return { message: 'Test email sent to ' + campaign.testEmail + ' via Brevo.' };
}

export async function sendCampaign(input, admin) {
  const campaign = campaignSchema.parse(input);
  const recipients = await db().collection('waitlistSubscribers').find({ status: 'active' }, { projection: { email: 1 } }).toArray();
  if (!recipients.length) throw new Error('There are no active email subscribers yet.');
  const emails = recipients.map((subscriber) => subscriber.email);
  const now = new Date();

  if (!config.brevoApiKey) {
    const record = {
      content: campaign.content,
      createdAt: now,
      createdBy: admin.email,
      preview: campaign.preview,
      recipientCount: emails.length,
      sentAt: now,
      status: 'simulated (dev)',
      subject: campaign.subject,
      updatedAt: now
    };
    const result = await db().collection('emailCampaigns').insertOne(record);
    console.log(`[Dev Simulation] Broadcast recorded in MongoDB for ${emails.length} recipients.`);
    return {
      id: result.insertedId,
      recipientCount: emails.length,
      message: `[Dev Mode] Campaign broadcast recorded for ${emails.length} subscriber(s) in MongoDB. Set BREVO_API_KEY in .env for live delivery.`,
      simulated: true
    };
  }

  const record = {
    content: campaign.content,
    createdAt: now,
    createdBy: admin.email,
    preview: campaign.preview,
    recipientCount: emails.length,
    sentAt: null,
    status: 'sending',
    subject: campaign.subject,
    updatedAt: now
  };
  const result = await db().collection('emailCampaigns').insertOne(record);

  try {
    await sendBatchEmails({
      recipients: emails,
      subject: campaign.subject,
      html: emailMarkup(campaign),
      text: campaign.content
    });

    await db().collection('emailCampaigns').updateOne(
      { _id: result.insertedId },
      { $set: { sentAt: new Date(), status: 'sent', updatedAt: new Date() } }
    );
    return {
      id: result.insertedId,
      recipientCount: emails.length,
      message: 'Campaign sent to ' + emails.length + ' subscriber' + (emails.length === 1 ? '' : 's') + ' via Brevo.'
    };
  } catch (error) {
    await db().collection('emailCampaigns').updateOne(
      { _id: result.insertedId },
      { $set: { status: 'failed', failureReason: error.message, updatedAt: new Date() } }
    );
    throw error;
  }
}

export async function listCampaigns() {
  return db().collection('emailCampaigns').find({}, { projection: { content: 0 } }).sort({ createdAt: -1 }).limit(12).toArray();
}
