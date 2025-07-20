require('dotenv').config();
const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error('Missing SPREADSHEET_ID in environment variables');
    }

    // ตรวจสอบพารามิเตอร์วันที่จาก URL
    const selectedDate = event.queryStringParameters?.date;
    if (!selectedDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุพารามิเตอร์ date' }),
      };
    }

    // สร้าง auth client ด้วย service account JSON key ที่เซ็ตใน .env
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // สมมติข้อมูลกิจกรรมเก็บในชีตชื่อ "Events" คอลัมน์ A คือวันที่ (yyyy-mm-dd)
    // คอลัมน์ B คือกิจกรรม
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Events!A:B',
    });

    const rows = response.data.values || [];

    // กรองกิจกรรมที่ตรงกับ selectedDate
    const events = rows
      .filter(row => row[0] === selectedDate)
      .map(row => row[1]);

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    };
  } catch (error) {
    console.error('Google Sheets getEvents Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'โหลดกิจกรรมไม่สำเร็จ', detail: error.message }),
    };
  }
};
