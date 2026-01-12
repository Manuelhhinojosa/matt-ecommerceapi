const sendEmail = require("./sendEmail");

const orderStatusUpdate = async (order, user) => {
  return sendEmail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Order status update #${order._id}`,
    html: `
      <h2>Hi ${user.name} ${user.lastname}!</p>

       <p><strong>Order ID:</strong> ${order._id}</p>

      <h2>There has been an order status update, your order now is ${
        order.status
      }</p>
      
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

module.exports = orderStatusUpdate;
