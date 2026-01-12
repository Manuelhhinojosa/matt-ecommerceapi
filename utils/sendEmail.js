const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log("Resend response:", response);

  return response;
};

module.exports = sendEmail;
