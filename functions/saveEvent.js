const { google } = require('googleapis');
require('dotenv').config();

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
);

const sheets = google.sheets({ version: 'v4', auth });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { date, activity } = JSON.parse(event.body);

    if (!date || !activity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'date และ activity ต้องถูกระบุ' }),
      };
    }

    // เพิ่มข้อมูลใหม่ลง Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:B',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[date, activity]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'บันทึกกิจกรรมสำเร็จ' }),
    };

  } catch (error) {
    console.error('Google Sheets Save Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'บันทึกกิจกรรมไม่สำเร็จ', detail: error.message }),
    };
  }
};
