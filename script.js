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

    // Check if it's the weekend
    const isWeekend = now.getDay() === 6 || now.getDay() === 0; // Saturday or Sunday

    if (isWeekend) {
        session = "FX Market Closed";

        // Calculate next Asia session opening time on Monday
        nextSession = "Asia Session";
        const daysUntilMonday = now.getDay() === 6 ? 2 : 1; // If Saturday, add 2; if Sunday, add 1
        nextSessionTime.setDate(nextSessionTime.getDate() + daysUntilMonday);
        nextSessionTime.setHours(8); // 8:00 AM Monday (Asia session opens)
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
    } else {
        // Normal Forex market logic
        if (hours >= 8 && hours < 16) {
            // Asia Session (8 AM - 4 PM)
            session = "Asia Session";
            nextSession = "London Session";
            nextSessionTime.setHours(16); // Local time (4 PM)
        } else if (hours >= 16 && hours < 21) {
            // London Session (4 PM - 9 PM)
            session = "London Session";
            nextSession = "New York Session";
            nextSessionTime.setHours(21); // Local time (9 PM)
        } else if (hours >= 21 || hours < 5) {
            // New York Session (9 PM - 5 AM)
            session = "New York Session";
            nextSession = "Asia Session";
            if (hours < 5) {
                nextSessionTime.setHours(5); // Local time (5 AM same day)
            } else {
                nextSessionTime.setDate(nextSessionTime.getDate() + 1); // Move to next day
                nextSessionTime.setHours(5); // Local time (5 AM next day)
            }
        } else {
            // Pre-market waiting for Asia Session (5 AM - 8 AM)
            session = "Waiting for Asia";
            nextSession = "Asia Session";
            nextSessionTime.setHours(8); // Local time (8 AM)
        }
        nextSessionTime.setMinutes(0);
        nextSessionTime.setSeconds(0);
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
        formattedDate,
    };
}

function updateClock() {
    const {
        session,
        countdownHours,
        countdownMinutes,
        countdownSeconds,
        formattedDate
    } = getMarketSession();

    const timeString = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const nextSessionString = `Asia Session opens in ${countdownHours}h ${countdownMinutes}m ${countdownSeconds}s`;

    // Update DOM elements
    document.getElementById("date").textContent = formattedDate;
    document.getElementById("time").textContent = timeString;
    document.getElementById("session").textContent = session;
    document.getElementById("next-session").textContent = nextSessionString;
}

setInterval(updateClock, 1000); // Update every second
updateClock(); // Initial call to set time immediately
