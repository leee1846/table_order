import { css } from '@emotion/react';

export const resetStyles = css`
  /* Modern CSS Reset */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    min-height: 100vh;
    line-height: 1.5;
    text-rendering: optimizeSpeed;
  }

  /* Remove default list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Make images easier to work with */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Remove button styles */
  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  /* Remove link styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Improve text wrapping */
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  /* Remove default form element styles */
  input,
  textarea,
  select {
    border: none;
    outline: none;
  }

  /* Improve table styles */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`;
