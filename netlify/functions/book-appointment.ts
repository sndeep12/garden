import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body || '{}');

  // Simulate booking creation and return details
  const booking = {
    customerName: `${data.firstName} ${data.lastName}`,
    subject: data.subject || 'FHC Video',
    duration: '60 minutes',
    confirmationEmail: data.email,
    appointmentId: 'APBK-' + Math.floor(Math.random() * 100000000),
    time: data.time || '17:30',
    date: data.date || '27th August',
  };

  return {
    statusCode: 200,
    body: JSON.stringify(booking),
  };
};
