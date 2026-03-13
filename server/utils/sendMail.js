import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
  const transportsToTry = [
    // SMTPS (implicit TLS) -- sometimes blocked by network
    { service: "gmail", secure: true, port: 465 },
    // Submission (STARTTLS) -- often more reliable
    { host: "smtp.gmail.com", port: 587, secure: false },
  ];

  const message = {
    from: `"Auth System" <${process.env.MAIL_USER}>`,
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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
};
