export function copyToClipboard(string) {
	if (navigator?.clipboard) {
		return navigator.clipboard.writeText(string);
	} else {
		return new Promise(function (resolve, reject) {
			const result = iOSClipboardHack(string);
			return result ? resolve() : reject();
		});
	}
}

// https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
function iOSClipboardHack(string) {
	let textarea;
	let result;

	try {
		textarea = document.createElement("textarea");
		textarea.setAttribute("readonly", true);
		textarea.setAttribute("contenteditable", true);
		textarea.style.position = "fixed"; // prevent scroll from jumping to the bottom when focus is set.
		textarea.value = string;

		document.body.appendChild(textarea);

		textarea.focus();
		textarea.select();

		const range = document.createRange();
		range.selectNodeContents(textarea);

		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);

		textarea.setSelectionRange(0, textarea.value.length);
		result = document.execCommand("copy");
	} catch (err) {
		result = false;
	} finally {
		document.body.removeChild(textarea);
	}

	return result;
}
