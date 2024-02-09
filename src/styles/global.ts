import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;
