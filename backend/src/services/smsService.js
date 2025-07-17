const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send SMS function
const sendSMS = async (phoneNumber, message) => {
  try {
    // If in development mode or no Twilio credentials, log the message
    if (process.env.NODE_ENV === 'development' || !twilioClient) {
      console.log(`📱 SMS would be sent to ${phoneNumber}:`);
      console.log(`📱 Message: ${message}`);
      return {
        success: true,
        message: 'SMS sent (development mode)',
        sid: 'dev_' + Date.now()
      };
    }

    // Send SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`✅ SMS sent successfully to ${phoneNumber}, SID: ${result.sid}`);
    
    return {
      success: true,
      message: 'SMS sent successfully',
      sid: result.sid,
      status: result.status
    };

  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      throw new Error('Invalid phone number format');
    } else if (error.code === 21408) {
      throw new Error('Phone number not reachable');
    } else if (error.code === 21610) {
      throw new Error('Phone number is blacklisted');
    } else if (error.code === 21614) {
      throw new Error('Invalid phone number');
    }
    
    throw new Error('Failed to send SMS: ' + error.message);
  }
};

// Send verification code SMS
const sendVerificationSMS = async (phoneNumber, code) => {
  const message = `Your Cleanic verification code is: ${code}. Valid for 10 minutes. Do not share this code with anyone.`;
  return await sendSMS(phoneNumber, message);
};

// Send password reset SMS
const sendPasswordResetSMS = async (phoneNumber, code) => {
  const message = `Your Cleanic password reset code is: ${code}. Valid for 10 minutes. If you didn't request this, please ignore.`;
  return await sendSMS(phoneNumber, message);
};

// Send order confirmation SMS
const sendOrderConfirmationSMS = async (phoneNumber, orderNumber) => {
  const message = `Your Cleanic order ${orderNumber} has been confirmed! We'll keep you updated on the progress.`;
  return await sendSMS(phoneNumber, message);
};

// Send order status update SMS
const sendOrderStatusSMS = async (phoneNumber, orderNumber, status) => {
  let message = '';
  
  switch (status) {
    case 'picked_up':
      message = `Your laundry order ${orderNumber} has been picked up and is being processed.`;
      break;
    case 'in_progress':
      message = `Your order ${orderNumber} is currently being cleaned with care.`;
      break;
    case 'ready_for_delivery':
      message = `Great news! Your order ${orderNumber} is ready for delivery.`;
      break;
    case 'in_transit':
      message = `Your order ${orderNumber} is on its way to you!`;
      break;
    case 'delivered':
      message = `Your order ${orderNumber} has been delivered. Thank you for choosing Cleanic!`;
      break;
    default:
      message = `Your order ${orderNumber} status has been updated to: ${status}`;
  }
  
  return await sendSMS(phoneNumber, message);
};

// Send promotional SMS
const sendPromotionalSMS = async (phoneNumber, promoCode, discount, expiryDate) => {
  const message = `🎉 Special offer! Use code ${promoCode} for ${discount}% off your next Cleanic order. Valid until ${expiryDate}. Book now!`;
  return await sendSMS(phoneNumber, message);
};

// Send reminder SMS
const sendReminderSMS = async (phoneNumber, reminderType, details) => {
  let message = '';
  
  switch (reminderType) {
    case 'pickup':
      message = `Reminder: Your Cleanic pickup is scheduled for ${details.time} today. Please have your items ready.`;
      break;
    case 'delivery':
      message = `Your Cleanic delivery is scheduled for ${details.time} today. Please be available to receive your items.`;
      break;
    case 'subscription':
      message = `Your Cleanic subscription will renew on ${details.renewalDate}. ${details.kgRemaining}kg remaining this month.`;
      break;
    default:
      message = `Cleanic reminder: ${details.message}`;
  }
  
  return await sendSMS(phoneNumber, message);
};

// Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
  // South African phone number format: +27xxxxxxxxx
  const phoneRegex = /^\+27\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

// Format phone number to international format
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different input formats
  if (cleaned.startsWith('27')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+27' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    return '+27' + cleaned;
  }
  
  return phoneNumber; // Return as-is if format is unclear
};

// Bulk SMS sending (for marketing campaigns)
const sendBulkSMS = async (phoneNumbers, message) => {
  const results = [];
  
  for (const phoneNumber of phoneNumbers) {
    try {
      const result = await sendSMS(phoneNumber, message);
      results.push({
        phoneNumber,
        success: true,
        result
      });
    } catch (error) {
      results.push({
        phoneNumber,
        success: false,
        error: error.message
      });
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Check SMS delivery status
const checkSMSStatus = async (messageSid) => {
  if (!twilioClient) {
    return { status: 'unknown', message: 'Twilio not configured' };
  }
  
  try {
    const message = await twilioClient.messages(messageSid).fetch();
    return {
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated
    };
  } catch (error) {
    console.error('Error checking SMS status:', error);
    return { status: 'error', message: error.message };
  }
};

module.exports = {
  sendSMS,
  sendVerificationSMS,
  sendPasswordResetSMS,
  sendOrderConfirmationSMS,
  sendOrderStatusSMS,
  sendPromotionalSMS,
  sendReminderSMS,
  sendBulkSMS,
  validatePhoneNumber,
  formatPhoneNumber,
  checkSMSStatus
};