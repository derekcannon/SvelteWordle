import { emojizeScores } from "./emojizeScores";

describe("emojizeScores", () => {
	describe("all types of matches", () => {
		it("returns combination of green, yellow, and black boxes", () => {
			const scores = [
				[0, 0],
				[0, 1],
				[0, 2],
				[1, 0],
				[1, 1],
				[1, 2],
				[2, 0],
				[2, 1],
				[2, 2],
			];

			expect(emojizeScores(scores)).toEqual(
				"⬛⬛\r" +
					"⬛🟨\r" +
					"⬛🟩\r" +
					"🟨⬛\r" +
					"🟨🟨\r" +
					"🟨🟩\r" +
					"🟩⬛\r" +
					"🟩🟨\r" +
					"🟩🟩",
			);
		});
	});
});
