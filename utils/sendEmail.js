const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ from, to, subject, html }) => {
  const response = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  console.log("Resend response:", response);

  return response;
};

module.exports = sendEmail;
