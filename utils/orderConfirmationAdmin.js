const sendEmail = require("./sendEmail");

const orderConfirmationEmailAdmin = async (order, user) => {
  let subtotal = 0;

  order.productsInfoAtTimeOfPurchase.forEach((p) => {
    subtotal += p.cost;
  });

  const shipping = user.shippingCountry === "Canada" ? 50 : 100;
  const taxes = subtotal * 0.13;

  return sendEmail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN,
    subject: `New Order Received #${order._id}`,
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
              <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;">
                  New Order Placed 🛒
                </h1>
                <p style="margin:10px 0 0;color:#c7d2fe;font-size:14px;">
                  A customer has completed a purchase
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#1f2937;">

                <p style="font-size:15px;line-height:1.6;margin-top:0;">
                  <strong>${user.name} ${
      user.lastname
    }</strong> has just placed an order on your shop.
                  Below are the full details captured at the time of purchase.
                </p>

                <!-- Order summary -->
                <table width="100%" style="margin:24px 0;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:14px;">
                      <strong>Order ID:</strong> ${order._id}<br />
                      <strong>Order date:</strong> ${new Date(
                        order.createdAt
                      ).toLocaleDateString()}<br />
                      <strong>Order status:</strong> ${order.status}
                    </td>
                  </tr>
                </table>

                <!-- Customer info -->
                <h3 style="font-size:16px;margin-bottom:10px;">
                  Customer information
                </h3>

                <table width="100%" style="margin-bottom:24px;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:14px;line-height:1.6;">
                      <strong>Name:</strong> ${user.name} ${user.lastname}<br />
                      <strong>Email:</strong> ${user.email}<br />
                    </td>
                  </tr>
                </table>

                <!-- Items -->
                <h3 style="font-size:16px;margin-bottom:14px;">
                  Purchased items
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

                <!-- Totals -->
                <table width="100%" style="margin-top:26px;border-top:1px solid #e5e7eb;padding-top:18px;">
                  <tr>
                    <td align="right" style="font-size:14px;color:#374151;">
                      <p style="margin:6px 0;">
                        Subtotal: $${subtotal.toFixed(2)}
                      </p>
                      <p style="margin:6px 0;">
                        Shipping: $${shipping.toFixed(2)}
                      </p>
                      <p style="margin:6px 0;">
                        Taxes: $${taxes.toFixed(2)}
                      </p>
                      <p style="margin:10px 0;font-size:16px;">
                        <strong>
                          Total paid: $${order.productsInfoAtTimeOfPurchase[0].totalAmountPaid.toFixed(
                            2
                          )}
                        </strong>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Shipping -->
                <h3 style="font-size:16px;margin-top:30px;margin-bottom:10px;">
                  Shipping info (at time of purchase)
                </h3>

                <table width="100%" style="margin-bottom:24px;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:14px;">
                      ${order.shippingInfoAtTimeOfPurchase}
                    </td>
                  </tr>
                </table>

                <!-- Admin action -->
                <p style="font-size:14px;line-height:1.6;">
                  To manage this order, update its status, or view additional details,
                  please visit your <strong>Admin Dashboard</strong>.
                </p>
                   <p style="font-size:14px;line-height:1.6;">
                 To manage the money visit your <strong>Stripe account</strong>.
                </p>

                <p style="font-size:15px;margin-bottom:0;">
                  This order is now ready for processing 🚀
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} Matt Marotti's Shop — Admin Notification
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

module.exports = orderConfirmationEmailAdmin;
