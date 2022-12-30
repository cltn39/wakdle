import hangul from "hangul-js";
import { consonantToSSang } from "./shift-word";

type indiv = 'ㄲ' | 'ㄸ' | 'ㅃ' | 'ㅆ' | 'ㅉ';

const individually = {
  'ㄲ': 'ㄱ',
  'ㄸ': 'ㄷ',
  'ㅃ': 'ㅂ',
  'ㅆ': 'ㅅ',
  'ㅉ': 'ㅈ'
};

export default function (word: string) {
  let result = hangul.disassemble(word);
  
  for (let i = 0; i < result.length; i++) {
    if (Object.keys(individually).includes(result[i])) {
      const consonant = consonantToSSang[result[i] as indiv];
      result[i] = consonant;
      result.splice(i+1, 0, consonant);
    }
  }

  return result;
}
