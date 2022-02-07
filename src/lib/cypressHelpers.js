export function setTestVariable(name, value) {
	if (window.Cypress) {
		if (!window.__testing__) window.__testing__ = {};
		window.__testing__[name] = value;
	}
}

export function getTestVariable(name, defaultValue) {
	if (!window.Cypress) return defaultValue;
	const testValue = window.__testing__[name];
	if (testValue === undefined) return defaultValue;

	if (Array.isArray(testValue)) {
		return testValue.shift();
	} else {
		return window.__testing__[name];
	}
}
