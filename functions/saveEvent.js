const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { date, activity } = body;

    if (!date || !activity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'date และ activity ต้องถูกระบุ' }),
      };
    }

    const filePath = path.join(__dirname, 'events.json');

    // อ่านไฟล์เดิม
    let events = {};
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      events = JSON.parse(data);
    } catch {
      events = {};
    }

    // เพิ่มกิจกรรมใหม่
    if (!events[date]) {
      events[date] = [];
    }
    events[date].push(activity);

    // บันทึกกลับไฟล์
    await fs.writeFile(filePath, JSON.stringify(events, null, 2), 'utf-8');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'บันทึกกิจกรรมสำเร็จ' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'บันทึกกิจกรรมไม่สำเร็จ', detail: error.message }),
    };
  }
};
