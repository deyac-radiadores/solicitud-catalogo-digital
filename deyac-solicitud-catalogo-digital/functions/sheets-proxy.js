const fetch = require('node-fetch');

const ALLOWED_ORIGINS = ['https://deyac.com.mx'];

exports.handler = async function(event, context) {
  const origin = event.headers.origin;
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '';

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: 'OK'
    };
  }

  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const response = await fetch("https://script.google.com/macros/s/AKfycbxJSsnmcEpLylVpjsTaPM7FT7IL3ga6ZSDsvx2t3UBob3XAEgtFs8bsMfETKZNlEBnl/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Content-Type': 'application/json'
      },
      body: result
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
      },
      body: JSON.stringify({ error: "Error forwarding to Google Sheets", details: error.message }),
    };
  }
};
