// const sendEmail = require("./sendEmail");
// let total = 0;
// let taxes = 0;
// const orderConfirmationEmail = async (order, user) => {
//   order.products.map((p, i) => {
//     total = total + p.cost;
//   });
//   taxes = total * 0.13;
//   return sendEmail({
//     from: process.env.EMAIL_FROM,
//     to: user.email,
//     subject: `Order Confirmation #${order._id}`,
//     html: `
//    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
//     <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
//       <tr>
//         <td align="center">

//           <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,0.08);">

//             <!-- Header -->
//             <tr>
//               <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:30px;text-align:center;">
//                 <h1 style="margin:0;color:#ffffff;font-size:26px;">
//                 Matt Marotti's Shop
//                 <br/>
//                 <br/>
//                   Order Confirmed 🎉
//                 </h1>
//                 <p style="margin:10px 0 0;color:#e0e7ff;font-size:14px;">
//                   Thank you for your order, ${
//                     order.custInfoAtTimeOfPurchase.name
//                   }.
//                 </p>
//               </td>
//             </tr>

//             <!-- Body -->
//             <tr>
//               <td style="padding:30px;color:#1f2937;">

//                 <p style="font-size:15px;line-height:1.6;margin-top:0;">
//                   We’re happy to let you know that your order has been successfully placed and is now being processed.
//                   Below you’ll find all the details for your reference.
//                 </p>

//                 <!-- Order details -->
//                 <table width="100%" style="margin:24px 0;background:#f9fafb;border-radius:8px;">
//                   <tr>
//                     <td style="padding:18px;font-size:14px;">
//                       <strong>Order ID:</strong> ${order._id}<br />
//                       <strong>Order date:</strong> ${new Date(
//                         order.createdAt
//                       ).toLocaleDateString()}<br />
//                       <strong>Status:</strong> ${order.status}
//                     </td>
//                   </tr>
//                 </table>

//                 <!-- Items -->
//                 <h3 style="font-size:16px;margin-bottom:14px;">
//                   Your items
//                 </h3>

//                 ${order.productsInfoAtTimeOfPurchase
//                   .map(
//                     (p) => `
//                     <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;border-bottom:1px solid #e5e7eb;padding-bottom:18px;">
//                       <tr>
//                         <td width="90" valign="top">
//                           <img
//                             src="${p.imgUrl}"
//                             alt="${p.title}"
//                             width="80"
//                             height="80"
//                             style="border-radius:8px;object-fit:cover;"
//                           />
//                         </td>
//                         <td valign="top" style="padding-left:14px;font-size:14px;">
//                           <strong style="font-size:15px;">${
//                             p.title
//                           }</strong><br />
//                           <span style="color:#6b7280;">${
//                             p.shortDesc
//                           }</span><br />
//                           <span style="display:block;margin-top:6px;">
//                             Item price: <strong>$${p.cost.toFixed(2)}</strong>
//                           </span>
//                         </td>
//                       </tr>
//                     </table>
//                   `
//                   )
//                   .join("")}

//                 <!-- Totals -->
//                 <table width="100%" style="margin-top:26px;border-top:1px solid #e5e7eb;padding-top:18px;">
//                   <tr>
//                     <td align="right" style="font-size:14px;color:#374151;">
//                       <p style="margin:6px 0;">
//                         Shipping: $${
//                           user.shippingCountry === "Canada" ? 50 : 100
//                         }
//                       </p>
//                       <p style="margin:6px 0;">
//                         Taxes: $${taxes}
//                       </p>
//                       <p style="margin:10px 0;font-size:16px;">
//                         <strong>
//                           Total paid: $${order.productsInfoAtTimeOfPurchase[0].totalAmountPaid.toFixed(
//                             2
//                           )}
//                         </strong>
//                       </p>
//                     </td>
//                   </tr>
//                 </table>

//                 <!-- Next steps -->
//                 <h3 style="font-size:16px;margin-top:30px;margin-bottom:10px;">
//                   What happens next?
//                 </h3>

