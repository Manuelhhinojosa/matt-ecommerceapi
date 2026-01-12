const sendEmail = require("./sendEmail");

const orderConfirmationEmailAdmin = async (order, user) => {
  return sendEmail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN,
    subject: `New Order #${order._id}`,
    html: `
      <h2>${user.name} ${
      user.lastname
    } just purcharsed an art piece from your shop</h2>
      <p>Visit your admin page for details</p>

      <p><strong>Order ID:</strong> ${order._id}</p>


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

module.exports = orderConfirmationEmailAdmin;
