document.addEventListener("DOMContentLoaded", () => {
  const studentCodeInput = document.getElementById("code");
  const nameInput = document.getElementById("name");
  const classInput = document.getElementById("class");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const form = document.getElementById("lateForm");

  let studentData = {};

  fetch("studentbase/studentdb.json")
    .then((response) => response.json())
    .then((data) => {
      studentData = data;
    })
    .catch((error) => {
      console.error("โหลด studentbase.json ไม่สำเร็จ:", error);
    });

  function setCurrentDateTime() {
    const now = new Date();
    dateInput.value = now.toISOString().split("T")[0];
    timeInput.value = now.toTimeString().slice(0, 5);
  }

  setCurrentDateTime();

  studentCodeInput.addEventListener("input", () => {
    const code = studentCodeInput.value.trim();
    if (studentData[code]) {
      nameInput.value = studentData[code].name;
      classInput.value = studentData[code].class;
    } else {
      nameInput.value = "";
      classInput.value = "";
    }
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const code = studentCodeInput.value.trim();
  const name = nameInput.value.trim();
  const className = classInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  const confirmMsg = `📌 รหัสนักเรียน: ${code}\n` +
    `ชื่อ-สกุล: ${name}\n` +
    `ห้องเรียน: ${className}\n` ;

<<<<<<< HEAD
document.getElementById("popupText").innerText = confirmMsg;

const photoEl = document.getElementById("popupPhoto");

if (studentData[code] && studentData[code].photo) {
  photoEl.src = studentData[code].photo;
  photoEl.classList.remove("hidden");
} else {
  photoEl.classList.add("hidden");
}

=======
  document.getElementById("popupText").innerText = confirmMsg;
>>>>>>> 174a5c5b50ff3f6e24feb7c0ba52882cacb7e992

  const popup = document.getElementById("confirmPopup");
  popup.classList.remove("hidden");

  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const handleConfirm = () => {
    popup.classList.add("hidden");

    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("class", className);
    formData.append("date", date);
    formData.append("time", time);

    fetch("https://script.google.com/macros/s/AKfycbzfkBJnLObn_UudOWBTpZfVsHeFgNHdstdop1uqsMwYyGr1r5GogHk9UfJkKLAJa98/exec", {
      method: "POST",
      body: formData
    })
      .then((res) => res.text())
      .then((text) => {
        if (text.trim() === "success") {
          alert("✅ บันทึกสำเร็จ");
          form.reset();
          setTimeout(() => {
            setCurrentDateTime();
          }, 100);
        } else {
          alert("❌ เกิดข้อผิดพลาด: " + text);
        }
      })
      .catch((err) => {
        console.error("❌ fetch error:", err);
        alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      });

    confirmBtn.removeEventListener("click", handleConfirm);
    cancelBtn.removeEventListener("click", handleCancel);
  };

const handleCancel = () => {
  popup.classList.add("hidden");
  form.reset();
  setTimeout(() => {
    setCurrentDateTime();
  }, 100);

  confirmBtn.removeEventListener("click", handleConfirm);
  cancelBtn.removeEventListener("click", handleCancel);
};


  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", handleCancel);
  });
});
