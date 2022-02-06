export function evaluateScore(guess, answer) {
	const answerCopy = [...answer];
	let guessCopy = [...guess];

	// score letter and position (exact) matches first
	const score = answerCopy.map((answerLetter, index) => {
		const guessLetter = guessCopy[index];
		if (answerLetter === guessLetter) {
			answerCopy[index] = null;
			return 2;
		}
		return null;
	});

	// score remaining matches (letter-only matches)
	return score.map((value, index) => {
		if (value) return value;

		const guessLetter = guessCopy[index];
		const guessAnswerIndex = answerCopy.findIndex((answerLetter) => answerLetter === guessLetter);

		if (~guessAnswerIndex) {
			answerCopy[guessAnswerIndex] = null;
			return 1;
		}

		return 0;
	});
}
