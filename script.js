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
    let nextSessionTime = 0;
    let nextSessionHours = 0;
    let nextSessionMinutes = 0;
    let nextSessionSeconds = 0;
    let nextSessionOpeningTime = "";

    // Determine AM/PM
    let period = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12; // Handle 12 AM/PM case

    // New York (9 PM - 6 AM UTC+8)
    if (hours >= 21 || hours < 6) {
        session = "New York Session";
        nextSession = "Asia"; // Replaced Tokyo with Asia

        let timeUntilAsia = 0;
        let timeUntilAsiaMinutes = 0;
        let timeUntilAsiaSeconds = 0;

        if (hours >= 21) {
            timeUntilAsia = (7 - hours + 24) % 24; // Time until 8 AM (next day)
        } else {
            timeUntilAsia = (7 - hours) % 24; // Time until 8 AM (same day)
        }

        // Calculate the remaining minutes and seconds
        timeUntilAsiaMinutes = (60 - minutes) % 60;  // Remaining minutes to the next session
        timeUntilAsiaSeconds = (60 - seconds) % 60; // Remaining seconds to the next session

        nextSessionTime = timeUntilAsia;
        nextSessionHours = timeUntilAsia;
        nextSessionMinutes = timeUntilAsiaMinutes;
        nextSessionSeconds = timeUntilAsiaSeconds;
        nextSessionOpeningTime = "08:00 AM"; // Asia opens at 8 AM UTC+8
    }

    return {
        session,
        nextSession,
        nextSessionTime,
        nextSessionHours,
        nextSessionMinutes,
        nextSessionSeconds,
        nextSessionOpeningTime,
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
        nextSessionTime,
        nextSessionHours,
        nextSessionMinutes,
        nextSessionSeconds,
        nextSessionOpeningTime,
        hours12,
        minutes,
        seconds,
        period,
        formattedDate
    } = getMarketSession();

    const timeString = `${hours12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${period}`;
    const nextSessionString = `${nextSession} (${nextSessionOpeningTime}) in ${nextSessionHours}h ${nextSessionMinutes}m ${nextSessionSeconds}s`;

    // Set the date and time
    document.getElementById("date").textContent = formattedDate;
    document.getElementById("time").textContent = timeString;
    document.getElementById("session").textContent = session;
    document.getElementById("next-session").textContent = nextSessionString;
}

setInterval(updateClock, 1000); // Update every second
updateClock(); // Initial call to set time immediately
