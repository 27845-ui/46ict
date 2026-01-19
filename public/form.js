document.addEventListener("DOMContentLoaded", () => {
  const studentCodeInput = document.getElementById("code");
  const nameInput = document.getElementById("name");
  const classInput = document.getElementById("class");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const form = document.getElementById("lateForm");

  const popup = document.getElementById("confirmPopup");
  const popupText = document.getElementById("popupText");
  const popupPhoto = document.getElementById("popupPhoto");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  let studentData = {};
  let popupOpened = false;
  let currentFormData = null;

  /* ===============================
     โหลดฐานข้อมูลนักเรียน
  =============================== */
  fetch("/studentbase/studentdb.json")
    .then(res => res.json())
    .then(data => {
      studentData = data;
    })
    .catch(err => {
      console.error("โหลด studentdb.json ไม่สำเร็จ:", err);
    });

  /* ===============================
     ตั้งค่าวัน / เวลา
  =============================== */
  function setCurrentDateTime() {
    const now = new Date();
    dateInput.value = now.toISOString().split("T")[0];
    timeInput.value = now.toTimeString().slice(0, 5);
  }
  setCurrentDateTime();

  /* ===============================
     กรอกรหัส → เติมชื่อ/ห้อง
  =============================== */
  studentCodeInput.addEventListener("input", () => {
    const code = studentCodeInput.value.trim();
    if (studentData[code]) {
      nameInput.value = studentData[code].name || "";
      classInput.value = studentData[code].class || "";
    } else {
      nameInput.value = "";
      classInput.value = "";
    }
  });

  /* ===============================
     Submit → Popup
  =============================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (popupOpened) return;

    const code = studentCodeInput.value.trim();
    const name = nameInput.value.trim();
    const className = classInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!code || !name || !className) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    currentFormData = { code, name, className, date, time };

    popupText.textContent =
      `รหัสนักเรียน: ${code}\n` +
      `ชื่อ-สกุล: ${name}\n` +
      `ห้องเรียน: ${className}`;

    /* ===============================
       FIX รูปไม่ขึ้น (จุดสำคัญ)
    =============================== */
    const photoUrl = `https://sscbm.netlify.app/images/${code}.jpg`;

    popupPhoto.classList.add("hidden");
    popupPhoto.src = photoUrl;

    popupPhoto.onload = () => {
      popupPhoto.classList.remove("hidden");
    };

    popupPhoto.onerror = () => {
      console.warn("ไม่พบรูป:", photoUrl);
      popupPhoto.src =
        "https://via.placeholder.com/180x240?text=No+Image";
      popupPhoto.classList.remove("hidden");
    };
    /* =============================== */

    popup.classList.remove("hidden");
    popupOpened = true;
  });

  /* ===============================
     ยืนยันบันทึก
  =============================== */
  confirmBtn.addEventListener("click", () => {
    if (!currentFormData) return;

    popup.classList.add("hidden");
    popupOpened = false;

    const formData = new FormData();
    Object.entries(currentFormData).forEach(([k, v]) =>
      formData.append(k, v)
    );

    fetch(
      "https://script.google.com/macros/s/AKfycbzfkBJnLObn_UudOWBTpZfVsHeFgNHdstdop1uqsMwYyGr1r5GogHk9UfJkKLAJa98/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then(res => res.text())
      .then(text => {
        if (text.trim() === "success") {
          alert("✅ บันทึกสำเร็จ");
          form.reset();
          setTimeout(setCurrentDateTime, 100);
        } else {
          alert("❌ เกิดข้อผิดพลาด: " + text);
        }
      })
      .catch(() => {
        alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      });

    currentFormData = null;
  });

  /* ===============================
     ยกเลิก
  =============================== */
  cancelBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    popupOpened = false;
    currentFormData = null;
  });
});
