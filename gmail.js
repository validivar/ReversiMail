import { google } from 'googleapis';

export async function getGmailClient(accessToken) {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth });
}

export async function readEmails(gmailClient, maxResults = 5) {
  try {
    const res = await gmailClient.users.messages.list({
      userId: 'me',
      maxResults,
    });
    const messages = await Promise.all(
      (res.data.messages || []).map(async (msg) => {
        const detail = await gmailClient.users.messages.get({
          userId: 'me',
          id: msg.id,
        });
        return {
          id: msg.id,
          snippet: detail.data.snippet,
          subject: detail.data.payload?.headers?.find(h => h.name === 'Subject')?.value,
        };
      })
    );
    return messages;
  } catch (error) {
    console.error('Gmail read error:', error);
    return [];
  }
}

export async function createDraft(gmailClient, to, subject, body) {
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ];
  const email = emailLines.join('\r\n');
  const encodedMessage = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const res = await gmailClient.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw: encodedMessage } },
  });
  return res.data;
}

export async function sendEmail(gmailClient, to, subject, body) {
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ];
  const email = emailLines.join('\r\n');
  const encodedMessage = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const res = await gmailClient.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
  return res.data;
}