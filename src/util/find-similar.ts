import words from "./words";
import wordSplit from "./word-split";

export interface Result {
  similarity: number;
  word: string;
}

export default function(answer: string): Result[] {
  const split = wordSplit(answer);
  let result: Result[] = [];

  words.filter(word => Math.abs(wordSplit(word).length - split.length) < 6).forEach(word => {
    let similarity = 0;
    const s = wordSplit(word).length;

    if (s < split.length) similarity = s / split.length;
    else if (s > split.length) similarity = split.length / s;
    else if (word !== answer) similarity = (split.length / s) * 0.7;
    else similarity = 1;

    result.push({ similarity, word });
  });

  return result.sort((a, b) => b.similarity - a.similarity).slice(0, 15).sort(() => Math.random() - 0.5);
}