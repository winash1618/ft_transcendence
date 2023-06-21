import styled from "styled-components";

const DirectItem = styled.div`
  color: white;
  border-radius: 5px;
  margin-top: 1rem;
  border: 1px solid #63a4ff;
  width: 16vw;
  padding: 0.5em;
`;

const FriendTitle = styled.div`
  background-color: #63a4ff;
  border-radius: 15px 15px 0 0;
  width: 100%;
  height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	  margin-bottom: 1rem;
`;

const DirectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DirectName = styled.div`{
	color: "white";
	font-size: 16px;
  margin-right: 10px;
	width: 6rem;
	align-items: left;
`;

const DirectArrow = styled.div`
  font-size: 16px;
  color: gray;
  cursor: pointer;
`;

const DirectAvatar = styled.img`
  max-width: 50%;
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 50%;
  margin-right: 15px;
`;

export {
  DirectItem,
  DirectInfo,
  DirectName,
  DirectAvatar,
  FriendTitle,
  DirectArrow,
};
