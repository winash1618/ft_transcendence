import styled from 'styled-components';

export const DropdownButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  @media screen and (max-width: 767px) { /* Mobile styles */
    margin-left: 0px;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) { /* Tablet styles */
    margin-left: 5px;
  }

  @media screen and (min-width: 1024px) { /* Desktop styles */
    margin-left: 10px;
  }
`;

