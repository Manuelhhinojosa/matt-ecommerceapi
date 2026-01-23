const sendEmail = require("./sendEmail");

const orderStatusUpdate = async (order, user) => {
  const isShipped = order.status === "Shipped";
  const isDelivered = order.status === "Delivered";
  const isCancelled = order.status === "Cancelled";

  // Temporary placeholders (you’ll replace these once admin submits them)
  const trackingNumber =
    order.trackingNumber ||
    "TRK-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const deliveryCompany = order.deliveryCompany || "International Shipping Co.";

  return sendEmail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Update on your order #${order._id}`,
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;">
                  Order Update 📦
                </h1>
                <p style="margin:10px 0 0;color:#e0e7ff;font-size:14px;">
                  Hi ${user.name}, here’s an update on your order
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#1f2937;">

                <p style="font-size:15px;line-height:1.6;margin-top:0;">
                  Your order status has changed. Please see the details below.
                </p>

                <!-- Status -->
                <table width="100%" style="margin:24px 0;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:15px;">
                      <strong>Order ID:</strong> ${order._id}<br />
                      <strong>Current status:</strong> ${order.status}
                      ${
                        isShipped
                          ? `<br /><strong>Delivery company:</strong> ${deliveryCompany}
                             <br /><strong>Tracking number:</strong> ${trackingNumber}`
                          : ""
                      }
                    </td>
                  </tr>
                </table>

                ${
                  isShipped
                    ? `
                      <p style="font-size:14px;line-height:1.6;">
                        🎉 Good news! Your order has shipped and is on its way.
                        You can track your delivery using the tracking number above through
                        <strong>${deliveryCompany}</strong>.
                      </p>
                    `
                    : isDelivered
                    ? `
                      <p style="font-size:14px;line-height:1.6;">
                        ✅ According to <strong>${deliveryCompany}</strong>, your order has been
                        successfully delivered.
                        <br /><br />
                        If you haven’t received your items yet, we recommend contacting the
                        delivery company directly with your tracking details.
                        Of course, you’re also welcome to reply to this email if you need help.
                      </p>
                    `
                    : isCancelled
                    ? `
                      <p style="font-size:14px;line-height:1.6;">
                        ⚠️ Your order has been cancelled.
                        <br /><br />
                      Pleae replay to this email for further arrangaments.
                      </p>
                    `
                    : `
                      <p style="font-size:14px;line-height:1.6;">
                        We’ll keep you updated as your order continues moving forward.
                      </p>
                    `
                }

                <!-- Items -->
                <h3 style="font-size:16px;margin-bottom:14px;">
                  Order items
                </h3>

                ${order.productsInfoAtTimeOfPurchase
                  .map(
                    (p) => `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;border-bottom:1px solid #e5e7eb;padding-bottom:18px;">
                      <tr>
                        <td width="90" valign="top">
                          <img
                            src="${p.imgUrl}"
                            alt="${p.title}"
                            width="80"
                            height="80"
                            style="border-radius:8px;object-fit:cover;"
                          />
                        </td>
                        <td valign="top" style="padding-left:14px;font-size:14px;">
                          <strong style="font-size:15px;">${
                            p.title
                          }</strong><br />
                          <span style="color:#6b7280;">${
                            p.shortDesc
                          }</span><br />
                          <span style="display:block;margin-top:6px;">
                            Item price: <strong>$${p.cost.toFixed(2)}</strong>
                          </span>
                        </td>
                      </tr>
                    </table>
                  `
                  )
                  .join("")}

                <!-- Total -->
                <table width="100%" style="margin-top:26px;border-top:1px solid #e5e7eb;padding-top:18px;">
                  <tr>
                    <td align="right" style="font-size:15px;">
                      <strong>
                        Total paid: $${order.productsInfoAtTimeOfPurchase[0].totalAmountPaid.toFixed(
                          2
                        )}
                      </strong>
                    </td>
                  </tr>
                </table>

                <!-- Help -->
                <p style="font-size:14px;line-height:1.6;margin-top:30px;">
                  Need help or have a question?
                  Just reply to this email — we’re always happy to assist you.
                </p>

                <p style="font-size:15px;margin-bottom:0;">
                  Thank you for shopping with us 💙
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} Matt Marotti's Shop. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
};

module.exports = orderStatusUpdate;
