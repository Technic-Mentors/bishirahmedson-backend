import { sendEmail } from '../config/mailer.js';
import { env } from '../config/env.js';

const BRAND = {
  name: 'Bashir Ahmed Sons',
  tagline: 'Premium Organic Since 1940',
  red: '#991b1b',
  gold: '#ca8a04',
  text: '#1c1917',
  muted: '#78716c',
  phone: '+92 3076441350',
  phoneRaw: '+923076441350',
  branches: [
    'Branch 1: Said Nagri Bazar, Near Lahori Gate, Gujranwala',
    'Branch 2: DC Colony, Neelum Block Commercial Market Plaza Plot No. 15, Gujranwala',
    'Branch 3: Main Market, Wapda Town, Gujranwala',
  ],
};

/* ═══════════════ HELPERS ═══════════════ */
function money(v) {
  return `Rs. ${Number(v || 0).toLocaleString('en-PK')}`;
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function layout(bodyHtml) {
  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: ${BRAND.text}; line-height: 1.55;">
      <!-- Header -->
      <div style="border-bottom: 3px solid ${BRAND.red}; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: ${BRAND.red}; margin: 0 0 4px; font-size: 22px;">${BRAND.name}</h2>
        <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: ${BRAND.gold}; font-weight: 600;">
          ${BRAND.tagline}
        </p>
      </div>

      ${bodyHtml}

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 11px; color: ${BRAND.muted};">
        <p style="margin: 0 0 8px; font-weight: 600; color: ${BRAND.text};">Visit our branches:</p>
        <ul style="margin: 0 0 12px; padding-left: 18px;">
          ${BRAND.branches.map((b) => `<li style="margin-bottom: 3px;">${b}</li>`).join('')}
        </ul>
        <p style="margin: 0;">
          <strong style="color: ${BRAND.text};">${BRAND.name}</strong><br/>
          📞 <a href="tel:${BRAND.phoneRaw}" style="color: ${BRAND.red}; text-decoration: none;">${BRAND.phone}</a>
        </p>
      </div>
    </div>
  `;
}

function sectionTitle(text) {
  return `<h3 style="color: ${BRAND.red}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 22px 0 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px;">${text}</h3>`;
}

function renderItemsTable(items) {
  if (!items?.length) return '<p style="font-size: 13px; color: #78716c;">No items</p>';
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0;">
      <thead>
        <tr style="background: #fef9c3;">
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e5e5;">Item</th>
          <th style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e5e5;">Qty</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e5e5;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (it) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f5f5f5;">${it.name || it.product_name || it.productName}</td>
            <td style="text-align: center; padding: 8px; border-bottom: 1px solid #f5f5f5;">${it.quantity}</td>
            <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f5f5f5;">${money(it.price || it.unit_price || it.unitPrice)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderTotalsBlock({ subtotal, discountAmount, couponCode, shippingCharge, total }) {
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;">
      <tr>
        <td style="padding: 4px 0; color: ${BRAND.muted};">Subtotal</td>
        <td style="text-align: right; padding: 4px 0;">${money(subtotal)}</td>
      </tr>
      ${
        discountAmount
          ? `
        <tr>
          <td style="padding: 4px 0; color: ${BRAND.muted};">Discount ${couponCode ? `(${couponCode})` : ''}</td>
          <td style="text-align: right; padding: 4px 0; color: ${BRAND.red};">- ${money(discountAmount)}</td>
        </tr>
      `
          : ''
      }
      ${
        shippingCharge
          ? `
        <tr>
          <td style="padding: 4px 0; color: ${BRAND.muted};">Shipping</td>
          <td style="text-align: right; padding: 4px 0;">${money(shippingCharge)}</td>
        </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 10px 0; border-top: 2px solid ${BRAND.red}; font-weight: 600;">Total</td>
        <td style="text-align: right; padding: 10px 0; border-top: 2px solid ${BRAND.red}; font-weight: 600; color: ${BRAND.red};">${money(total)}</td>
      </tr>
    </table>
  `;
}

function renderAddressBlock(order) {
  return `
    <div style="background: #fef9c3; border-left: 4px solid ${BRAND.gold}; padding: 12px 16px; border-radius: 6px; font-size: 13px;">
      <strong>${order.shipping_name || order.customer_name || ''}</strong><br/>
      ${order.shipping_address || order.address || ''}<br/>
      ${order.shipping_city || order.city || ''}${order.shipping_postal_code ? ', ' + order.shipping_postal_code : ''}<br/>
      ${order.shipping_phone ? `📞 ${order.shipping_phone}` : ''}
    </div>
  `;
}

function paymentMethodLabel(order) {
  if (order.payment_method === 'cod') return 'Cash on Delivery';
  if (order.payment_method === 'bank_transfer') return 'Bank Transfer';
  return order.payment_method || 'Cash on Delivery';
}

/* ═══════════════ STATUS MESSAGES ═══════════════ */
const STATUS_MESSAGES = {
  placed: "We've received your order and will call you shortly to confirm it.",
  confirmed: 'Your order has been confirmed and is being prepared.',
  packed: 'Your order has been packed and will ship soon.',
  shipped: 'Your order is on its way!',
  delivered: 'Your order has been delivered. Thank you for shopping with us!',
  cancelled: 'Your order has been cancelled.',
  returned: 'Your return has been recorded.',
};

/* ═══════════════════════════════════════════════════════════
   ORDER PLACED EMAIL — with FULL details
   ═══════════════════════════════════════════════════════════ */
export async function sendOrderPlacedEmail({ customer, order, items, couponCode }) {
  await sendEmail({
    to: customer.email,
    subject: `Order ${order.order_number} received — ${BRAND.name}`,
    html: layout(`
      <p style="margin: 0 0 12px; font-size: 14px;">Hi ${customer.name || 'there'},</p>
      <p style="margin: 0 0 12px;">Thank you for your order! Here are your order details:</p>

      <div style="background: #fef9c3; border-left: 4px solid ${BRAND.gold}; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 0; font-size: 13px;">
          <strong>Order Number:</strong> ${order.order_number}<br/>
          <strong>Order Date:</strong> ${formatDate(order.created_at)}<br/>
          <strong>Total:</strong> ${money(order.total)}
        </p>
      </div>

      ${sectionTitle('Shipping Address')}
      ${renderAddressBlock(order)}

      ${sectionTitle('Order Items')}
      ${renderItemsTable(items)}
      ${renderTotalsBlock({
        subtotal: order.subtotal,
        discountAmount: order.discount_amount,
        couponCode,
        shippingCharge: order.shipping_charge,
        total: order.total,
      })}

      ${sectionTitle('Payment')}
      <p style="margin: 0; font-size: 13px;">
        <strong>Method:</strong> ${paymentMethodLabel(order)}<br/>
        <strong>Status:</strong> ${order.payment_status === 'collected' ? 'Paid' : 'Pending'}
      </p>

      <p style="margin-top: 20px;">${STATUS_MESSAGES.placed}</p>
    `),
  });
}

/* ═══════════════════════════════════════════════════════════
   ORDER STATUS UPDATE EMAIL
   ═══════════════════════════════════════════════════════════ */
export async function sendOrderStatusEmail(customer, order) {
  const reasonHtml =
    order.status === 'cancelled' && order.cancelled_reason
      ? `<p style="margin: 12px 0; padding: 10px 14px; background: #fef2f2; border-left: 4px solid ${BRAND.red}; border-radius: 6px; font-size: 13px;"><strong>Reason:</strong> ${order.cancelled_reason}</p>`
      : '';

  const reviewCtaHtml =
    order.status === 'delivered'
      ? `<p style="margin-top: 24px; text-align: center;">
           <a href="${env.urls.customerApp}/account/orders/${order.id}"
              style="display:inline-block;background:${BRAND.red};color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size: 14px;">
             Add a Review
           </a>
         </p>`
      : '';

  await sendEmail({
    to: customer.email,
    subject: `Order ${order.order_number} update — ${BRAND.name}`,
    html: layout(`
      <p style="margin: 0 0 12px; font-size: 14px;">Hi ${customer.name || 'there'},</p>

      <div style="background: #fef9c3; border-left: 4px solid ${BRAND.gold}; padding: 12px 16px; border-radius: 6px; margin: 0 0 16px;">
        <p style="margin: 0; font-size: 13px;">
          <strong>Order Number:</strong> ${order.order_number}
        </p>
      </div>

      <p style="margin: 0 0 8px; font-size: 14px;">${STATUS_MESSAGES[order.status] || 'Your order status has been updated.'}</p>

      ${reasonHtml}
      ${reviewCtaHtml}
    `),
  });
}

/* ═══════════════════════════════════════════════════════════
   ADMIN NEW ORDER ALERT
   ═══════════════════════════════════════════════════════════ */
export async function sendAdminNewOrderAlert({ customer, order, items, couponCode }) {
  if (!env.mail.adminAlertEmail) return;

  await sendEmail({
    to: env.mail.adminAlertEmail,
    subject: `🛒 New order ${order.order_number} — ${money(order.total)}`,
    html: layout(`
      <p style="margin: 0 0 12px; font-size: 14px;">A new order has been placed.</p>

      <div style="background: #fef2f2; border-left: 4px solid ${BRAND.red}; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 0; font-size: 13px;">
          <strong>Order Number:</strong> ${order.order_number}<br/>
          <strong>Order Date:</strong> ${formatDate(order.created_at)}<br/>
          <strong>Total:</strong> ${money(order.total)}
        </p>
      </div>

      ${sectionTitle('Customer')}
      <p style="margin: 0; font-size: 13px;">
        <strong>Name:</strong> ${customer.name || '—'}<br/>
        <strong>Email:</strong> ${customer.email || '—'}<br/>
        <strong>Phone:</strong> ${customer.phone || order.shipping_phone || '—'}
      </p>

      ${sectionTitle('Shipping Address')}
      ${renderAddressBlock(order)}

      ${sectionTitle('Order Items')}
      ${renderItemsTable(items)}
      ${renderTotalsBlock({
        subtotal: order.subtotal,
        discountAmount: order.discount_amount,
        couponCode,
        shippingCharge: order.shipping_charge,
        total: order.total,
      })}

      ${sectionTitle('Payment')}
      <p style="margin: 0; font-size: 13px;">
        <strong>Method:</strong> ${paymentMethodLabel(order)}<br/>
        <strong>Status:</strong> ${order.payment_status === 'collected' ? 'Paid' : 'Pending'}
      </p>
    `),
  });
}