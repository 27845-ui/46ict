const firebaseConfig = {
  apiKey: "AIzaSyAECYQmJqhQYo9Om9HHVKml2S1CNUmA4a4",
  authDomain: "ssc-database-9affb.firebaseapp.com",
  databaseURL: "https://ssc-database-9affb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ssc-database-9affb",
  storageBucket: "ssc-database-9affb.firebasestorage.app",
  messagingSenderId: "645224445897",
  appId: "1:645224445897:web:3d47f1f0a89f7662dbda18",
  measurementId: "G-BJHRQF763N"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("month-year");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const eventInput = document.getElementById("event-input");
const saveBtn = document.getElementById("save-event");
const deleteBtn = document.getElementById("delete-event");
const closeBtn = document.getElementById("close-popup");

let currentDate = new Date();
let selectedDate = null;

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYearEl.textContent = `${date.toLocaleString("th-TH", {
    month: "long"
  })} ${year}`;

  calendarEl.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const pad = document.createElement("div");
    pad.classList.add("calendar-day", "empty");
    calendarEl.appendChild(pad);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("calendar-day");
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    dayEl.textContent = d;

    db.ref("events/" + fullDate).once("value", (snapshot) => {
      if (snapshot.exists()) {
        dayEl.classList.add("has-event");
      }
    });

    dayEl.addEventListener("click", () => openPopup(fullDate));

    calendarEl.appendChild(dayEl);
  }
}

function openPopup(dateStr) {
  selectedDate = dateStr;
  popupTitle.textContent = `กิจกรรมวันที่ ${dateStr}`;

  db.ref("events/" + dateStr).once("value", (snapshot) => {
    if (snapshot.exists()) {
      eventInput.value = snapshot.val().title;
      deleteBtn.style.display = "inline-block";
    } else {
      eventInput.value = "";
      deleteBtn.style.display = "none";
    }
  });

  popup.classList.remove("hidden");
}

function closePopupBox() {
  popup.classList.add("hidden");
  eventInput.value = "";
  selectedDate = null;
}

saveBtn.addEventListener("click", () => {
  if (!selectedDate) return;
  const title = eventInput.value.trim();
  if (title === "") return;

  db.ref("events/" + selectedDate).set({ title }).then(() => {
    renderCalendar(currentDate);
    closePopupBox();
  });
});

deleteBtn.addEventListener("click", () => {
  if (!selectedDate) return;

  db.ref("events/" + selectedDate).remove().then(() => {
    renderCalendar(currentDate);
    closePopupBox();
  });
});

closeBtn.addEventListener("click", closePopupBox);

document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
