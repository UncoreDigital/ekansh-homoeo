/**
 * Ekansh Homoeopathic Clinic - SMTP Email Notification Service (Nodemailer)
 *
 * Server-side email dispatch for clinic notifications and patient appointment
 * confirmations/rejections using configurable SMTP credentials.
 *
 * Designed with decoupled error handling: failures here will NEVER throw or
 * roll back a successful database submission.
 */

import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const DEFAULT_SMTP_HOST = 'smtp.gmail.com';
const DEFAULT_SMTP_PORT = 465;
const SMTP_CONNECTION_TIMEOUT_MS = 10_000;
const SMTP_GREETING_TIMEOUT_MS = 10_000;
const SMTP_SOCKET_TIMEOUT_MS = 15_000;

export interface ConsultationNotificationPayload {
  id?: string;
  patient_name: string;
  phone: string;
  email?: string | null;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  message?: string | null;
  created_at?: string;
}

export interface ContactNotificationPayload {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  interest: string;
  message: string;
  created_at?: string;
}

export interface PatientConfirmationPayload {
  patient_name: string;
  patient_email: string;
  consultation_type: string;
  confirmed_date: string;
  confirmed_time: string;
  admin_note?: string | null;
  clinic_phone?: string;
}

export interface PatientRejectionPayload {
  patient_name: string;
  patient_email: string;
  consultation_type: string;
  requested_date: string;
  requested_time: string;
  admin_note?: string | null;
  clinic_phone?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  clinicNotificationEmail: string;
  clinicNotificationCcEmail: string;
}

type TransportCredentials = Pick<SmtpConfig, 'host' | 'port' | 'user' | 'pass'>;

let cachedTransporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;
let cachedTransportConfig: TransportCredentials | null = null;

function readEnv(name: string): string {
  const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const processVal = nodeProcess?.env?.[name];
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> }).env?.[name];
  const metaVal = typeof metaEnv === 'string' ? metaEnv : undefined;
  return (processVal || metaVal || '').trim();
}

function getSmtpConfig(): SmtpConfig {
  const host = readEnv('SMTP_HOST') || DEFAULT_SMTP_HOST;
  const rawPort = readEnv('SMTP_PORT');
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : DEFAULT_SMTP_PORT;
  const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_SMTP_PORT;

  const user = readEnv('SMTP_USER');
  const pass = readEnv('SMTP_PASS');
  const fromEnv = readEnv('SMTP_FROM_EMAIL');
  const clinicNotificationEmail = readEnv('CLINIC_NOTIFICATION_EMAIL');
  const clinicNotificationCcEmail = readEnv('CLINIC_NOTIFICATION_CC_EMAIL');

  const from = fromEnv || (user ? (user.includes('<') ? user : `Ekansh Clinic <${user}>`) : '');

  return {
    host,
    port,
    user,
    pass,
    from,
    clinicNotificationEmail,
    clinicNotificationCcEmail,
  };
}

function hasSameTransportConfig(
  cached: TransportCredentials | null,
  next: SmtpConfig
): boolean {
  if (!cached) return false;
  return (
    cached.host === next.host &&
    cached.port === next.port &&
    cached.user === next.user &&
    cached.pass === next.pass
  );
}

