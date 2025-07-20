const { events } = require('./data');

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

    if (!events[date]) {
      events[date] = [];
    }
    events[date].push(activity);

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
