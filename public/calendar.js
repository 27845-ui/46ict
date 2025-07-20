const endpoint = "/.netlify/functions";

document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const eventForm = document.getElementById("eventForm");
  const eventInput = document.getElementById("eventInput");
  const selectedDateText = document.getElementById("selectedDateText");
  const eventList = document.getElementById("eventList");

  let selectedDate = "";

  // ✅ ประกาศก่อนใช้!
  async function renderEventList() {
    try {
      const res = await fetch(`${endpoint}/getEvents?date=${selectedDate}`);
      const events = await res.json();
      eventList.innerHTML = "";
      events.forEach(event => {
        const li = document.createElement("li");
        li.textContent = event;
        eventList.appendChild(li);
      });
    } catch (err) {
      eventList.innerHTML = "<li>โหลดกิจกรรมไม่สำเร็จ</li>";
    }
  }

  function showEventForm(dateStr) {
    selectedDate = dateStr;
    selectedDateText.textContent = selectedDate;
    eventForm.classList.remove("hidden");
    eventInput.value = "";
    renderEventList(); // เรียกใช้ได้แล้ว เพราะอยู่หลังจากประกาศ
  }

  window.addEvent = async function () {
  const activity = eventInput.value.trim();
  if (!activity) return;

  const res = await fetch(`${endpoint}/saveEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: selectedDate, activity }),
  });

  if (!res.ok) {
    alert("เกิดข้อผิดพลาดในการบันทึกกิจกรรม");
    return;
  }

  eventInput.value = "";
  renderEventList();
};


  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day;
    dayDiv.onclick = () => showEventForm(dateStr);
    calendar.appendChild(dayDiv);
  }
});

window.addEvent = async function () {
  const activity = eventInput.value.trim();
  console.log("กดบันทึกแล้ว:", activity); // ✅ ดูว่าทำงานไหม

  if (!activity) return;

  const res = await fetch(`${endpoint}/saveEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: selectedDate, activity }),
  });

  console.log("ส่งข้อมูลแล้ว ได้ status:", res.status);

  if (!res.ok) {
    alert("เกิดข้อผิดพลาดในการบันทึกกิจกรรม");
    return;
  }

  eventInput.value = "";
  renderEventList();
};

