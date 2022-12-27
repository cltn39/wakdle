import { Component } from "react";
import styled, { css } from "styled-components";
import { toast } from "react-toastify";
import hangul from "hangul-js";

import words from "./util/words";
import InputCol from "./util/input-col";
import findSimilar, { Result } from "./util/find-similar";
import keyboard, { ssang } from "./util/keyboard";
import statText from "./util/stat-text";
import wordMerge from "./util/word-merge";
import wordSplit from "./util/word-split";
import { consonantToDefault, vowel, vowelToDefault } from "./util/shift-word";

interface S {
  board: string[][];
  status: number[][];
  similar: Result[];
  tries: number[];
  currentY: number;
  answer: string;
  modal: boolean;
  type: "whatisit" | "similar" | "howtoplay" | "setting" | "stats";
  linkShare: boolean;
  emptyShow: boolean;
  textTrans: boolean;
  gameStatus: "ing" | "end";
  shift: boolean;
}

export const HEIGHT = 6;
export const APP_NAME = "왁들";

const Container = styled.div`
  max-width: 80rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
`;

const Waktle = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  flex-grow: 1;
`;

const Icon = styled.svg`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`;

const InputContainer = styled.div`
  padding-bottom: 1.5rem;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.25rem;
`;

const KeyboardContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.25rem;

  button {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    font-size: 1.2rem;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
`;

const Components = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;

const Button = styled.button<{ active?: boolean; marginTop?: boolean; }>`
  background-color: var(--waktaverse);
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;
  outline: none;
  border: none;

  ${(props) => css`
    margin-top: ${props.marginTop ? "1.2" : "0"}rem;
  `}

  &.key {
    background-color: #d1d1d1;

    ${(props) => css`
      background-color: ${props.active ? "var(--hwaktaverse)" : "#d1d1d1"};
    `}
  }

  &:foucs {
    outline: none;
  }

  &:hover {
    background-color: var(--hwaktaverse);
  }

`;

const ModalBackdrop = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  inset: 0;
  z-index: 50;

  &:focus {
    outline: none;
  }
`;

const ModalAwning = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgb(107, 114, 128);
  opacity: 0;
  animation: ShowAwning 500ms forwards;

  @keyframes ShowAwning {
    from {
      opacity: 0;
    }

    to {
      opacity: 0.75;
    }
  }
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 28rem;
  background-color: white;
  border-radius: 0.5rem;
  text-align: center;
  padding: 2rem;
  z-index: 50;
  animation: ShowContent 200ms forwards;

  @keyframes ShowContent {
    from {
      transform: scale(0.85);
    }

    to {
      transform: scale(1);
    }
  }
`;

const ModalClose = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.div`
  margin-top: 0.5rem;
`;

const StatTry = styled.h4`
  color: rgb(17, 24, 39);
  font-size: 1.5rem;
  font-weight: 500;
`;

const Link = styled.a`
  color: inherit;
  text-decoration: underline;
  font-weight: bold;
`;

const Desc = styled.p<{ active?: boolean; marginBottom?: boolean; }>`
  color: #6b6b6b;
  font-size: 12pt;
  ${(props) => css`
    ${props.active && "background-color: #c5c7ff; font-weight: bold;"}
    margin-bottom: ${props.marginBottom ? "1.2" : "0"}rem;
  `}
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
`;

const OptionTitle = styled.div`
  text-align: left;
  margin-top: 0.5rem;
`;

const OptionSlider = styled.div<{ open: boolean; }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  border-radius: 9999px;
  background-color: rgb(209, 213, 219);
  transition: 0.3s;
  padding: 0.25rem;
  width: 3.5rem;
  height: 2rem;

  ${(props) => css`
    background-color: ${props.open ? "rgb(74, 222, 128)" : "rgb(209, 213, 219)"};

    div {
      transform: translateX(${props.open ? "1.5rem" : "0"});
    }
  `}
`;

const OptionSliderValue = styled.div`
  background-color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: 0.5s;
`;

const TryContainer = styled.div`
  column-count: 1;
  justify-content: left;
  margin: 0.5rem;
  font-size: 0.875rem;
`;

const TryBox = styled.div`
  display: flex;
  justify-content: left;
  margin: 0.25rem;
`;

const TryBoxTitle = styled.div`
  align-items: center;
  justify-content: center;
  width: 0.5rem;
`;

const TryBoxProgressBackground = styled.div`
  width: 100%;
  margin-left: 0.5rem;
