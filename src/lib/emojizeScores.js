export function emojizeScores(scores, guesses = []) {
	return scores.map((score, index) => emojizeScore(score, guesses[index]?.join(""))).join("\r");
}

function emojizeScore(score, guess) {
	const emojis = score.map((value) => {
		switch (value) {
			case 0:
				return "⬛";
			case 1:
				return "🟨";
			case 2:
				return "🟩";
		}
	});

	return emojis.join("") + (guess ? ` ${guess}` : "");
}
