const inko = new Inko();

const individually = {
  'ㄲ': 'ㄱ',
  'ㄸ': 'ㄷ',
  'ㅃ': 'ㅂ',
  'ㅆ': 'ㅅ',
  'ㅉ': 'ㅈ'
};
let shift = false;

document.addEventListener("keydown", (event) => {
  const { key } = event;
  console.log(key);

  if ((inko.en2ko(key).match(/[ㄱ-ㅎ|ㅏ-ㅣ]/) && key.length === 1) || ["Backspace", "Enter", "Shift"].includes(key)) {
    let press = inko.en2ko(key);
    // 각자 병서 분리 (ㄲ > ㄱ)
    if (Object.keys(individually).includes(press)) {
      press = individually[press];
    }
    if (key === "Backspace") {
      press = "삭제"
    }
    if (key === "Enter") {
      press = "입력"
    }
    if (key === "Shift" || event.shiftKey) {
      press = '';
      shift = !shift;
    }

    window.dispatchEvent(new CustomEvent("inputEvent", {
      detail: {
        input: press,
        shift
      },
      bubbles: true,
      cancelable: true
    }));
  }
  if (key === "Escape") {
    window.dispatchEvent(new CustomEvent("closeModal", {
      detail: {},
      bubbles: true,
      cancelable: true
    }));
  }
});
