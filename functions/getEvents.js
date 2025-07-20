const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    const selectedDate = event.queryStringParameters?.date;
    if (!selectedDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุพารามิเตอร์ date' }),
      };
    }

    const filePath = path.join(__dirname, 'events.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const events = JSON.parse(data);

    return {
      statusCode: 200,
      body: JSON.stringify(events[selectedDate] || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'โหลดกิจกรรมไม่สำเร็จ', detail: error.message }),
    };
  }
};

