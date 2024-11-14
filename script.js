function getMarketSession() {
    const now = new Date();
    const hours = now.getUTCHours() + 8; // Malaysia time is UTC+8
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    // Get the current date in the desired format (Day, DD Nov)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const date = now.getDate();
    const formattedDate = `${day}, ${date} ${month}`;

    let session = "";
    let nextSession = "";
    let nextSessionOpeningTime = "";
    let remainingHours = 0;
    let remainingMinutes = 0;
    let remainingSeconds = 0;

    // Determine AM/PM
    let period = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12; // Handle 12 AM/PM case

    // Market sessions in UTC+8 (Malaysia time)
    if (hours >= 8 && hours < 16) {
        // Asia Session (8 AM - 4 PM)
        session = "Asia Session";
        nextSession = "London";
        nextSessionOpeningTime = "04:00 PM";

        // Calculate time until London session at 4 PM
        remainingHours = 15 - hours;
        remainingMinutes = (60 - minutes) % 60;
        remainingSeconds = (60 - seconds) % 60;

        if (minutes === 0 && seconds === 0) remainingHours++;
    } else if (hours >= 16 && hours < 21) {
        // London Session (4 PM - 9 PM)
        session = "London Session";
        nextSession = "New York";
        nextSessionOpeningTime = "09:00 PM";

        // Calculate time until New York session at 9 PM
        remainingHours = 20 - hours;
        remainingMinutes = (60 - minutes) % 60;
        remainingSeconds = (60 - seconds) % 60;

        if (minutes === 0 && seconds === 0) remainingHours++;
    } else if (hours >= 21 || hours < 6) {
        // New York Session (9 PM - 6 AM)
        session = "New York Session";
        nextSession = "Asia";
        nextSessionOpeningTime = "08:00 AM";

        // Calculate time until Asia session at 8 AM
        if (hours >= 21) {
            remainingHours = (7 + 24 - hours) % 24;
        } else {
            remainingHours = 7 - hours;
        }
        remainingMinutes = (60 - minutes) % 60;
        remainingSeconds = (60 - seconds) % 60;

        if (minutes === 0 && seconds === 0) remainingHours++;
    } else {
        // Pre-Asia Gap (6 AM - 8 AM)
        session = "Waiting for Asia Session";
        nextSession = "Asia";
        nextSessionOpeningTime = "08:00 AM";

        // Calculate time until Asia session at 8 AM
        remainingHours = 7 - hours;
        remainingMinutes = (60 - minutes) % 60;
        remainingSeconds = (60 - seconds) % 60;

        if (minutes === 0 && seconds === 0) remainingHours++;
    }

    return {
        session,
        nextSession,
        nextSessionOpeningTime,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
        hours12,
        minutes,
        seconds,
        period,
        formattedDate,
    };
}

function updateClock() {
    const {
        session,
        nextSession,
        nextSessionOpeningTime,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
        hours12,
        minutes,
        seconds,
        period,
        formattedDate
    } = getMarketSession();

    const timeString = `${hours12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${period}`;
    const nextSessionString = `${nextSession} (${nextSessionOpeningTime}) in ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;

    // Set the date and time
    document.getElementById("date").textContent = formattedDate;
    document.getElementById("time").textContent = timeString;
    document.getElementById("session").textContent = session;
    document.getElementById("next-session").textContent = nextSessionString;
}

setInterval(updateClock, 1000); // Update every second
updateClock(); // Initial call to set time immediately
