import styled, { css } from "styled-components";

export default styled.div<{ textTrans?: boolean; }>`
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  border: solid;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  margin-left: 0.125rem;
  margin-right: 0.125rem;
  font-weight: bold;
  border-radius: 0.25rem;
  background-color: white;
  border-color: #e2e8f0;

  ${(props) => css`
    font-size: ${props.textTrans ? "0" : "1.5"}rem;
  `}

  &.correct {
    color: white;
    background-color: rgb(34, 197, 94);
    border-color: rgb(25, 179, 81);
  }

  &.wrong {
    color: white;
    background-color: rgb(234, 179, 8);
    border-color: rgb(204, 153, 0);
  }

  &.incorrect {
    color: white;
    background-color: rgb(148, 163, 184);
    border-color: rgb(128, 144, 167);
  }

  &.input {
    animation: CharCell 100ms forwards;
    background-color: white;
    border-color: black;

    @keyframes CharCell {
      from {
        transform: scale(1.1);
      }

      to {
        transform: scale(1);
      }
    }
  }
`;
