const holidays = [
  { hdate: "01-01-2023", holiday: "New Year Day" },
  { hdate: "15-01-2023", holiday: "Pongal" },
  { hdate: "16-01-2023", holiday: "Thiruvalluvar Day" },
  { hdate: "17-01-2023", holiday: "Uzhavar Thirunal" },
  { hdate: "26-01-2023", holiday: "Republic Day" },
  { hdate: "05-02-2023", holiday: "Thai Poosam" },
  { hdate: "22-03-2023", holiday: "Telugu New Year Day" },
  { hdate: "01-04-2023", holiday: "Annual closing of Accounts for Banks" },
  { hdate: "04-04-2023", holiday: "Mahaveer Jayanthi" },
  { hdate: "07-04-2023", holiday: "Good Friday" },
  { hdate: "14-04-2023", holiday: "Tamil New Year & Ambedkar Jayanthi" },
  { hdate: "22-04-2023", holiday: "Ramzan (Idul Fitr)" },
  { hdate: "01-05-2023", holiday: "May Day" },
  { hdate: "29-06-2023", holiday: "Bakrid(Idul Azha)" },
  { hdate: "29-07-2023", holiday: "Muharram" },
  { hdate: "15-08-2023", holiday: "Independence Day" },
  { hdate: "06-09-2023", holiday: "Krishna Jayanthi" },
  { hdate: "17-09-2023", holiday: "Vinayakar Chathurthi" },
  { hdate: "28-09-2023", holiday: "Milad-un-Nabi" },
  { hdate: "02-10-2023", holiday: "Gandhi Jayanthi" },
  { hdate: "23-10-2023", holiday: "Ayutha Pooja" },
  { hdate: "24-10-2023", holiday: "Vijaya Dasami" },
  { hdate: "12-11-2023", holiday: "Deepavali" },
  { hdate: "25-12-2023", holiday: "Christmas" }
];

const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");
const btnBack = document.querySelector("#btnBack");
const btnNext = document.querySelector("#btnNext");
const btnDelete = document.querySelector("#btnDelete");
const btnSave = document.querySelector("#btnSave");
const closeButtons = document.querySelectorAll(".btnClose");
const txtTitle = document.querySelector("#txtTitle");

let navigation = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function loadCalendar() {
  const dt = new Date();
  if (navigation !== 0) dt.setMonth(dt.getMonth() + navigation);
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  monthBanner.innerText = `${dt.toLocaleDateString("en-us", {
    month: "long",
  })} ${year}`;

  calendar.innerHTML = "";
  const dayInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayofMonth = new Date(year, month, 1);

  // ✅ FIXED: safer weekday calculation
  const weekdayName = firstDayofMonth.toLocaleDateString("en-us", { weekday: "long" }).toLowerCase();
  const emptyDays = weekdays.map(w => w.toLowerCase()).indexOf(weekdayName);

  for (let i = 1; i <= dayInMonth + emptyDays; i++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    if (i > emptyDays) {
      const actualDate = i - emptyDays;
      const dateVal = actualDate < 10 ? "0" + actualDate : actualDate;
      const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
      const dateText = `${dateVal}-${monthVal}-${year}`;

      dayBox.innerText = actualDate;

      const eventOfTheDay = events.find((e) => e.date === dateText);
      const holidayOfTheDay = holidays.find((e) => e.hdate === dateText);

      if (actualDate === day && navigation === 0) {
        dayBox.id = "currentDay";
      }

      if (eventOfTheDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventOfTheDay.title;
        dayBox.appendChild(eventDiv);
      }

      if (holidayOfTheDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event", "holiday");
        eventDiv.innerText = holidayOfTheDay.holiday;
        dayBox.appendChild(eventDiv);
      }

      dayBox.addEventListener("click", () => showModal(dateText));
    } else {
      dayBox.classList.add("plain");
    }

    calendar.append(dayBox);
  }
}

function showModal(dateText) {
  clicked = dateText;
  const eventOfTheDay = events.find((e) => e.date === dateText);

  if (eventOfTheDay) {
    document.querySelector("#eventText").innerText = eventOfTheDay.title;
    viewEventForm.style.display = "block";
  } else {
    addEventForm.style.display = "block";
  }

  modal.style.display = "block";
}

function closeModal() {
  viewEventForm.style.display = "none";
  addEventForm.style.display = "none";
  modal.style.display = "none";
  txtTitle.value = "";
  clicked = null;
  loadCalendar();
}

btnBack.addEventListener("click", () => {
  navigation--;
  loadCalendar();
});

btnNext.addEventListener("click", () => {
  navigation++;
  loadCalendar();
});

btnDelete.addEventListener("click", () => {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
});

btnSave.addEventListener("click", () => {
  if (txtTitle.value.trim()) {
    txtTitle.classList.remove("error");
    events.push({ date: clicked, title: txtTitle.value.trim() });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    txtTitle.classList.add("error");
  }
});

closeButtons.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

loadCalendar();
