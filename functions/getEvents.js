const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;  // ต้องตั้งใน .env
    const sheetName = process.env.SHEET_NAME || 'Sheet1'; // ตั้งชื่อ sheet
    const date = event.queryStringParameters?.date;
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุพารามิเตอร์ date' }),
      };
    }

    if (!spreadsheetId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing SPREADSHEET_ID environment variable' }),
      };
    }

    // สร้าง client จาก service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // แก้ \n เป็น new line จริง
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ดึงข้อมูลช่วงคอลัมน์ (ปรับ range ตามโครงสร้างข้อมูล)
    const range = `${sheetName}!A:B`; // สมมติคอลัมน์ A คือ date, B คือกิจกรรม

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    // กรองกิจกรรมที่ตรงกับ date ที่ส่งมา
    const events = rows
      .filter(row => row[0] === date)
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