`;

const TryBoxProgressValue = styled.div<{ width: number; }>`
  white-space: nowrap;
  color: rgb(219, 234, 254);
  font-weight: 500;
  font-size: 0.75rem;
  text-align: center;
  padding: 0.125rem;
  background-color: rgb(37, 99, 235);

  ${(props) => css`
    width: ${props.width}%;
    color: ${Math.floor(props.width) === 0 ? "black" : "rgb(219, 234, 254)"};
    ${props.width < 100 && "border-top-left-radius: 9999px; border-bottom-left-radius: 9999px;"}
    ${props.width === 100 && "border-radius: 9999px;"}
  `}
`;

export default class Home extends Component<{}, S> {
  constructor(props: {}) {
    super(props);

    const answer = words[Math.floor(Math.random() * words.length)];
    const split = wordSplit(answer);
    let board = [];
    let status = [];
    let tries = [];

    for (let y = 0; y < HEIGHT; y++) {
      let brows = []; // board용
      let srows = []; // status용
      for (let x = 0; x < split.length; x++) {
        brows.push('');
        srows.push(0);
      }

      board.push(brows);
      status.push(srows);
      tries.push(0);
    }
    
    this.state = {
      board,
      status,
      similar: findSimilar(answer),
      tries,
      currentY: 0,
      answer,
      modal: true,
      type: "whatisit",
      linkShare: true,
      emptyShow: true,
      textTrans: false,
      gameStatus: "ing",
      shift: false
    }
  }

  componentDidMount() {
    window.addEventListener("inputEvent", (event) => {
      const { detail }: CustomEventInit<{ input: string; shift: boolean; }> = event;
      if (detail) {
        const press = detail.input;
        if (!['', "Shift"].includes(press)) this.inputCell(press);
        this.setState({ shift: press === "Shift" || detail.shift });
      }
    });
    window.addEventListener("closeModal", () => {
      this.setState({ modal: false });
    });
  }

  inputCell(press: string) {
    if (this.state.gameStatus === "end") return;

    const currentX = this.state.board[this.state.currentY].findIndex(v => v === '');
    this.setState({
      board: this.state.board.map((row, y) => {
        row.forEach((_, x) => {
          if (x === currentX && y === this.state.currentY && press !== "Shift") {
            if (press === "삭제") {
              row[x-1] = '';
              this.count();
              this.state.status[y][x-1] = 0;
            }
            else if (press !== "입력") {
              if (hangul.isConsonant(press) && this.state.shift && Object.keys(consonantToDefault).includes(press)) {
                row[x] = press;
                row[x+1] = press;  
                this.state.status[y][x+1] = 4;
              } else if (hangul.isVowel(press) && this.state.shift && Object.keys(vowelToDefault).includes(press)) {
                row[x] = vowelToDefault[press as vowel];
              } else {
                row[x] = press;
              }

              this.state.status[y][x] = 4;
            }
          }
        });
        if (press === "삭제" && currentX === -1 && y === this.state.currentY) {
          this.count();
          row[this.state.board[0].length-1] = '';
          this.state.status[this.state.currentY][this.state.board[0].length-1] = 0;
        }

        return row;
      })
    });

    if (press === "Shift") {
      this.setState({ shift: !this.state.shift });
    }

    if (press === "입력") {
      if (this.state.board[this.state.currentY].findIndex(col => col === '') !== -1) {
        toast("모든 칸이 채워져 있지 않습니다.", {
          type: "error",
          autoClose: 1500
        });
        return;
      }
      const word = wordMerge(this.state.board[this.state.currentY]);
      if (!hangul.isCompleteAll(word)) {
        toast("완성된 단어가 아닙니다.", {
          type: "error",
          autoClose: 1500
        });
        return;
      }

      this.check();
      if (this.state.status[this.state.currentY]?.every(v => v === 1)) {
        toast("맞혔습니다.", {
          type: "success",
          autoClose: 1500
        });
        this.setState({ gameStatus: "end", modal: true, type: "stats" });
        return;
      } else {
        toast("틀렸습니다.", {
          type: "error",
          autoClose: 1500
        });
        return;
      }
    }
  }

  check() {
    const split = wordSplit(this.state.answer);
    this.setState({
      status: this.state.status.map((st, i) => {
        if (this.state.currentY === i) {
          st.map((_, j) => {
            const currentInput = this.state.board[i][j];
            for (let idx = 0; idx < split.length; idx++) {
              if (idx === j) {
                if (currentInput === split[idx]) st[j] = 1;
                else if (split.includes(currentInput)) st[j] = 2;
                else st[j] = 3;
              }
            }
          });
        }
        return st;
      }),
      currentY: this.state.currentY+1
    }, () => {
      if (!this.state.status.some(v=>v.some(c=>c===0))) {
        toast("기회를 다 썼어요.", {
          type: "error",
          autoClose: 1500
        });
        this.setState({ gameStatus: "end", modal: true, type: "stats" });
        return;
      }
    });
  }

  count() {
    this.setState({
      tries: this.state.tries.map((tr, idx) => {
        if (idx === this.state.currentY) {
          tr++;
        }

        return tr;
      })
    });
  }

  getClassname(val: number) {
    switch (val) {
      case 0:
        return '';
      case 1:
        return "correct";
      case 2:
        return "wrong";
      case 3:
        return "incorrect";
      case 4:
        return "input";
    }
  }

  render() {
    return (
      <Container>
        <Title>
            <Waktle>{APP_NAME} - 한국어</Waktle>
            <Icon onClick={() => this.setState({ modal: true, type: "similar" })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </Icon>
            <Icon onClick={() => this.setState({ modal: true, type: "setting" })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </Icon>
            <Icon onClick={() => this.setState({ modal: true, type: "howtoplay" })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </Icon>
            <Icon onClick={() => this.setState({ modal: true, type: "stats" })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </Icon>
        </Title>
        <InputContainer>
          {this.state.board.map((row, i) => <InputRow key={i}>
            {row.map((col, j) => <InputCol textTrans={this.state.gameStatus === "end" && this.state.textTrans} className={this.getClassname(this.state.status[i][j])} key={j}>{col}</InputCol>)}
          </InputRow>)}
        </InputContainer>
        <KeyboardContainer>
          {(this.state.shift ? ssang : keyboard).map((keys, i) => (
            <KeyboardRow key={i}>
              {keys.map((key, j) => <Button className="key" active={this.state.shift && key === "Shift"} id={key} onClick={() => {
                const press = keyboard[i][j];
                this.inputCell(press);
              }} key={key}>{key}</Button>)}
            </KeyboardRow>
          ))}
        </KeyboardContainer>
        <FooterContainer>
          <Components>
            <Button onClick={() => this.setState({ modal: true, type: "whatisit" })}>이 놀이는?</Button>
            <Button onClick={() => location.reload()}>다시하기</Button>
          </Components>
        </FooterContainer>
        {this.state.modal && <ModalBackdrop>
          <ModalContent>
            <ModalClose onClick={() => this.setState({ modal: false })}>
              <Icon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </Icon>
            </ModalClose>
            <ModalTitle>
              {
                this.state.type === "howtoplay"
                ? "어떻게 할까?"
                : this.state.type === "whatisit"
                ? "이 놀이는?"
                : this.state.type === "setting"
                ? "설정"
                : this.state.type === "stats"
                ? "통계"
                : this.state.type === "similar"
                ? "관련된 단어"
                : "(?)"
              }
            </ModalTitle>
            <ModalDescription>
              {
                this.state.type === "whatisit"
                ? <>
                  <Desc>이 놀이는 <Link href="https://kordle.kr/" tab-index="0">꼬들</Link>을 참조하여 만든 것입니다. "왁들"의 어휘들은 왁타버스 멤버 / 밈 중 적절하게 사용할 만한 것들로 가져왔습니다. 또한 원 놀이를 <Link href="https://www.powerlanguage.co.uk/wordle/">여기</Link>서 해 볼 수 있습니다. "왁들"은 사이트를 새로고침하면 단어가 초기화되며 몇번이고 재도전할 수 있습니다.</Desc>
                  <br />
                  <Link href="https://wak-higher-lower.vercel.app">더 많이 더 적게 해보기</Link>
                </>
                : this.state.type === "howtoplay"
                ? <>
                  <Desc marginBottom={true}>왁타버스 관련 키워드를 자모로 풀어쓴 한글 단어 "왁들"을 여섯 번의 도전 안에 맞춰봅시다. 한글 단어를 풀어쓴 후 <b>입력</b>을 누르면 칸 색깔이 변합니다!</Desc>
                  <InputRow>
                    <InputCol className="correct">ㄱ</InputCol>
                    <InputCol>ㅠ</InputCol>
                  </InputRow>
                  <Desc marginBottom={true}>자음 'ㄱ'은 올바른 자리에 있습니다.</Desc>
                  <InputRow>
                    <InputCol>ㅇ</InputCol>
                    <InputCol className="wrong">ㅗ</InputCol>
                  </InputRow>
                  <Desc marginBottom={true}>모음 'ㅗ'는 포함되지만 잘못된 자리에 있습니다.</Desc>
                  <InputRow>
                    <InputCol>ㅇ</InputCol>
                    <InputCol>ㅗ</InputCol>
                    <InputCol>ㅇ</InputCol>
                    <InputCol className="incorrect">ㅣ</InputCol>
                  </InputRow>
                  <Desc marginBottom={true}>모음 'ㅣ'는 어느 곳에도 맞지 않습니다.</Desc>
                  <InputRow>
                    <InputCol>ㄷ</InputCol>
                    <InputCol>ㄷ</InputCol>
                    <InputCol>ㅏ</InputCol>
                    <InputCol>ㄹ</InputCol>
                  </InputRow>
                  <Desc marginBottom={true}>연속된 자음 'ㄷ'은 자음 'ㄸ'을 의미합니다.</Desc>
                  <Desc>자음 병서는 그 자음을 2번 연속 입력하시고 모음은 Shift 키를 누른 후 입력하셔야 합니다.</Desc>
                </>
                : this.state.type === "setting"
                ? <>
                  <OptionContainer>
                    <OptionTitle>
                      <p>링크 표기</p>
                      <Desc>웹사이트 링크를 결과에 표기합니다.</Desc>
                    </OptionTitle>
                    <OptionSlider open={this.state.linkShare}>
                      <OptionSliderValue onClick={() => this.setState({ linkShare: !this.state.linkShare })} />
                    </OptionSlider>
                  </OptionContainer>
                  <OptionContainer>
                    <OptionTitle>
                      <p>빈 부분 포함하기</p>
                      <Desc>결과에 빈 부분을 표기합니다.</Desc>
                    </OptionTitle>
                    <OptionSlider open={this.state.emptyShow}>
                      <OptionSliderValue onClick={() => this.setState({ emptyShow: !this.state.emptyShow })} />
                    </OptionSlider>
                  </OptionContainer>
                  <OptionContainer>
                    <OptionTitle>
                      <p>사진 찍기</p>
                      <Desc>글자를 투명하게 만듭니다.</Desc>
                    </OptionTitle>
                    <OptionSlider open={this.state.textTrans}>
                      <OptionSliderValue onClick={() => this.setState({ textTrans: !this.state.textTrans })} />
                    </OptionSlider>
                  </OptionContainer>
                </>
                : this.state.type === "stats"
                ? <>
                  <StatTry>도전 분포</StatTry>
                  <TryContainer>
                    {this.state.tries.map((tr, i) => <TryBox key={i}>
                      <TryBoxTitle>{i+1}</TryBoxTitle>
                      <TryBoxProgressBackground>
                        <TryBoxProgressValue width={(tr/(this.state.tries.reduce((a, b) => a + b) || 1)) * 100}>{tr}번 고침</TryBoxProgressValue>
                      </TryBoxProgressBackground>
                    </TryBox>)}
                  </TryContainer>
                  <Desc>"왁들"은 사이트를 새로고침하면 단어는 초기화되며 다시 할수 있습니다.</Desc>
                  <Components>
                    {this.state.gameStatus === "end" && <Button marginTop={true} onClick={() => navigator.clipboard.writeText(statText(this.state.status, this.state.linkShare, this.state.emptyShow))}>결과 복사하기</Button>}
                    <Button marginTop={true} onClick={() => location.reload()}>다시하기</Button>
                  </Components>
                </>
                : this.state.type === "similar"
                ? <>
                  <Desc>유사도가 높은 것끼리 모아두었지만 유사도가 높은 순으로 정렬되어 있지 않고 무작위로 순서가 섞여 있습니다. 물론, 이 중에서 정답도 있습니다.</Desc>
                  <br />
                  {this.state.similar.map((similar, idx) => <Desc active={this.state.gameStatus === "end" && this.state.answer === similar.word} key={idx}>{similar.word}</Desc>)}
                </>
                : "(?)"
              }
            </ModalDescription>
          </ModalContent>
          <ModalAwning />
        </ModalBackdrop>}
      </Container>
    )
  }
}