function getTransporter(config: SmtpConfig): Transporter<SMTPTransport.SentMessageInfo> {
  if (cachedTransporter && hasSameTransportConfig(cachedTransportConfig, config)) {
    return cachedTransporter;
  }

  const transportOptions: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    greetingTimeout: SMTP_GREETING_TIMEOUT_MS,
    socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
  };

  cachedTransporter = nodemailer.createTransport(transportOptions);
  cachedTransportConfig = {
    host: config.host,
    port: config.port,
    user: config.user,
    pass: config.pass,
  };
  return cachedTransporter;
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMultilineHtml(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function formatSubmittedAtIst(createdAt?: string): string {
  const date = createdAt ? new Date(createdAt) : new Date();
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

interface DispatchParams {
  context: string;
  to: string;
  cc?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

async function dispatchSmtpEmail(
  params: DispatchParams,
  config: SmtpConfig
): Promise<EmailDispatchResult> {
  if (typeof window !== 'undefined') {
    return {
      success: false,
      skipped: true,
      error: 'Email dispatch is restricted to server-side execution.',
    };
  }

  if (!config.host || !config.user || !config.pass) {
    console.warn(`[Mailer Warning] SMTP configuration is incomplete for ${params.context}. Email skipped.`);
    return {
      success: false,
      skipped: true,
      error: 'SMTP configuration missing (SMTP_USER / SMTP_PASS)',
    };
  }

  if (!params.to) {
    return {
      success: false,
      skipped: true,
      error: 'Recipient email address is missing',
    };
  }

  try {
    const transporter = getTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: params.to,
      cc: params.cc || undefined,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || undefined,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Mailer Error sending ${params.context}]:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Dispatches an email notification for a new consultation request.
 */
export async function sendConsultationNotification(
  payload: ConsultationNotificationPayload
): Promise<EmailDispatchResult> {
  const config = getSmtpConfig();

  if (!config.clinicNotificationEmail) {
    console.warn('[Mailer Warning] CLINIC_NOTIFICATION_EMAIL is not configured. Consultation notification skipped.');
    return {
      success: false,
      skipped: true,
      error: 'CLINIC_NOTIFICATION_EMAIL not configured',
    };
  }

  const subject = `🩺 New Consultation Request: ${payload.patient_name} (${payload.consultation_type})`;
  const submittedAt = formatSubmittedAtIst(payload.created_at);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #232b25; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2ddd2; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3d2f; color: #ffffff; padding: 24px 30px; text-align: left; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #a8c3b0; }
        .content { padding: 30px; }
        .badge { display: inline-block; padding: 4px 10px; background-color: #eaf1ec; color: #1e3d2f; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-table td { padding: 10px 12px; border-bottom: 1px solid #f0ede6; font-size: 14px; }
        .info-table td.label { font-weight: 600; color: #5a665d; width: 38%; }
        .info-table td.value { color: #1e2621; }
        .message-box { background-color: #faf8f5; border-left: 3px solid #1e3d2f; padding: 14px 18px; margin-top: 10px; font-size: 14px; line-height: 1.5; color: #333d36; }
        .action-button { display: inline-block; background-color: #1e3d2f; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 10px; }
        .footer { padding: 20px 30px; background-color: #f7f5f0; border-top: 1px solid #e2ddd2; font-size: 12px; color: #768379; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ekansh Homoeopathic Clinic</h1>
          <p>Online Patient Intake Notification Desk</p>
        </div>
        <div class="content">
          <span class="badge">Status: Pending Confirmation</span>
          <h2 style="font-size: 18px; margin-top: 0; color: #1e3d2f;">New Patient Consultation Request</h2>
          <p style="font-size: 14px; color: #5a665d; margin-bottom: 20px;">
            A new intake appointment request has been submitted through the clinic website. Please review the details below:
          </p>

          <table class="info-table">
            <tr>
              <td class="label">Patient Name</td>
              <td class="value"><strong>${escapeHtml(payload.patient_name)}</strong></td>
            </tr>
            <tr>
              <td class="label">Contact Phone</td>
              <td class="value"><a href="tel:${escapeHtml(payload.phone)}" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">${escapeHtml(payload.phone)}</a></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value">${payload.email ? escapeHtml(payload.email) : '<em>Not provided</em>'}</td>
            </tr>
            <tr>
              <td class="label">Consultation Modality</td>
              <td class="value"><strong>${escapeHtml(payload.consultation_type)}</strong></td>
            </tr>
            <tr>
              <td class="label">Requested Date</td>
              <td class="value">${escapeHtml(payload.preferred_date)}</td>
            </tr>
            <tr>
              <td class="label">Requested Time Slot</td>
              <td class="value">${escapeHtml(payload.preferred_time)}</td>
            </tr>
            <tr>
              <td class="label">Submission Time</td>
              <td class="value">${escapeHtml(submittedAt)} IST</td>
            </tr>
            ${payload.id ? `<tr><td class="label">Database Record ID</td><td class="value" style="font-family: monospace; font-size: 12px;">${escapeHtml(payload.id)}</td></tr>` : ''}
          </table>

          <div style="margin-top: 16px;">
            <strong style="font-size: 13px; color: #5a665d; text-transform: uppercase; letter-spacing: 0.05em;">Patient Health Concern / Notes:</strong>
            <div class="message-box">
              ${payload.message ? formatMultilineHtml(payload.message) : '<em>No additional health details entered.</em>'}
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="${escapeHtml(`https://wa.me/${payload.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(payload.patient_name)},%20this%20is%20Ekansh%20Homoeopathic%20Clinic%20confirming%20your%20consultation%20request%20for%20${encodeURIComponent(payload.preferred_date)}.`)}" class="action-button">
              Contact Patient via WhatsApp
            </a>
          </div>
        </div>
        <div class="footer">
          Sent by Ekansh Homoeopathic Clinic Web Portal • Rajsamand, Rajasthan<br>
          Connected to Supabase Database &amp; Resend
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
NEW CONSULTATION REQUEST - EKANSH HOMOEOPATHIC CLINIC
-------------------------------------------------------
Patient Name: ${payload.patient_name}
Phone: ${payload.phone}
Email: ${payload.email || 'Not provided'}
Modality: ${payload.consultation_type}
Preferred Date: ${payload.preferred_date}
Preferred Time: ${payload.preferred_time}
Submitted At: ${submittedAt} IST
${payload.id ? `Record ID: ${payload.id}\n` : ''}
Health Concern / Notes:
${payload.message || 'None provided'}
-------------------------------------------------------
This is an automated notification from the clinic website intake system.
  `.trim();

  return dispatchSmtpEmail(
    {
      context: 'consultation notification',
      to: config.clinicNotificationEmail,
      cc: config.clinicNotificationCcEmail || undefined,
      subject,
      html: htmlContent,
      text: textContent,
      replyTo: payload.email || undefined,
    },
    config
  );
}

/**
 * Dispatches an email notification for a general contact inquiry.
 */
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<EmailDispatchResult> {
  const config = getSmtpConfig();

  if (!config.clinicNotificationEmail) {
    console.warn('[Mailer Warning] CLINIC_NOTIFICATION_EMAIL is not configured. Contact notification skipped.');
    return {
      success: false,
      skipped: true,
      error: 'CLINIC_NOTIFICATION_EMAIL not configured',
    };
  }

  const subject = `📩 New Website Inquiry: ${payload.name} - ${payload.interest}`;
  const submittedAt = formatSubmittedAtIst(payload.created_at);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #232b25; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2ddd2; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3d2f; color: #ffffff; padding: 24px 30px; text-align: left; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #a8c3b0; }
        .content { padding: 30px; }
        .badge { display: inline-block; padding: 4px 10px; background-color: #eaf1ec; color: #1e3d2f; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-table td { padding: 10px 12px; border-bottom: 1px solid #f0ede6; font-size: 14px; }
        .info-table td.label { font-weight: 600; color: #5a665d; width: 38%; }
        .info-table td.value { color: #1e2621; }
        .message-box { background-color: #faf8f5; border-left: 3px solid #1e3d2f; padding: 14px 18px; margin-top: 10px; font-size: 14px; line-height: 1.5; color: #333d36; }
        .action-button { display: inline-block; background-color: #1e3d2f; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 10px; }
        .footer { padding: 20px 30px; background-color: #f7f5f0; border-top: 1px solid #e2ddd2; font-size: 12px; color: #768379; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ekansh Homoeopathic Clinic</h1>
          <p>Online Inquiry Notification Desk</p>
        </div>
        <div class="content">
          <span class="badge">Inquiry: ${escapeHtml(payload.interest)}</span>
          <h2 style="font-size: 18px; margin-top: 0; color: #1e3d2f;">New Contact Inquiry Received</h2>
          <p style="font-size: 14px; color: #5a665d; margin-bottom: 20px;">
            A visitor has sent an inquiry via the clinic contact page:
          </p>

          <table class="info-table">
            <tr>
              <td class="label">Sender Name</td>
              <td class="value"><strong>${escapeHtml(payload.name)}</strong></td>
            </tr>
            <tr>
              <td class="label">Contact Phone</td>
              <td class="value"><a href="tel:${escapeHtml(payload.phone)}" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">${escapeHtml(payload.phone)}</a></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value">${payload.email ? escapeHtml(payload.email) : '<em>Not provided</em>'}</td>
            </tr>
            <tr>
              <td class="label">Inquiry Nature</td>
              <td class="value"><strong>${escapeHtml(payload.interest)}</strong></td>
            </tr>
            <tr>
              <td class="label">Submission Time</td>
              <td class="value">${escapeHtml(submittedAt)} IST</td>
            </tr>
            ${payload.id ? `<tr><td class="label">Database Record ID</td><td class="value" style="font-family: monospace; font-size: 12px;">${escapeHtml(payload.id)}</td></tr>` : ''}
          </table>

          <div style="margin-top: 16px;">
            <strong style="font-size: 13px; color: #5a665d; text-transform: uppercase; letter-spacing: 0.05em;">Message Body:</strong>
            <div class="message-box">
              ${formatMultilineHtml(payload.message)}
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="${escapeHtml(`https://wa.me/${payload.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(payload.name)},%20this%20is%20Ekansh%20Homoeopathic%20Clinic%20responding%20to%20your%20inquiry%20regarding%20${encodeURIComponent(payload.interest)}.`)}" class="action-button">
              Reply via WhatsApp
            </a>
          </div>
        </div>
        <div class="footer">
          Sent by Ekansh Homoeopathic Clinic Web Portal • Rajsamand, Rajasthan<br>
          Connected to Supabase Database &amp; Resend
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
NEW WEBSITE INQUIRY - EKANSH HOMOEOPATHIC CLINIC
-------------------------------------------------------
Sender Name: ${payload.name}
Phone: ${payload.phone}
Email: ${payload.email || 'Not provided'}
Topic: ${payload.interest}
Submitted At: ${submittedAt} IST
${payload.id ? `Record ID: ${payload.id}\n` : ''}
Message:
${payload.message}
-------------------------------------------------------
This is an automated notification from the clinic website contact desk.
  `.trim();

  return dispatchSmtpEmail(
    {
      context: 'contact notification',
      to: config.clinicNotificationEmail,
      cc: config.clinicNotificationCcEmail || undefined,
      subject,
      html: htmlContent,
      text: textContent,
      replyTo: payload.email || undefined,
    },
    config
  );
}

/**
 * Dispatches an appointment confirmation email to the PATIENT after clinic staff
 * accepts their consultation request from the admin dashboard.
 */
export async function sendPatientAppointmentConfirmation(
  payload: PatientConfirmationPayload
): Promise<EmailDispatchResult> {
  const config = getSmtpConfig();

  if (!payload.patient_email) {
    return { success: false, error: 'Patient email address is missing' };
  }

  const subject = `Appointment Confirmed - Ekansh Homoeopathic Clinic (${payload.confirmed_date})`;
  const clinicPhone = payload.clinic_phone || '+91 9799988138';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #232b25; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2ddd2; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3d2f; color: #ffffff; padding: 28px 30px; text-align: left; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #a8c3b0; }
        .content { padding: 32px 30px; }
        .greeting { font-size: 16px; font-weight: 600; color: #1e3d2f; margin-top: 0; margin-bottom: 12px; }
        .intro-text { font-size: 14px; line-height: 1.6; color: #3f4a42; margin-bottom: 24px; }
        .appointment-card { background-color: #f8faf8; border: 1.5px solid #dbe6de; border-radius: 6px; padding: 18px 22px; margin-bottom: 24px; }
        .card-heading { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #1e3d2f; margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid #e2ece4; padding-bottom: 8px; }
        .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid #f0f4f1; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #5a665d; font-weight: 500; }
        .detail-value { color: #1e2621; font-weight: 600; text-align: right; }
        .note-box { background-color: #faf7f0; border-left: 3px solid #c8a261; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; line-height: 1.5; color: #524734; border-radius: 0 4px 4px 0; }
        .guidelines-box { background-color: #ffffff; border: 1px solid #e2ddd2; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #434e45; line-height: 1.6; }
        .guidelines-box h4 { margin: 0 0 8px 0; color: #1e3d2f; font-size: 14px; }
        .guidelines-box ul { margin: 0; padding-left: 18px; }
        .guidelines-box li { margin-bottom: 4px; }
        .contact-box { background-color: #f7f5f0; border-radius: 6px; padding: 16px 20px; font-size: 13px; color: #434e45; line-height: 1.5; margin-bottom: 24px; }
        .contact-box strong { color: #1e3d2f; }
        .closing { font-size: 14px; line-height: 1.6; color: #3f4a42; border-top: 1px solid #f0ede6; padding-top: 20px; }
        .signature { margin-top: 12px; font-weight: 600; color: #1e3d2f; }
        .signature small { display: block; font-weight: normal; color: #5a665d; font-size: 12px; }
        .footer { padding: 20px 30px; background-color: #f7f5f0; border-top: 1px solid #e2ddd2; font-size: 12px; color: #768379; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ekansh Homoeopathic Clinic</h1>
          <p>Classical Constitutional Homoeopathy • Rajsamand, Rajasthan</p>
        </div>
        <div class="content">
          <p class="greeting">Dear ${escapeHtml(payload.patient_name)},</p>
          <p class="intro-text">
            We are pleased to inform you that your consultation request at <strong>Ekansh Homoeopathic Clinic</strong> has been accepted and confirmed by our clinic reception desk.
          </p>

          <div class="appointment-card">
            <div class="card-heading">Confirmed Appointment Details</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px; width: 40%;">Patient Name:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.patient_name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Appointment Date:</td>
                <td style="padding: 6px 0; color: #1e3d2f; font-weight: 700; font-size: 14px;">${escapeHtml(payload.confirmed_date)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Confirmed Time Window:</td>
                <td style="padding: 6px 0; color: #1e3d2f; font-weight: 700; font-size: 14px;">${escapeHtml(payload.confirmed_time)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Consultation Mode:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.consultation_type)}</td>
              </tr>
            </table>
          </div>

          ${payload.admin_note ? `
          <div class="note-box">
            <strong>Desk Note:</strong> ${formatMultilineHtml(payload.admin_note)}
          </div>
          ` : ''}

          <div class="guidelines-box">
            <h4>Before Your Visit – Preparation Guidelines</h4>
            <ul>
              <li><strong>Medical Records:</strong> Bring previous prescriptions, medical reports, and diagnostic test results.</li>
              <li><strong>Current Medications:</strong> Keep a list of all current medicines, supplements, and vitamins.</li>
              <li><strong>Prescription Continuity:</strong> Do not stop any prescribed conventional medication without consulting your treating physician.</li>
              <li><strong>Online Consultations:</strong> Ensure a quiet space, stable internet connection, and keep digital medical documents ready.</li>
              <li><strong>In-Clinic Consultations:</strong> Please arrive 10 minutes before your scheduled slot.</li>
              <li><strong>Desk Assistance:</strong> If you have questions before your visit, contact our clinic desk by phone or WhatsApp.</li>
            </ul>
          </div>

          <div class="contact-box">
            <strong>Clinic Coordinates &amp; Assistance:</strong><br>
            📍 Near Vijay Travels, Vivekanand Choraya, Bhilwara Road, Kankroli, Rajsamand – 313324, Rajasthan, India<br>
            📞 Phone: <a href="tel:${escapeHtml(clinicPhone.replace(/[^0-9\+]/g, ''))}" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">${escapeHtml(clinicPhone)}</a> &bull; <a href="tel:+919521646525" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">+91 9521646525</a><br>
            💬 WhatsApp: <a href="https://wa.me/919799988138" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">Direct WhatsApp Desk (+91 9799988138)</a>
          </div>

          <div class="closing">
            <p>If you need to reschedule or have questions before your visit, please contact our reception desk as early as possible.</p>
            <p>We look forward to partnering with you on your healing journey.</p>
            <div class="signature">
              Warm regards,<br>
              Ekansh Homoeopathic Clinic Desk
              <small>Rajsamand, Rajasthan, India</small>
            </div>
          </div>
        </div>
        <div class="footer">
          This is an official appointment confirmation issued by Ekansh Homoeopathic Clinic.<br>
          © Ekansh Homoeopathic Clinic • Confidential Patient Communication
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
APPOINTMENT CONFIRMATION - EKANSH HOMOEOPATHIC CLINIC
-------------------------------------------------------
Dear ${payload.patient_name},

Your consultation request at Ekansh Homoeopathic Clinic has been confirmed!

CONFIRMED APPOINTMENT DETAILS:
- Patient Name: ${payload.patient_name}
- Confirmed Date: ${payload.confirmed_date}
- Confirmed Time: ${payload.confirmed_time}
- Consultation Mode: ${payload.consultation_type}
${payload.admin_note ? `- Desk Note: ${payload.admin_note}\n` : ''}
CLINIC LOCATION & CONTACT:
- Address: Near Vijay Travels, Vivekanand Choraya, Bhilwara Road, Kankroli, Rajsamand – 313324, Rajasthan, India
- Phone: ${clinicPhone} / +91 9521646525
- WhatsApp: +91 9799988138

BEFORE YOUR VISIT – PREPARATION GUIDELINES:
1. Bring previous prescriptions, medical reports, and diagnostic test results.
2. Keep a list of all current medicines, supplements, and vitamins.
3. Do not stop any prescribed conventional medication without consulting your treating physician.
4. For online consultations, ensure a quiet space, stable internet connection, and keep digital medical documents ready.
5. For in-clinic consultations, please arrive 10 minutes before your scheduled slot.
6. If you have questions before your visit, contact our clinic desk by phone or WhatsApp.

If you need to reschedule, please reach out via phone or WhatsApp.

Warm regards,
Ekansh Homoeopathic Clinic Desk
Rajsamand, Rajasthan, India
-------------------------------------------------------
  `.trim();

  return dispatchSmtpEmail(
    {
      context: 'patient confirmation',
      to: payload.patient_email,
      cc: config.clinicNotificationEmail || undefined,
      subject,
      html: htmlContent,
      text: textContent,
      replyTo: config.clinicNotificationEmail || undefined,
    },
    config
  );
}

/**
 * Dispatches a polite notification email to a patient when their requested
 * consultation slot cannot be accommodated by the clinic desk.
 */
export async function sendPatientAppointmentRejection(
  payload: PatientRejectionPayload
): Promise<EmailDispatchResult> {
  const config = getSmtpConfig();

  if (!payload.patient_email) {
    return { success: false, error: 'Patient email address is missing' };
  }

  const subject = `Update on Your Consultation Request – Ekansh Homoeopathic Clinic`;
  const clinicPhone = payload.clinic_phone || '+91 9799988138';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #232b25; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2ddd2; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3d2f; color: #ffffff; padding: 28px 30px; text-align: left; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #a8c3b0; }
        .content { padding: 32px 30px; }
        .greeting { font-size: 16px; font-weight: 600; color: #1e3d2f; margin-top: 0; margin-bottom: 12px; }
        .intro-text { font-size: 14px; line-height: 1.6; color: #3f4a42; margin-bottom: 20px; }
        .rejection-notice-box { background-color: #FEF9E7; border-left: 4px solid #D4AC0D; padding: 14px 18px; margin-bottom: 24px; font-size: 14px; line-height: 1.55; color: #7D6608; border-radius: 0 6px 6px 0; }
        .appointment-card { background-color: #fcfbf8; border: 1.5px solid #ece7db; border-radius: 6px; padding: 18px 22px; margin-bottom: 24px; }
        .card-heading { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #1e3d2f; margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid #e8e2d4; padding-bottom: 8px; }
        .note-box { background-color: #faf7f0; border-left: 3px solid #c8a261; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; line-height: 1.5; color: #524734; border-radius: 0 4px 4px 0; }
        .next-steps-box { background-color: #ffffff; border: 1px solid #e2ddd2; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #434e45; line-height: 1.6; }
        .next-steps-box h4 { margin: 0 0 8px 0; color: #1e3d2f; font-size: 14px; }
        .contact-box { background-color: #f7f5f0; border-radius: 6px; padding: 16px 20px; font-size: 13px; color: #434e45; line-height: 1.5; margin-bottom: 24px; }
        .contact-box strong { color: #1e3d2f; }
        .action-button { display: inline-block; background-color: #1e3d2f; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 8px; }
        .closing { font-size: 14px; line-height: 1.6; color: #3f4a42; border-top: 1px solid #f0ede6; padding-top: 20px; }
        .signature { margin-top: 12px; font-weight: 600; color: #1e3d2f; }
        .signature small { display: block; font-weight: normal; color: #5a665d; font-size: 12px; }
        .footer { padding: 20px 30px; background-color: #f7f5f0; border-top: 1px solid #e2ddd2; font-size: 12px; color: #768379; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ekansh Homoeopathic Clinic</h1>
          <p>Classical Constitutional Homoeopathy • Rajsamand, Rajasthan</p>
        </div>
        <div class="content">
          <p class="greeting">Hello ${escapeHtml(payload.patient_name)},</p>
          <p class="intro-text">
            Thank you for considering Ekansh Homoeopathic Clinic.
          </p>

          <div class="rejection-notice-box">
            After reviewing your consultation request, we regret that we are unable to accommodate your requested appointment slot at this time.
          </div>

          <div class="appointment-card">
            <div class="card-heading">Requested Slot Details</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px; width: 40%;">Patient Name:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.patient_name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Requested Date:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.requested_date)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Requested Time Slot:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.requested_time)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #5a665d; font-size: 14px;">Consultation Mode:</td>
                <td style="padding: 6px 0; color: #1e2621; font-weight: 600; font-size: 14px;">${escapeHtml(payload.consultation_type)}</td>
              </tr>
            </table>
          </div>

          ${payload.admin_note ? `
          <div class="note-box">
            <strong>Desk Note:</strong> ${formatMultilineHtml(payload.admin_note)}
          </div>
          ` : ''}

          <div class="next-steps-box">
            <h4 style="margin: 0 0 8px 0; color: #1e3d2f; font-size: 14px;">Arranging an Alternative Slot</h4>
            <p style="margin: 0 0 10px 0;">
              Please note that only the requested appointment slot could not be accommodated. We would be pleased to assist you with finding an alternative date or time that fits your schedule.
            </p>
            <p style="margin: 0;">
              Please contact our clinic desk directly to explore alternate appointment timings.
            </p>
          </div>

          <div class="contact-box">
            <strong>Clinic Coordinates &amp; Desk Assistance:</strong><br>
            📍 Near Vijay Travels, Vivekanand Choraya, Bhilwara Road, Kankroli, Rajsamand – 313324, Rajasthan, India<br>
            📞 Phone: <a href="tel:${escapeHtml(clinicPhone.replace(/[^0-9\+]/g, ''))}" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">${escapeHtml(clinicPhone)}</a> &bull; <a href="tel:+919521646525" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">+91 9521646525</a><br>
            💬 WhatsApp: <a href="https://wa.me/919799988138" style="color: #1e3d2f; text-decoration: none; font-weight: 600;">Connect with Desk on WhatsApp (+91 9799988138)</a>
            <div style="margin-top: 12px;">
              <a href="${escapeHtml(`https://wa.me/919799988138?text=Hello%20Ekansh%20Clinic,%20regarding%20my%20consultation%20request%20for%20${encodeURIComponent(payload.patient_name)},%20I%20would%20like%20to%20discuss%20an%20alternative%20appointment%20slot.`)}" class="action-button">
                Chat with Desk on WhatsApp
              </a>
            </div>
          </div>

          <div class="closing">
            <p>Thank you for your understanding.</p>
            <div class="signature">
              Warm regards,<br>
              Ekansh Homoeopathic Clinic
              <small>Rajsamand, Rajasthan, India</small>
            </div>
          </div>
        </div>
        <div class="footer">
          This is an official consultation update issued by Ekansh Homoeopathic Clinic.<br>
          © Ekansh Homoeopathic Clinic • Confidential Patient Communication
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
UPDATE ON YOUR CONSULTATION REQUEST - EKANSH HOMOEOPATHIC CLINIC
-------------------------------------------------------
Hello ${payload.patient_name},

Thank you for considering Ekansh Homoeopathic Clinic.

After reviewing your consultation request, we regret that we are unable to accommodate your requested appointment slot at this time.

Requested Slot Details:
- Patient Name: ${payload.patient_name}
- Requested Date: ${payload.requested_date}
- Requested Time: ${payload.requested_time}
- Mode: ${payload.consultation_type}
${payload.admin_note ? `\nDesk Note: ${payload.admin_note}\n` : ''}
Please note that only the requested appointment slot could not be accommodated. We encourage you to contact our clinic desk to discuss an alternative date or time that works for you.

CLINIC CONTACT DETAILS:
- Phone: ${clinicPhone} / +91 9521646525
- WhatsApp: +91 9799988138
- Address: Near Vijay Travels, Vivekanand Choraya, Bhilwara Road, Kankroli, Rajsamand – 313324, Rajasthan, India

Thank you for your understanding.

Warm regards,
Ekansh Homoeopathic Clinic
Rajsamand, Rajasthan, India
-------------------------------------------------------
  `.trim();

  return dispatchSmtpEmail(
    {
      context: 'patient rejection',
      to: payload.patient_email,
      cc: config.clinicNotificationEmail || undefined,
      subject,
      html: htmlContent,
      text: textContent,
      replyTo: config.clinicNotificationEmail || undefined,
    },
    config
  );
}
