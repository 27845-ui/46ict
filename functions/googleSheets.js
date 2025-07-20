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
  try {
    // อ่านข้อมูล query parameter ?date=2025-07-20
    const date = event.queryStringParameters?.date;
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุพารามิเตอร์ date' }),
      };
    }

    // อ่านข้อมูลจาก Google Sheets (สมมติเก็บข้อมูลใน Sheet1 คอลัมน์ A = date, คอลัมน์ B = activity)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:B',
    });

    const rows = response.data.values || [];
    // กรองข้อมูลที่ตรงกับวันที่ที่ส่งมา
    const eventsForDate = rows
      .filter(row => row[0] === date)
      .map(row => row[1]);

    return {
      statusCode: 200,
      body: JSON.stringify(eventsForDate),
    };

  } catch (error) {
    console.error('Google Sheets Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดกับ Google Sheets', detail: error.message }),
    };
  }
};
