import styled, { css, ThemedStyledProps } from 'styled-components';

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

export const Input = styled.input.attrs({ type: "checkbox" })``;

export const Label = styled.label`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`
type LabelTextProps = {
	$mode: string;
  };
  
export const LabelText = styled.span<LabelTextProps>`
 as ThemedStyledProps<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, any>;
  ${(props) => {
    switch (props.$mode) {
      case "dark":
        return css`
          background-color: black;
          color: white;
          ${Input}:checked + && {
            color: blue;
          }
        `;
      default:
        return css`
          background-color: white;
          color: black;
          ${Input}:checked + && {
            color: red;
          }
        `;
    }
  }}
`;


