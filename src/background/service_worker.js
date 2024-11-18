const applyTheme = (theme) => {
    const styles = document.querySelector("html").style;
    for (const [key, value] of Object.entries(theme)) {
        styles.setProperty(key, value, "important");
    }
    console.log("Applied theme:", theme);
}

chrome.storage.local.get(["PASSPORT_THEME"]).then((data) => {
    applyTheme(JSON.parse(data.PASSPORT_THEME));
});