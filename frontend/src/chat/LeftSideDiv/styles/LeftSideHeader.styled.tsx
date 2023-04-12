import { BiCommentAdd } from "react-icons/bi";
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineTravelExplore } from "react-icons/md";
import styled from "styled-components";

export const ParentMessageNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 10px 20px 10px 20px;
  background-color: #00a551;
  margin-bottom: 1em;
`;

export const StyledBiCommentAdd = styled(BiCommentAdd)`
  &: hover {
    cursor: pointer;
    transform: scale(1.3);
  }
`;
export const StyledHiOutlineUser = styled(HiOutlineUser)`
  &: hover {
    cursor: pointer;
    transform: scale(1.3);
  }
`;
export const StyledHiOutlineUserGroup = styled(HiOutlineUserGroup)`
  &: hover {
    cursor: pointer;
    transform: scale(1.3);
  }
`;
export const StyledMdOutlineTravelExplore = styled(MdOutlineTravelExplore)`
  &: hover {
    cursor: pointer;
    transform: scale(1.3);
  }
`;

interface MessageNavProps {
  backgroundColor: string;
}

export const MessageNav = styled.button<MessageNavProps>`
  color: white;
  font-size: 1rem;
  // margin: 1em;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 15px;
  border: none;
`;

interface MessageNavNotUsedProps {
  backgroundColor: string;
}

// A new component based on Button, but with some override styles
export const MessageNavNotUsed = styled.button<MessageNavNotUsedProps>`
  color: white;
  font-size: 1em;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 15px;
  border: 0px;
`;
