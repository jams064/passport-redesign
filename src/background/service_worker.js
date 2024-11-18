// Apply theme anonymous function
const applyTheme = (theme) => {
    // Get document stylesheet
    const styles = document.documentElement.style;

    // Loop through theme keys and apply to page
    for (const [key, value] of Object.entries(theme)) {
        styles.setProperty(key, value, "important");
    }

    // Log the change
    console.log("Applied theme:", theme);
}

// Fetch the saved theme from local storage
chrome.storage.local.get(["PASSPORT_THEME"]).then((data) => {
    // Check if there is data and apply the data if it exists
    if (data?.PASSPORT_THEME) {
        applyTheme(JSON.parse(data.PASSPORT_THEME));
    }
});