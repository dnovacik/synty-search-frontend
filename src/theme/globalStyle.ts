import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    background-color: #000;
    border-radius: 50px;
  }

  @keyframes rotateY {
    to {
      transform: rotateY(360deg);
    }
  }

  .fade-enter {
    opacity: 0;
  }
  
  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  
  .fade-exit {
    opacity: 1;
  }
  
  .fade-exit.fade-exit-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
  }
  
  .item-enter {
    opacity: 0;
  }
  
  .item-enter.item-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  
  .item-exit {
    opacity: 1;
  }
  
  .item-exit-active.item-exit-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
  }
  
`