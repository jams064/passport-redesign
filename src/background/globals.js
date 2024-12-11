// CSS functions and macros
const toHex = (n) => {
	n = Math.min(Math.max(n, 0), 255);

	let h = n.toString(16);

	if (h.length < 2) {
		h = "0" + h;
	}

	return h;
};

const rgb = (r, g, b) => {
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
const rgba = (r, g, b, a) => {
	return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`;
};
const white = "#ffffff";
const black = "#000000";

class Theme {
	Name;
	Data = {};

	constructor(name, data) {
		this.Name = name;
		this.Data = data;
	}

	toCSSVariables() {
		const vars = {};

		for (const [key, value] of Object.entries(this.Data)) {
			vars[`--${key}`] = value;
		}

		return vars;
	}
}

let Themes = {
	Default: new Theme("Default", {
		"background-color": white,
		"background-color2": "#EEEEEE",

		"content-color": black,
		"content-color2": white,
		"link-color": rgb(79, 118, 169),

		color1: rgb(255, 119, 7),
		color2: rgb(139, 119, 7),
		color3: rgb(160, 170, 143),
		color4: rgb(176, 196, 222),

		"tab-color": rgba(7, 74, 138, 0.5),
		"active-tab-color": rgba(7, 74, 138, 0.8),
	}),
	FlatLight: new Theme("Flat Light", {
		"background-color": white,
		"background-color2": "#EEEEEE",

		"content-color": black,
		"content-color2": white,
		"link-color": rgb(79, 118, 169),

		color1: "#cccccc",
		color2: "#bbbbbb",
		color3: "#bbbbbb",
		color4: "#aaaaaa",

		"tab-color": "#DDDDDD",
		"active-tab-color": "#AAAAAA",
	}),
	FlatDark: new Theme("Flat Dark", {
		"background-color": "#111111",
		"background-color2": "#222222",

		"content-color": "#EEEEEE",
		"content-color2": black,
		"link-color": rgb(90, 110, 180),

		color1: "#222222",
		color2: "#222222",
		color3: "#333333",
		color4: "#444444",

		"tab-color": "#333333",
		"active-tab-color": "#444444",
	}),
	DarkColored: new Theme("Dark Colored", {
		"background-color": "#222222",
		"background-color2": "#333333",

		"content-color": "#EEEEEE",
		"content-color2": black,
		"link-color": rgb(90, 110, 180),

		color1: rgb(255, 119, 7),
		color2: rgb(139, 119, 7),
		color3: rgb(110, 120, 100),
		color4: rgb(75, 100, 111),

		"tab-color": rgba(7, 74, 138, 0.5),
		"active-tab-color": rgba(7, 74, 138, 0.8),
	}),
};

const applyTheme = (theme) => {
	// Get document stylesheet
	const styles = document?.documentElement?.style;
	if (!styles || styles === undefined) {
		return null;
	}

	// Loop through theme keys and apply to page
	for (const [key, value] of Object.entries(theme)) {
		styles.setProperty(key, value, "important");
	}

	// Log the change
	console.log("Applied theme:", theme);
};
