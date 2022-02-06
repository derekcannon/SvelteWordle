Cypress.Commands.add("getTest", (selector, ...args) => {
	cy.get(`[data-test="${selector}"]`, ...args);
});
