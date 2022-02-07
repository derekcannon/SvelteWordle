import { evaluateScore } from "./evaluateScore";

describe("evaluateScore", () => {
	describe("no matches", () => {
		it("returns array of zeros", () => {
			const guess = ["x", "y", "z"];
			const answer = ["a", "b", "c"];

			expect(evaluateScore(guess, answer)).toEqual([0, 0, 0]);
		});
	});

	describe("letters match but positions doesn't", () => {
		it("returns array of ones", () => {
			const guess = ["c", "a", "b"];
			const answer = ["a", "b", "c"];

			expect(evaluateScore(guess, answer)).toEqual([1, 1, 1]);
		});
	});

	describe("letters and positions match", () => {
		it("returns array of twos", () => {
			const guess = ["a", "b", "c"];
			const answer = ["a", "b", "c"];

			expect(evaluateScore(guess, answer)).toEqual([2, 2, 2]);
		});
	});

	describe("multiple match types", () => {
		it("returns array of mixed match values", () => {
			const guess = ["a", "x", "b"];
			const answer = ["a", "b", "c"];

			expect(evaluateScore(guess, answer)).toEqual([2, 0, 1]);
		});
	});

	describe("multiple types of same-letter matches", () => {
		it("returns array of appropriate matches", () => {
			const guess = ["x", "a", "a"];
			const answer = ["a", "a", "b"];

			expect(evaluateScore(guess, answer)).toEqual([0, 2, 1]);
		});
	});
});
