import { createGlobalStyle } from "styled-components";

export const ReportGlobalStyles = createGlobalStyle`
* {
  font-family: sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background);
}

.container {
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.025);
  border-radius: 10px;
  padding: 2rem;
}

.container h1 {
  text-align: center;
  color: var(--primary);
}

h2 {
    margin: 0;
    padding: 0;
    color: #202020;
}
`;
