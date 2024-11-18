// Useful for debugging
const isExtension = () => {
    return window.chrome && chrome.runtime && chrome.runtime.id;
}

// CSS functions and macros
const rgb = (r, g, b) => {
    return `rgb(${r}, ${g}, ${b})`;
}
const rgba = (r, g, b, a) => {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
const white = "white";
const black = "black";

// Define theme class
class Theme {
    Name;
    Data = {};

    constructor(name, data) {
        this.Name = name;
        this.Data = data;
    }

    toCSSVariables() {
        const vars = {};

        for(const [key, value] of Object.entries(this.Data)) {
            vars[`--${key}`] = value;
        }

        return vars;
    }
}

// Define themes
const themes = {
    "Default": new Theme("Default", {
        "background-color": white,
        "background-color2": "#EEE",
    
        "content-color": black,
        "content-color2": white,
        "link-color": rgb(79, 118, 169),
    
        "color1": rgb(255, 119, 7),
        "color2":  rgb(139, 119, 7),
        "color3": rgb(160, 170, 143),
        "color4": rgb(176, 196, 222),
    
        "tab-color": rgba(7, 74, 138, 0.5),
        "active-tab-color": rgba(7, 74, 138, 0.8)
    }),
    "FlatLight": new Theme("Flat Light", {
        "background-color": "#FFF",
        "background-color2": "#EEE",
    
        "content-color": black,
        "content-color2": white,
        "link-color": rgb(79, 118, 169),
    
        "color1": "#999",
        "color2": "#999",
        "color3": "#888",
        "color4": "#777",
    
        "tab-color": "#DDD",
        "active-tab-color": "#AAA"
    }),
    "FlatDark": new Theme("Flat Dark", {
        "background-color": "#111",
        "background-color2": "#222",

        "content-color": "#EEE",
        "content-color2": black,
        "link-color": rgb(90, 110, 180),

        "color1": "#222",
        "color2": "#222",
        "color3": "#333",
        "color4": "#444",

        "tab-color": "#333",
        "active-tab-color": "#444"
    })
}

// Function to apply theme to the extension's popup buttons
const applyPopupTheme = (theme) => {
    // Fetch keys from theme
    const cssKeys = theme.toCSSVariables();

    // Get the popup's stylesheet and apply the styles
    const styles = document.documentElement.style;
    for (const [key, value] of Object.entries(cssKeys)) {
        styles.setProperty(key, value, "important");
    }
}

// Function to send theme data to all passport tabs, aswell as the popup and save to local storage
const applyTheme = (theme) => {
    // Get keys from theme
    const cssKeys = theme.toCSSVariables();

    // Apply theme to the popup
    applyPopupTheme(theme);

    // Get all open passport tabs
    if (isExtension()) {
        chrome.tabs.query({url: "*://portal.besd.net/Passport/*"}).then((tabs) => {
            // Loop through all the tabs
            tabs.forEach(tab => {
                // Execute the script that applies the theme on the tab
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    args: [cssKeys],
                    func: (theme) => {
                        // Get document stylesheet
                        const styles = document.documentElement.style;
    
                        // Loop through theme keys and apply to page
                        for (const [key, value] of Object.entries(theme)) {
                            styles.setProperty(key, value, "important");
                        }
    
                        // Log the change
                        console.log("Applied theme:", theme);
                    }
                })
            });
        });
    }

    // Save theme to local storage
    if (isExtension()) {
        chrome.storage.local.set({ "PASSPORT_THEME": JSON.stringify(cssKeys) }).then(() => {
            console.log("Saved theme")
        });
    }
} 

// Function to initialize theme buttons on the popup
const initializeThemeButtons = () => {
    // Get the themeList ul element
    const themeList = document.getElementById("themeList");

    // Loop through all themes
    for (const [_, theme] of Object.entries(themes)) {
        // Create button elements
        const newLi = document.createElement("li");
        const newButton = document.createElement("button");
        newLi.appendChild(newButton);

        // Set attributes and styles of elements
        newButton.innerHTML = theme.Name;
        newButton.style.backgroundColor = theme.Data["background-color"];
        newButton.style.color = theme.Data["content-color"];

        // Assign the onclick function
        newButton.onclick = () => {
            applyTheme(theme);
        }

        // Append theme button to themeList
        themeList.appendChild(newLi);
    }
}

// Function to create the color buttons from a startingTheme, each key of the theme has it's buttons that shows the color
const makeColorButtons = (startingTheme) => {
    // Get the colorList ul element
    const colorList = document.getElementById("colorList");

    // Loop through all of the theme's keys and values
    for (const [propertyName, color] of Object.entries(startingTheme)) {
        // Set the document's style for the property
        document.documentElement.style.setProperty(`${propertyName}`, color, "important")

        // Create button elements
        const newLi = document.createElement("li");
        const newButton = document.createElement("button");
        newLi.appendChild(newButton);

        // Set attributes and styles of elements
        newButton.innerHTML = propertyName;
        newButton.style.backgroundColor = `var(${propertyName})`;
        newButton.style.fontWeight = "bold";
        newButton.style.color = "white";

        newButton.id = propertyName;

        // Assign the onclick function
        newButton.onclick = () => {
            console.log("Click", propertyName);
        }

        // Append color button to colorList
        colorList.appendChild(newLi);
    }
}

// Function to initialize color theme
const initializeColorButtons = () => {
    // Fetch saved theme, if it exists then create buttons with that theme
    // else, use the default theme.

    if (isExtension()) {
        chrome.storage.local.get("PASSPORT_THEME").then((result) => {
            if (result?.PASSPORT_THEME) {
                console.log("Found stored theme", result.PASSPORT_THEME);
                makeColorButtons(JSON.parse(result.PASSPORT_THEME));
            } else {
                console.log("Found nothing stored")
                makeColorButtons(themes.Default.toCSSVariables());
            }
        });
    } else {
        makeColorButtons(themes.Default.toCSSVariables());
    }
}

// Call the initialize functions
initializeThemeButtons();
initializeColorButtons();

// ## Tab Section ## \\

// Declare starting variables
let currentTab = "themeTab";

// Function to select tabButton with Id
const setActiveButton = (tabId) => {
    const button = document.querySelector(`.tabBar > button#${tabId}`);

    document.querySelector(".activeTabButton")?.classList?.remove("activeTabButton");
    if (button) {
        button.classList.add("activeTabButton");
    }
}

const setActiveTab = (tabId) => {
    const tab = document.querySelector(`.tabContainer > .tab#${tabId}`);

    document.querySelector(".activeTab")?.classList?.remove("activeTab");
    if (tab) {
        tab.classList.add("activeTab");
    }
}

const selectTab = (tabId) => {
    currentTab = tabId;

    setActiveButton(tabId);
    setActiveTab(tabId)
}

const initializeTabButtons = () => {
    const buttonsQuery = document.querySelectorAll(".tabBar > button");
    
    for (let i = 0; i < buttonsQuery.length; i++) {
        const button = buttonsQuery.item(i);

        button.onclick = () => {
            selectTab(button.id);
        }
    }
}

// Initialize current tab
selectTab(currentTab);

// Initialize other stuff
initializeTabButtons();