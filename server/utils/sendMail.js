import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
  const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
  const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASSWORD;

  if (!mailUser || !mailPass) {
    if (process.env.BYPASS_EMAIL_OTP === 'true') {
      console.warn('MAIL_USER/MAIL_PASS or SMTP_USER/SMTP_PASSWORD missing, but BYPASS_EMAIL_OTP=true, skipping email send.');
      return;
    }
    throw new Error('MAIL_USER/MAIL_PASS or SMTP_USER/SMTP_PASSWORD not configured (needed for email OTP).');
  }

  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_FROM || `${process.env.APP_NAME || 'No Reply'} <${mailUser}>`;

  const transportsToTry = [
    // if using Gmail, try native service first
    { service: 'gmail', secure: true, port: 465 },
    // generic SMTP fallback
    { host: process.env.SMTP_HOST || 'smtp.gmail.com', port: Number(process.env.SMTP_PORT || 587), secure: !!process.env.SMTP_SECURE },
  ];
  const message = {
    from: fromAddress,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your verification code is: <b>${otp}</b></p>
      <p>OTP is valid for 10 minutes.</p>
    `,
  };
  let lastError = null;

  for (const t of transportsToTry) {
    const opts = {
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      ...t,
      // small timeout so failures return quickly
      socketTimeout: 10000,
      greetingTimeout: 10000,
      connectionTimeout: 10000,
    };

    const transporter = nodemailer.createTransport(opts);

    try {
      await transporter.verify();
    } catch (verifyErr) {
      lastError = verifyErr;
      console.warn(`Mail transporter verify failed for ${JSON.stringify(t)}:`, verifyErr && verifyErr.message ? verifyErr.message : verifyErr);
      // try next transport
      continue;
    }

    try {
      await transporter.sendMail(message);
      // success
      return;
    } catch (sendErr) {
      lastError = sendErr;
      console.error(`Error sending OTP email with ${JSON.stringify(t)}:`, sendErr && sendErr.message ? sendErr.message : sendErr);
      // try next transport
      continue;
    }
  }

  // If we reached here, all transports failed
  const errMsg = lastError && lastError.message ? lastError.message : String(lastError);
  console.error('All mail transports failed:', errMsg);
  throw new Error(errMsg || 'Failed to send email');
};

export const verifyTransporter = async () => {
  const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
  const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: !!process.env.SMTP_SECURE,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
};
