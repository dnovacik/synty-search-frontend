import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
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