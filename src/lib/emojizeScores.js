export function emojizeScores(scores) {
	return scores.map(emojizeScore).join("\r");
}

function emojizeScore(score) {
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

	return emojis.join("");
}
