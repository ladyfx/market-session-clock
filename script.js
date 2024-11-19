function getMarketSession() {
    const now = new Date();
    const hours = (now.getUTCHours() + 8) % 24; // Convert to Malaysia time (UTC+8)
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    // Get the current date in the desired format
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const date = now.getDate();
    const formattedDate = `${day}, ${date} ${month}`;

    let session = "";
    let nextSession = "";
    let nextSessionTime = new Date(now); // Initialize with the current date and time
    let nextSessionOpeningTime = "";

    // Determine AM/PM
    let period = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12; // Handle 12 AM/PM case

    // Determine current session and next session with exact next session time
    if (hours >= 8 && hours < 16) {
        // Asia Session (8 AM - 4 PM)
        session = "Asia Session";
        nextSession = "London";

        nextSessionTime.setHours(16); // Local time (4 PM)
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
        nextSessionOpeningTime = "04:00 PM";
    } else if (hours >= 16 && hours < 21) {
        // London Session (4 PM - 9 PM)
        session = "London Session";
        nextSession = "New York";

        nextSessionTime.setHours(21); // Local time (9 PM)
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
        nextSessionOpeningTime = "09:00 PM";
    } else if (hours >= 5 && hours < 8) {
        // Waiting for Asia (5 AM - 8 AM)
        session = "Waiting for Asia";
        nextSession = "Asia";

        nextSessionTime.setHours(8); // Local time (8 AM)
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
        nextSessionOpeningTime = "08:00 AM";
    } else {
        // New York Session (9 PM - 5 AM)
        session = "New York Session";
        nextSession = "Waiting for Asia";

        if (hours < 5) {
            nextSessionTime.setHours(5); // Local time (5 AM same day)
        } else {
            nextSessionTime.setDate(nextSessionTime.getDate() + 1); // Move to next day
            nextSessionTime.setHours(5); // Local time (5 AM next day)
        }
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
        nextSessionOpeningTime = "05:00 AM";
    }

    // Calculate the countdown to the next session
    const timeDifference = nextSessionTime - now;
    const countdownHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const countdownMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const countdownSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
        session,
        nextSession,
        countdownHours,
        countdownMinutes,
        countdownSeconds,
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
        countdownHours,
        countdownMinutes,
        countdownSeconds,
        nextSessionOpeningTime,
        hours12,
        minutes,
        seconds,
        period,
        formattedDate
    } = getMarketSession();

    const timeString = `${hours12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${period}`;
    const nextSessionString = `${nextSession} (${nextSessionOpeningTime}) in ${countdownHours}h ${countdownMinutes}m ${countdownSeconds}s`;

    // Set the date and time
    document.getElementById("date").textContent = formattedDate;
    document.getElementById("time").textContent = timeString;
    document.getElementById("session").textContent = session;
    document.getElementById("next-session").textContent = nextSessionString;
}

setInterval(updateClock, 1000); // Update every second
updateClock(); // Initial call to set time immediately
