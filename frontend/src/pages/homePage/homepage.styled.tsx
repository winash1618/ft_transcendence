import styled from 'styled-components';

interface ParentContainerProps {
	backgroundColor: string;
  }
  
export const ParentContainer = styled.div<ParentContainerProps>`
display: flex;
flex-direction: row;
height: 100vh;
color: #1a1d1f;
background-color: ${({ backgroundColor }) => backgroundColor};
`;

