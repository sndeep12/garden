import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Simulate cancellation
  return {
    statusCode: 200,
    body: JSON.stringify({ cancelled: true }),
  };
};
