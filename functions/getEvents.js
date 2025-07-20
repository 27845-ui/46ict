const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const filePath = path.join(__dirname, 'events.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const events = JSON.parse(data);

    const selectedDate = event.queryStringParameters.date;
    return {
      statusCode: 200,
      body: JSON.stringify(events[selectedDate] || [])
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ไม่สามารถโหลดกิจกรรมได้', detail: error.message })
    };
  }
};
