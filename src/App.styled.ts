import styled, {css, keyframes} from 'styled-components';

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;

export const ErrorContent = styled(Content)`
  animation: ${fadein} 0.4s;
  position: fixed;
  z-index: 10;
  padding: 10%;
  background: white;
  p {
    font-size: 64px;
    @media (max-width: 750px) {
      font-size: 32px;
    }
  }
`;

export const FeaturedImage = styled.img`
  height: 500px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid;
    border-color: black transparent black transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`;

interface ArrowProps {
  direction: 'right' | 'left';
  hidden?: boolean;
}

export const Arrow = styled.i<ArrowProps>`
  --arrow-size: 10px;
  height: calc(var(--arrow-size) * 3);
  border: solid black;
  border-width: 0 var(--arrow-size) var(--arrow-size) 0;
  display: inline-block;
  position: fixed;
  padding: calc(var(--arrow-size) * 3);
  top: auto;
  bottom: auto;
  
  ${props => props.direction === 'right' && css`
    transform: rotate(-45deg);
    right: 10%;
  `}
  
  ${props => props.direction === 'left' && css`
    transform: rotate(135deg);
    left: 10%;
  `}
  
  ${props => props.hidden === true && css`
    display: none;
  `};
  
  &:hover, &:active {
    border: solid lightblue;
    border-width: 0 var(--arrow-size) var(--arrow-size) 0;
    cursor: pointer;
  }
`;
