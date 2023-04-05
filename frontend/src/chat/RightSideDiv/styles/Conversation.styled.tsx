import styled from "styled-components";
import { RiMailSettingsFill } from "react-icons/ri";

interface ContactDivProps {
	backgroundColor: string;
}
// create a styled div component that'll render a contact div
export const ContactDiv = styled.div<ContactDivProps>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
  border: 2px solid #00A551;
  background: ${({ backgroundColor }) => backgroundColor};

  @media screen and (max-width: 767px) { /* Mobile styles */
    height: 30px;
    margin-top: 5px;
    font-size: 10px;
  }

  @media screen and (min-width: 768px) and (max-width: 1423px) { /* Tablet styles */
    height: 40px;
    margin-top: 8px;
    font-size: 12px;
  }

  @media screen and (min-width: 1424px) { /* Desktop styles */
    height: 50px;
    margin-top: 10px;
    font-size: 14px;
  }
`;

export const ContactImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 5px;
  border-radius: 50%;

  @media screen and (max-width: 767px) { /* Mobile styles */
    width: 40px;
    height: 40px;
    padding: 5px;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) { /* Tablet styles */
    width: 45px;
    height: 45px;
    padding: 7px;
  }

  @media screen and (min-width: 1024px) { /* Desktop styles */
    width: 50px;
    height: 50px;
    padding: 10px;
  }
`;

export const ContactName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  font-size: 1em;
  width: 70%;
  height: 50px;

  @media screen and (max-width: 767px) { /* Mobile styles */
    width: 40%;
    height: 40px;
    font-size: 0.9em;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) { /* Tablet styles */
    width: 50%;
    height: 45px;
    font-size: 1em;
  }

  @media screen and (min-width: 1024px) { /* Desktop styles */
    width: 60%;
    height: 50px;
    font-size: 1em;
  }
`;

export const Heading1 = styled.h1`
  font-size: 2rem;
  color: #444;
  margin: 1rem 0;

  @media screen and (max-width: 767px) { /* Mobile styles */
    font-size: 1.4rem;
    margin-left: 5px;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) { /* Tablet styles */
    font-size: 1.6rem;
  }

  @media screen and (min-width: 1024px) { /* Desktop styles */
    font-size: 1.8rem;
  }
`;

export const Heading2 = styled.h2`
  color: #333;
  margin: 1rem 0;

  @media screen and (max-width: 767px) { /* Mobile styles */
    font-size: 1.0rem;
    margin-left: 5px;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) { /* Tablet styles */
    font-size: 1.1rem;
  }

  @media screen and (min-width: 1024px) { /* Desktop styles */
    font-size: 1.2rem;
  }
`;


export const StyledRiMailSettingsFill = styled(RiMailSettingsFill)`
  color: #00A551;
  font-size: 1.5em;
  margin-left: 5px;
  cursor: pointer;
  &: active {
    transform: scale(0.9); /* Example of click effect: scale down to 90% */
  }
	  
`;