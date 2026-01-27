// // backend/whatsapp-api/index.js
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // WhatsApp API Configuration
// const WHATSAPP_API_VERSION = 'v19.0';
// const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
// const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// // Store templates (you can manage these dynamically)
// const messageTemplates = {
//   welcome: `Hello {{name}}! This is {{company}} reaching out regarding {{topic}}`,
//   followup: `Hi {{name}}, following up on our previous conversation about {{topic}}`,
//   custom: `{{message}}`
// };

// // Generate message using OpenAI
// async function generateMessageWithAI(data, templateType = 'custom') {
//   try {
//     // You can use OpenAI API here if needed
//     // For simplicity, using template-based messages
//     let message = messageTemplates[templateType] || data.customMessage;
    
//     // Replace template variables
//     for (const [key, value] of Object.entries(data)) {
//       message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
//     }
    
//     return message;
//   } catch (error) {
//     console.error('Error generating message:', error);
//     return data.customMessage || `Hello ${data.name}, this is a message from ${data.company}`;
//   }
// }

// // Send WhatsApp message
// async function sendWhatsAppMessage(phoneNumber, message) {
//   try {
//     // Clean phone number (remove +, spaces, etc.)
//     const cleanPhone = phoneNumber.replace(/\D/g, '');
    
//     const response = await axios.post(
//       `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: cleanPhone,
//         type: "text",
//         text: {
//           preview_url: false,
//           body: message
//         }
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     return {
//       success: true,
//       messageId: response.data.messages?.[0]?.id,
//       response: response.data
//     };
//   } catch (error) {
//     console.error('WhatsApp API Error:', error.response?.data || error.message);
//     return {
//       success: false,
//       error: error.response?.data || error.message
//     };
//   }
// }

// // Bulk send endpoint
// app.post('/api/send-bulk-messages', async (req, res) => {
//   try {
//     const { recipients, templateType, companyName } = req.body;
//     const results = [];
    
//     for (const recipient of recipients) {
//       // Generate personalized message
//       const messageData = {
//         ...recipient,
//         company: companyName || 'Our Company'
//       };
      
//       const message = await generateMessageWithAI(messageData, templateType);
      
//       // Send message
//       const result = await sendWhatsAppMessage(recipient.phone, message);
      
//       results.push({
//         name: recipient.name,
//         phone: recipient.phone,
//         success: result.success,
//         message: result.success ? 'Message sent successfully' : result.error?.message || 'Failed to send',
//         messageId: result.messageId
//       });
      
//       // Delay between messages to avoid rate limiting
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }
    
//     res.json({
//       success: true,
//       sent: results.filter(r => r.success).length,
//       failed: results.filter(r => !r.success).length,
//       results: results
//     });
//   } catch (error) {
//     console.error('Bulk send error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// // Test endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'API is running' });
// });

// app.listen(PORT, () => {
//   console.log(`WhatsApp API server running on port ${PORT}`);
// });