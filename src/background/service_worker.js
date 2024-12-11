import { Theme, Themes, applyTheme } from "./globals";

// Fetch the saved theme from local storage
chrome.storage.local.get(["PASSPORT_THEME"]).then((data) => {
	// Check if there is data and apply the data if it exists
	if (data?.PASSPORT_THEME) {
		console.log("Found saved theme");
		applyTheme(JSON.parse(data.PASSPORT_THEME));
	}
});
