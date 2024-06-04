import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

type TRecipients = string | Mail.Address | (string | Mail.Address)[];

interface IEmailPayload {
  recipients: TRecipients; // Comma separated list or an array of recipients email
  cc_recipients?: TRecipients; // Comma separated list or an array of cc recipients email
  bcc_recipients?: TRecipients; // Comma separated list or an array of bcc recipients email
  subject: string;
  from?: string | Mail.Address;
  bodyText?: string;
  html?: string;
  attachments?: Mail.Attachment[]; // refer https://nodemailer.com/message/attachments/ for details
}

const sendEmail = async (payload: IEmailPayload) => {
  const host = process.env.MAILER_SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.MAILER_SMTP_USER_EMAIL;
  const pass = process.env.MAILER_SMTP_CRED;
  try {
    if (!host) throw new Error("Failed to get MAILER_SMTP_HOST from .env");
    if (!port) throw new Error("Failed to get SMTP_PORT from .env");
    if (!user)
      throw new Error("Failed to get MAILER_SMTP_USER_EMAIL from .env");
    if (!pass) throw new Error("Failed to get MAILER_SMTP_CRED from .env");

    if (!payload?.bodyText && !payload?.html)
      throw new Error("Either bodyText or html is required");

    const transporter = createTransport({
      port: parseInt(port),
      host: host,
      auth: {
        user,
        pass,
      },
      pool: true,
      maxConnections: 2,
      connectionTimeout: 5 * 60 * 1000, // 5 minutes default is 3 minutes
      greetingTimeout: 3 * 60 * 1000, // 3 minutes default is 30 seconds
      logger: true, // For debugging purposes
      debug: true, // For debugging purposes
      tls: {
        rejectUnauthorized: false, // This allows the hostname with no valid certificate
      },
    });

    await transporter.verify(); // verify the connection before sending email

    const options: Mail.Options = {
      from: payload?.from || user,
      to: payload?.recipients,
      cc: payload?.cc_recipients,
      subject: payload?.subject,
      text: payload?.bodyText,
      html: payload?.html,
      attachments: payload?.attachments,
    };

    const response = await transporter.sendMail(options);
    return {
      success: true,
      message: "Email sent successfully",
      mailResponse: response,
    };
  } catch (error: any) {
    return { success: false, message: error?.message, mailResponse: null };
  }
};

export default sendEmail;
