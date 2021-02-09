// Variable for shortcuts
const shortcuts = {
	active: [],
}

// Variable for currently held keys
var global = {
	keys: {
		Alt: false,
		Meta: false,
		Shift: false,
		Control: false,
		other: "",
	}
}

// Make new shortcut
function registerShortcut(shortcut, action, type) {
	if (!type) {presstype = "up"} else {presstype = type};

	let keys = shortcut.split("+");

	for (let i = 0; i < keys.length; i++) {
		switch(keys[i].toLowerCase()) {
			case "ctrl":
			case "control":
				keys[i] = "Control";
				break;
			case "cmd":
			case "mod4":
			case "meta":
			case "super":
			case "command":
			case "windows":
				keys[i] = "Meta";
				break;
			case "shift":
				keys[i] = "shift";
				break;
			case "alt":
			case "option":
				keys[i] = "alt";
				break;
		}
	}

	console.log("setting shortcut: " + keys.join("+"))
	let length = shortcuts.active.length;

	shortcuts.active[length] = {
		shortcut: keys,
		action: action,
		type: presstype,
	}	
}

// Change keys in global.active
function setHeld(key, state) {
	let modifier = false;

	switch(key) {
		case "Control":
		case "Shift":
		case "Meta":
		case "Alt":
			modifier = true;
			break;
	}
	
	if (!modifier) {
		if (state) {
			global.keys.other += key;
		} else {
			global.keys.other = global.keys.other.replace(new RegExp(key, "g"), "")
		}
	} else {
		if (eval(`global.keys.${key}`) != undefined) {
			eval(`global.keys.${key} = ${state}`)
		}	
	}
}

// Compares active keys and all registered shortcuts to see if any are supposed to run
function checkShortcut() {
	for (let i = 0; i < shortcuts.active.length; i++) {
		let passed = true;

		for (let ii = 0; ii < shortcuts.active[i].shortcut.length; ii++) {
			let key = shortcuts.active[i].shortcut[ii]

			switch(key) {
				case "Control":
					if (global.keys.Control == false) {passed = false;continue;}
					break;
				case "Shift":
					if (global.keys.Shift == false) {passed = false;continue;}
					break;
				case "Meta":
					if (global.keys.Meta == false) {passed = false;continue;}
					break;
				case "Alt":
					if (global.keys.Alt == false) {passed = false;continue;}
					break;
				default:
					if (global.keys.other.includes(key) != true) {passed = false;}
			}
		}

		if (passed) {
			eval(shortcuts.active[i].action)
		}
	}
}

document.body.addEventListener("keydown", (e) => {
	setHeld(e.key, true)
})

document.body.addEventListener("keyup", (e) => {
	checkShortcut()

	console.log(global.keys)
	setHeld(e.key, false)
})

