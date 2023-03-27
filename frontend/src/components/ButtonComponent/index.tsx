import { Button } from "antd";
import styled from "styled-components";

type StyledButtonProp = {
  [key: string]: any;
}

const ButtonComponent = ({ children, ...props } : StyledButtonProp) => {
  return (
    <ButtonStyling type="primary" {...props}>
      {children}
    </ButtonStyling>
  );
};

const ButtonStyling = styled(Button)<StyledButtonProp>`
  height: 48px;
  line-height: 24px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  padding: 0 4rem;
  border-radius: 5px;
  text-transform: capitalize;
  text-decoration: dashed;
  &:focus {
    background: var(--main-500);
  }
  &:hover {
    background: var(--main-700);
  }
`;

export default ButtonComponent;