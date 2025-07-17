const nodemailer = require('nodemailer');

// Create email transporter
let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Send email function
const sendEmail = async (to, subject, html, text = null) => {
  try {
    // If in development mode or no email config, log the email
    if (process.env.NODE_ENV === 'development' || !transporter) {
      console.log(`📧 Email would be sent to ${to}:`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Content: ${text || html}`);
      return {
        success: true,
        message: 'Email sent (development mode)',
        messageId: 'dev_' + Date.now()
      };
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Cleanic'}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html
    });

    console.log(`✅ Email sent successfully to ${to}, ID: ${info.messageId}`);
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName, verificationCode) => {
  const subject = 'Welcome to Cleanic - Verify Your Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007AFF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { background: #007AFF; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Cleanic!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Thank you for joining Cleanic, South Africa's premier laundry and cleaning service platform!</p>
          <p>To complete your registration, please verify your account using the code below:</p>
          <div class="code">${verificationCode}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>With Cleanic, you can:</p>
          <ul>
            <li>Schedule convenient pickup and delivery times</li>
            <li>Choose from subscription plans or pay-as-you-go services</li>
            <li>Select your preferred staff members</li>
            <li>Track your orders in real-time</li>
            <li>Earn eco-points for environmentally friendly choices</li>
            <li>Refer friends and earn rewards</li>
          </ul>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, orderDetails) => {
  const subject = `Order Confirmation - ${orderDetails.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your order has been confirmed and is being processed.</p>
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Service:</strong> ${orderDetails.serviceName}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity} ${orderDetails.unit}</p>
            <p><strong>Pickup Time:</strong> ${orderDetails.pickupTime}</p>
            <p><strong>Total Amount:</strong> R${orderDetails.totalAmount}</p>
            ${orderDetails.isEcoFriendly ? '<p><strong>Eco-Friendly:</strong> Yes ✅</p>' : ''}
            ${orderDetails.isExpressDelivery ? '<p><strong>Express Delivery:</strong> Yes ⚡</p>' : ''}
          </div>
          <p>We'll keep you updated on your order progress via SMS and email.</p>
          <p>Track your order anytime in the Cleanic app.</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>Need help? Contact us at support@cleanic.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Send invoice email
const sendInvoiceEmail = async (userEmail, userName, invoiceDetails) => {
  const subject = `Invoice - ${invoiceDetails.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007AFF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .invoice { background: white; padding: 20px; margin: 20px 0; }
        .invoice-header { border-bottom: 2px solid #007AFF; padding-bottom: 10px; margin-bottom: 20px; }
        .invoice-details { margin: 20px 0; }
        .total { background: #007AFF; color: white; padding: 10px; text-align: right; font-weight: bold; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice</h1>
        </div>
        <div class="content">
          <div class="invoice">
            <div class="invoice-header">
              <h2>Cleanic Invoice</h2>
              <p><strong>Invoice Number:</strong> ${invoiceDetails.invoiceNumber}</p>
              <p><strong>Date:</strong> ${invoiceDetails.date}</p>
              <p><strong>Order Number:</strong> ${invoiceDetails.orderNumber}</p>
            </div>
            <div class="invoice-details">
              <h3>Bill To:</h3>
              <p>${userName}</p>
              <p>${invoiceDetails.customerEmail}</p>
              <p>${invoiceDetails.customerPhone}</p>
            </div>
            <div class="invoice-details">
              <h3>Service Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                  <th style="text-align: left; padding: 8px;">Service</th>
                  <th style="text-align: right; padding: 8px;">Quantity</th>
                  <th style="text-align: right; padding: 8px;">Rate</th>
                  <th style="text-align: right; padding: 8px;">Amount</th>
                </tr>
                <tr>
                  <td style="padding: 8px;">${invoiceDetails.serviceName}</td>
                  <td style="text-align: right; padding: 8px;">${invoiceDetails.quantity}</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.rate}</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.amount}</td>
                </tr>
                ${invoiceDetails.ecoFriendlyCharge ? `
                <tr>
                  <td style="padding: 8px;">Eco-Friendly Surcharge</td>
                  <td style="text-align: right; padding: 8px;">1</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.ecoFriendlyCharge}</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.ecoFriendlyCharge}</td>
                </tr>
                ` : ''}
                ${invoiceDetails.expressDeliveryCharge ? `
                <tr>
                  <td style="padding: 8px;">Express Delivery</td>
                  <td style="text-align: right; padding: 8px;">1</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.expressDeliveryCharge}</td>
                  <td style="text-align: right; padding: 8px;">R${invoiceDetails.expressDeliveryCharge}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            <div class="total">
              <p>Total: R${invoiceDetails.totalAmount}</p>
            </div>
          </div>
          <p>Thank you for choosing Cleanic!</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>Questions about this invoice? Contact us at billing@cleanic.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetCode) => {
  const subject = 'Password Reset - Cleanic';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { background: #dc3545; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We received a request to reset your password for your Cleanic account.</p>
          <p>Use the following code to reset your password:</p>
          <div class="code">${resetCode}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Send promotional email
const sendPromotionalEmail = async (userEmail, userName, promotionDetails) => {
  const subject = `Special Offer: ${promotionDetails.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .promo-code { background: #28a745; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Special Offer!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>${promotionDetails.description}</p>
          <p>Use the code below to claim your discount:</p>
          <div class="promo-code">${promotionDetails.code}</div>
          <p><strong>Discount:</strong> ${promotionDetails.discount}</p>
          <p><strong>Valid Until:</strong> ${promotionDetails.expiryDate}</p>
          <p>Don't miss out on this limited-time offer!</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>Unsubscribe from promotional emails in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Send subscription reminder email
const sendSubscriptionReminderEmail = async (userEmail, userName, subscriptionDetails) => {
  const subject = 'Subscription Reminder - Cleanic';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007AFF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .subscription-details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #007AFF; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Here's an update on your Cleanic subscription:</p>
          <div class="subscription-details">
            <h3>Subscription Details:</h3>
            <p><strong>Plan:</strong> ${subscriptionDetails.planName}</p>
            <p><strong>KG Used:</strong> ${subscriptionDetails.kgUsed}/${subscriptionDetails.kgLimit} kg</p>
            <p><strong>Renewal Date:</strong> ${subscriptionDetails.renewalDate}</p>
            <p><strong>KG Rollover:</strong> ${subscriptionDetails.kgRollover} kg</p>
          </div>
          <p>${subscriptionDetails.message}</p>
        </div>
        <div class="footer">
          <p>© 2024 Cleanic. All rights reserved.</p>
          <p>Manage your subscription in the Cleanic app.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Verify email configuration
const verifyEmailConfig = async () => {
  if (!transporter) {
    return { success: false, message: 'Email transporter not configured' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration verified' };
  } catch (error) {
    return { success: false, message: 'Email configuration failed: ' + error.message };
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendInvoiceEmail,
  sendPasswordResetEmail,
  sendPromotionalEmail,
  sendSubscriptionReminderEmail,
  verifyEmailConfig
};