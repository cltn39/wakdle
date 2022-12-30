import hangul from "hangul-js";
import remove from "./remove";
import { consonantToDefault } from "./shift-word";

type indiv = 'ㄱ' | 'ㄷ' | 'ㅂ' | 'ㅅ' | 'ㅈ';

export default function (line: string[]) {
  const result = [];
  for (let i = 0; i < line.length; i++) {
    if (!line[i]) continue;

    // 자음 병서 처리
    if (line[i] === line[i+1] && Object.keys(consonantToDefault).includes(line[i])) {
      result.push(consonantToDefault[line[i] as indiv]);
      line = remove(line, i+1);
      continue;
    }
    if (line[i+1] !== undefined) {
      const assemble = hangul.assemble([line[i], line[i+1]]);
      if (hangul.isConsonant(line[i]) && hangul.isConsonant(line[i+1]) && !hangul.isVowel(line[i+2]) && assemble.length === 1) {
        result.push(assemble);
        line = remove(line, i+1);
        continue;
      }

      // 모음 처리
      if (hangul.isVowel(line[i]) && hangul.isVowel(line[i+1]) && assemble.length === 1) {
        result.push(assemble);
        line = remove(line, i+1);
        continue;
      }
    }

    result.push(line[i]);
  }

  return hangul.assemble(result);
}
