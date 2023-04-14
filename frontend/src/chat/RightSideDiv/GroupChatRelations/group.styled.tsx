import styled from "styled-components";

const GroupItem = styled.div`
  color: white;
  border-radius: 5px;
  margin-top: 1rem;
  border: 1px solid green;
  width: 16vw;
  padding: 0.5em;
`;

const GroupTitle = styled.div`
  background-color: #00a551;
  border-radius: 15px 15px 0 0;
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GroupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GroupName = styled.div`{
	color: "white";
	font-size: 16px;
  margin-right: 10px;
	width: 6rem;
	align-items: left;
`;

const GroupArrow = styled.div`
  font-size: 16px;
  color: gray;
  cursor: pointer;
`;

const GroupAvatar = styled.img`
  max-width: 50%;
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 50%;
  margin-right: 15px;
`;

export {
  GroupItem,
  GroupInfo,
  GroupName,
  GroupAvatar,
  GroupTitle,
  GroupArrow,
};
