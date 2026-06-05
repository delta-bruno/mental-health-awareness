function checkMood() {
    const mood = document.getElementById("mood").value;
    const result = document.getElementById("result");

    if (mood === "happy") {
        result.textContent =
            "Great! Keep doing things that support your well-being.";
    }
    else if (mood === "okay") {
        result.textContent =
            "Take some time today for activities you enjoy.";
    }
    else if (mood === "sad") {
        result.textContent =
            "It's okay to have difficult days. Reach out to someone you trust if you need support.";
    }
    else if (mood === "stressed") {
        result.textContent =
            "Consider taking a break, exercising, or talking with someone you trust.";
    }
    else {
        result.textContent =
            "Please select a mood.";
    }
}