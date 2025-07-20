// functions/getEvents.js

const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  try {
    const date = event.queryStringParameters.date;
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุวันที่ (date)' })
      };
    }

    const filePath = path.resolve('events.json');

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 200,
        body: JSON.stringify([]) // ยังไม่มีไฟล์ = ยังไม่มีข้อมูล
      };
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const events = data ? JSON.parse(data) : {};

    return {
      statusCode: 200,
      body: JSON.stringify(events[date] || [])
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ไม่สามารถโหลดกิจกรรมได้', detail: error.message })
    };
  }
};
