let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const monthDisplay  = document.getElementById('monthDisplay');
const calendar = document.getElementById('calendar');
const newEventModal  = document.getElementById('newEventModal');
const deleteEventModal  = document.getElementById('deleteEventModal');
const backDrop  = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay){
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';
}

function closeModal() {
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    eventTitleInput.classList.remove('error');
    load();
}

function saveEvent() {
    if(eventTitleInput.value) {
        eventTitleInput.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitleInput.value
        });
        localStorage.setItem('events', JSON.stringify(events));
    } else {
        eventTitleInput.classList.add('error');
    }
    closeModal();
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function load() {
    const dt = new Date();

    if (nav !==  0){
        dt.setMonth(new Date().getMonth() + nav)
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear()
    console.log(day, month, year);

    const firstDateOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log(firstDateOfMonth)
    console.log(daysInMonth)

    const dateString = firstDateOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
    console.log(dateString)

    const paddingDays  = weekdays.indexOf(dateString.split(',')[0]);
    console.log(paddingDays)

    monthDisplay.innerText = `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`;
    calendar.innerText = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays){
            daySquare.innerText = i - paddingDays;

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay' ;
            }

            const eventForDay = events.find(e => e.date === dayString);
            if(eventForDay){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding')
        }
        calendar.appendChild(daySquare);
    }
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();