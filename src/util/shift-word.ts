export type consonantSsang = 'ㄲ' | 'ㄸ' | 'ㅃ' | 'ㅆ' | 'ㅉ';
export type consonantDefault = 'ㄱ' | 'ㄷ' | 'ㅂ' | 'ㅅ' | 'ㅈ';
export type vowel = 'ㅐ' | 'ㅔ';

export const consonantToSSang = {
  'ㄲ': 'ㄱ',
  'ㄸ': 'ㄷ',
  'ㅃ': 'ㅂ',
  'ㅆ': 'ㅅ',
  'ㅉ': 'ㅈ',
};

export const consonantToDefault = {
  'ㄱ': 'ㄲ',
  'ㄷ': 'ㄸ',
  'ㅂ': 'ㅃ',
  'ㅅ': 'ㅆ',
  'ㅈ': 'ㅉ'
}

export const vowelToDefault = {
  'ㅐ': 'ㅒ',
  'ㅔ': 'ㅖ'
}