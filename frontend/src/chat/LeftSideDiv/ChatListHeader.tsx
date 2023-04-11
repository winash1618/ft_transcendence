import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import {
  MessageNav,
  MessageNavNotUsed,
  ParentMessageNav,
  StyledBiCommentAdd,
  StyledMdOutlineTravelExplore,
} from "./styles/ChatListHeader.styled";
import { BiCommentAdd } from "react-icons/bi";
import { MdOutlineTravelExplore } from "react-icons/md";
interface ChatListHeaderProps {
  handleMessageNavClick: any;
  handleMessageNavNotUsedClick: any;
  messageNavButtonColor: any;
  messageNavButtonColorNotUsed: any;
  handleCreateConversationClick: any;
  handleExploreChannelsClick: any;
}

function ChatListHeader({
  handleMessageNavClick,
  handleMessageNavNotUsedClick,
  messageNavButtonColor,
  messageNavButtonColorNotUsed,
  handleCreateConversationClick,
  handleExploreChannelsClick,
}: ChatListHeaderProps) {
  return (
    <>
      <ParentMessageNav>
        <HiOutlineUser
          size={30}
          onClick={handleMessageNavClick}
          color={messageNavButtonColor}
        />
        <HiOutlineUserGroup
          size={30}
          onClick={handleMessageNavNotUsedClick}
          color={messageNavButtonColorNotUsed}
        />

        <StyledBiCommentAdd
          onClick={handleCreateConversationClick}
          color="white"
          size={30}
        />
        <MdOutlineTravelExplore
          onClick={handleExploreChannelsClick}
          size={30}
          color="white"
        />
      </ParentMessageNav>
    </>
  );
}

export default ChatListHeader;
