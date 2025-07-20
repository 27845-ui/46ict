const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const filePath = path.resolve('events.json');

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const events = JSON.parse(data);
    const selectedDate = event.queryStringParameters.date;

    return {
      statusCode: 200,
      body: JSON.stringify(events[selectedDate] || [])
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ไม่สามารถโหลดกิจกรรมได้', detail: err.message })
    };
  }
};
