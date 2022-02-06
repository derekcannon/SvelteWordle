function waitForAppLoad() {
	return cy.window().its("__SvelteWordle__.isLoaded").should("be.true");
}

function setAnswer(answer) {
	Cypress.on("window:before:load", (win) => {
		win.answer = answer;
	});
}

function tapGuess(guess, { enter = false }) {
	guess.forEach((guess) => {
		cy.get("button").contains(guess).click();
	});

	if (enter) cy.get("button").contains("↵").click();
}

describe("winning", () => {
	it("sets letters to green and shows displays winning text", () => {
		const answer = "derek";
		setAnswer(answer);

		cy.visit("/");
		waitForAppLoad();

		cy.get(".wordContainer").should("have.text", "     ");

		tapGuess(answer.split(""), { enter: true });

		cy.get(".wordContainer").should(($div) => {
			expect($div.text().replaceAll(" ", "")).equal("derek");
		});

		cy.getTest("hasWon")
			.invoke("text")
			.should("match", /you win/i);

		cy.getTest("hasWon")
			.get("button")
			.invoke("text")
			.should("match", /play again/i);
	});
});