//                 <ul style="padding-left:18px;font-size:14px;line-height:1.6;color:#374151;">
//                   <li>We’re carefully preparing your order</li>
//                   <li>You’ll receive updates as your order moves forward</li>
//                   <li>Tracking details will be sent once your order ships</li>
//                 </ul>

//                 <!-- Shipping address -->
//                 <table width="100%" style="margin:26px 0;background:#f9fafb;border-radius:8px;">
//                   <tr>
//                     <td style="padding:18px;font-size:14px;">
//                       <strong>Shipping address</strong><br />
//                       ${order.shippingInfoAtTimeOfPurchase}
//                     </td>
//                   </tr>
//                 </table>

//                 <!-- Help -->
//                 <p style="font-size:14px;line-height:1.6;">
//                   Need help or have a question?
//                   You can reply directly to this email at anytime.
//                   <br/>
//                   We’re always happy to help.
//                 </p>

//                 <p style="font-size:15px;margin-bottom:0;">
//                   Thanks again for choosing us — we truly appreciate it 💙
//                 </p>

//               </td>
//             </tr>

//             <!-- Footer -->
//             <tr>
//               <td style="background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#6b7280;">
//                 © ${new Date().getFullYear()} Matt Marotti's Shop. All rights reserved.
//               </td>
//             </tr>

//           </table>

//         </td>
//       </tr>
//     </table>
//   </body>
//     `,
//   });
// };

// module.exports = orderConfirmationEmail;

const sendEmail = require("./sendEmail");

const orderConfirmationEmail = async (order, user) => {
  // ----- CALCULATIONS -----
  let subtotal = 0;

  order.productsInfoAtTimeOfPurchase.forEach((p) => {
    subtotal += p.cost;
  });

  const shipping = user.shippingCountry === "Canada" ? 50 : 100;
  const taxes = subtotal * 0.13;

  // ----- EMAIL -----
  return sendEmail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;">
                  Matt Marotti's Shop
                  <br /><br />
                  Order Confirmed 🎉
                </h1>
                <p style="margin:10px 0 0;color:#e0e7ff;font-size:14px;">
                  Thank you for your order, ${
                    order.custInfoAtTimeOfPurchase.name
                  }.
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#1f2937;">

                <p style="font-size:15px;line-height:1.6;margin-top:0;">
                  We’re happy to let you know that your order has been successfully placed and is now being processed.
                  Below you’ll find all the details for your reference.
                </p>

                <!-- Order details -->
                <table width="100%" style="margin:24px 0;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:14px;">
                      <strong>Order ID:</strong> ${order._id}<br />
                      <strong>Order date:</strong> ${new Date(
                        order.createdAt
                      ).toLocaleDateString()}<br />
                      <strong>Status:</strong> ${order.status}
                    </td>
                  </tr>
                </table>

                <!-- Items -->
                <h3 style="font-size:16px;margin-bottom:14px;">
                  Your items
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

                <!-- Next steps -->
                <h3 style="font-size:16px;margin-top:30px;margin-bottom:10px;">
                  What happens next?
                </h3>

                <ul style="padding-left:18px;font-size:14px;line-height:1.6;color:#374151;">
                  <li>We’re carefully preparing your order</li>
                  <li>You’ll receive updates as your order moves forward</li>
                  <li>Tracking details will be sent once your order ships</li>
                </ul>

                <!-- Shipping address -->
                <table width="100%" style="margin:26px 0;background:#f9fafb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;font-size:14px;">
                      <strong>Shipping address</strong><br />
                      ${order.shippingInfoAtTimeOfPurchase}
                    </td>
                  </tr>
                </table>

                <!-- Help -->
                <p style="font-size:14px;line-height:1.6;">
                  Need help or have a question?
                  You can reply directly to this email at any time.
                  <br />
                  We’re always happy to help.
                </p>

                <p style="font-size:15px;margin-bottom:0;">
                  Thanks again for choosing us — we truly appreciate it 💙
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

module.exports = orderConfirmationEmail;
