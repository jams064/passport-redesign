const rgb = (r, g, b) => {
    return `rgb(${r}, ${g}, ${b})`;
}
const rgba = (r, g, b, a) => {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
const white = "white";
const black = "black";

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

const applyPopupTheme = (theme) => {
    const cssKeys = theme.toCSSVariables();

    const styles = document.documentElement.style;
    for (const [key, value] of Object.entries(cssKeys)) {
        styles.setProperty(key, value, "important");
    }
}

const applyTheme = (theme) => {
    const cssKeys = theme.toCSSVariables();
    chrome.storage.local.set({ "PASSPORT_THEME": JSON.stringify(cssKeys) }).then(() => {console.log("Saved theme")});

    applyPopupTheme(theme);

    chrome.tabs.query({url: "*://portal.besd.net/Passport/*"}).then((tabs) => {
        tabs.forEach(tab => {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                args: [cssKeys],
                func: (keys) => {
                    const styles = document.querySelector("html").style;
                    for (const [key, value] of Object.entries(keys)) {
                        styles.setProperty(key, value, "important");
                    }
                    console.log("Applied theme:", keys);
                }
            })
        });
    });
}

const initializeThemeButtons = () => {
    const themeList = document.getElementById("themeList");

    for (const [name, theme] of Object.entries(themes)) {
        // console.log(name, theme);

        const newLi = document.createElement("li");
        const newButton = document.createElement("button");
        newLi.appendChild(newButton);

        newButton.innerHTML = theme.Name;
        newButton.style.backgroundColor = theme.Data["background-color"];
        newButton.style.color = theme.Data["content-color"];

        newButton.onclick = () => {
            applyTheme(theme);
        }

        themeList.appendChild(newLi);
    }
}

const makeColorButtons = (startingTheme) => {
    const colorList = document.getElementById("colorList");

    for (const [colorName, color] of Object.entries(startingTheme)) {
        document.documentElement.style.setProperty(`${colorName}`, color, "important")

        const newLi = document.createElement("li");
        const newButton = document.createElement("button");
        newLi.appendChild(newButton);

        newButton.innerHTML = colorName;
        newButton.style.backgroundColor = `var(${colorName})`;
        newButton.style.fontWeight = "bold";
        newButton.style.color = "white";

        newButton.id = colorName;

        newButton.onclick = () => {
            console.log("Click", colorName);
        }

        colorList.appendChild(newLi);
    }
}

const initializeColorButtons = () => {
    chrome.storage.local.get("PASSPORT_THEME").then((result) => {
        if (result?.PASSPORT_THEME) {
            console.log("Found stored theme", result.PASSPORT_THEME);
            makeColorButtons(JSON.parse(result.PASSPORT_THEME));
        } else {
            console.log("Found nothing stored")
            makeColorButtons(themes.Default.toCSSVariables());
        }
    })
}

// const initializePopupTheme = () => {
//     const currentTheme = undefined;
//     chrome.storage.local.get("PASSPORT_THEME").then((theme) => {
//         currentTheme = theme;
//     })

//     if (currentTheme) {
//         applyPopupTheme(currentTheme);
//     } else {
//         applyPopupTheme(themes.Default);
//     }
// }

initializeThemeButtons();
initializeColorButtons();