const { events } = require('./data');

exports.handler = async (event) => {
  try {
    const selectedDate = event.queryStringParameters?.date;
    if (!selectedDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'กรุณาระบุพารามิเตอร์ date' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(events[selectedDate] || []),
    };
  } catch (error) {
    console.error('getEvents error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'โหลดกิจกรรมไม่สำเร็จ', detail: error.message }),
    };
  }
};
