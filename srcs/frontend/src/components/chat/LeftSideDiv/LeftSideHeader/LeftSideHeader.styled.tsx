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
  background-color: #63a4ff;
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