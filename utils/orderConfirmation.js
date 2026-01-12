const sendEmail = require("./sendEmail");

const orderConfirmationEmail = async (order, user) => {
  return sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h2>Thank you for your purchase, ${user.name}!</h2>
      <p>Your order has been successfully placed.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Status:</strong> ${order.status}</p>

      <h3>Items</h3>
      <ul>
        ${order.productsInfoAtTimeOfPurchase
          .map(
            (p) => `
              <li>
                ${p.title} — $${p.cost}
              </li>
            `
          )
          .join("")}
      </ul>

      <p>Total Paid: <strong>$${
        order.productsInfoAtTimeOfPurchase[0].totalAmountPaid
      }</strong></p>
    `,
  });
};

module.exports = orderConfirmationEmail;
