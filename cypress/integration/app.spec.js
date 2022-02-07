function waitForAppLoad() {
	return cy.window().its("__testing__.isLoaded").should("be.true");
}

function setAnswer(answer) {
	Cypress.on("window:before:load", (win) => {
		win.__testing__ = {
			answer: answer,
		};
	});
}

function tapGuess(guess, enter = false) {
	const formattedGuess = typeof guess === "string" ? guess.split("") : guess;

	formattedGuess.forEach((guess) => {
		cy.get("button").contains(guess).click();
	});

	if (enter) cy.get("button").contains("↵").click();
}

it("player can lose and replay and win", () => {
	let answer = ["sonic", "tails"];
	setAnswer(answer);

	cy.visit("/");
	waitForAppLoad();

	cy.get(".WordRow.row-0").should("not.have.text");

	tapGuess(answer[0]);
	cy.get(".canGuess").should("be.visible");

	// test delete functionality
	cy.get("button").contains("⌫").click().click();
	tapGuess("ek", { enter: true });
	cy.get(".WordRow.row-0").within(() => {
		cy.get(".letter").should("have.text", "sonek");
	});

	tapGuess("sonik", { enter: true });
	tapGuess("soniq", { enter: true });
	tapGuess("soneq", { enter: true });
	tapGuess("sanic", { enter: true });
	tapGuess("tails", { enter: true });

	// test losing end results
	cy.get(".canGuess").should("not.exist");
	cy.get(".hasWon").should("not.exist");
	cy.get(".hasLost").contains(answer[0]);
	cy.get(".resetButton").should("exist");

	// ensure typing/deleting after game over doesn't work
	cy.get("button").contains("⌫").click();
	tapGuess("z");
	cy.get(".WordRow.row-5").find(".letter").should("have.text", "tails");
	cy.get(".WordRow.row-6").should("not.exist");

	// ensure player can play again
	tapGuess([], { enter: true });

	// test keyboard resets
	cy.get(".keyRow").within(() => {
		cy.get("button.exactMatchLetter").should("not.exist");
		cy.get("button.partialMatchLetter").should("not.exist");
		cy.get("button.noMatchLetter").should("not.exist");
	});

	tapGuess(answer[1], { enter: true });

	// test keyboard
	cy.get(".keyRow").within(() => {
		cy.get("button.exactMatchLetter").should("have.text", "tiasl");
		cy.get("button.partialMatchLetter").should("not.exist");
		cy.get("button.noMatchLetter").should("not.exist");
	});

	// test winning end results
	cy.get(".canGuess").should("not.exist");
	cy.get(".hasLost").should("not.exist");
	cy.get(".hasWon").should("be.visible");
	cy.get(".resetButton").should("exist");
});

it("player receives guess and keyboard hints, and can win", () => {
	const answer = "derek";
	setAnswer(answer);

	cy.visit("/");
	waitForAppLoad();

	cy.get(".WordRow.row-0").should("not.have.text");

	// ************************
	// ******* GUESS #1 *******
	// ************************
	tapGuess("dexxx", { enter: true });

	// test guess letters
	cy.get(".WordRow.row-0").within(() => {
		cy.get(".letter").should("have.text", "dexxx");
		cy.get(".LetterBox.box-0").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-1").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-2").should("have.class", "noMatchLetter");
		cy.get(".LetterBox.box-3").should("have.class", "noMatchLetter");
		cy.get(".LetterBox.box-4").should("have.class", "noMatchLetter");
	});

	// test keyboard
	cy.get(".keyRow").within(() => {
		cy.get("button.exactMatchLetter").should("have.text", "ed");
		cy.get("button.noMatchLetter").should("have.text", "x");
	});

	// ************************
	// ******* GUESS #2 *******
	// ************************
	tapGuess("deekx", { enter: true });

	// test guess letters
	cy.get(".WordRow.row-1").within(() => {
		cy.get(".letter").should("have.text", "deekx");
		cy.get(".LetterBox.box-0").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-1").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-2").should("have.class", "partialMatchLetter");
		cy.get(".LetterBox.box-3").should("have.class", "partialMatchLetter");
		cy.get(".LetterBox.box-4").should("have.class", "noMatchLetter");
	});

	// test keyboard
	cy.get(".keyRow").within(() => {
		cy.get("button.exactMatchLetter").should("have.text", "ed");
		cy.get("button.partialMatchLetter").should("have.text", "k");
		cy.get("button.noMatchLetter").should("have.text", "x");
	});

	// ************************
	// ******* GUESS #3 *******
	// ************************
	tapGuess("derek", { enter: true });

	// test guess letters
	cy.get(".WordRow.row-2").within(() => {
		cy.get(".letter").should("have.text", answer);
		cy.get(".LetterBox.box-0").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-1").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-2").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-3").should("have.class", "exactMatchLetter");
		cy.get(".LetterBox.box-4").should("have.class", "exactMatchLetter");
	});

	// test keyboard
	cy.get(".keyRow").within(() => {
		cy.get("button.exactMatchLetter").should("have.text", "erdk");
		cy.get("button.partialMatchLetter").should("not.exist");
		cy.get("button.noMatchLetter").should("have.text", "x");
	});

	// test winning end results
	cy.get(".canGuess").should("not.exist");
	cy.get(".hasLost").should("not.exist");
	cy.get(".hasWon").should("be.visible");
	cy.get(".resetButton").should("exist");
});
