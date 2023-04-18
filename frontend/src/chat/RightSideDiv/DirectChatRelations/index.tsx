import { useState } from "react";
import { UserProfilePicture } from "../../../assets";
import {
	DirectItem,
	DirectInfo,
	DirectName,
	DirectAvatar,
	FriendTitle,
	DirectArrow,
} from "./direct.styled";

import { List, Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { User } from "../../chat.functions";

interface DirectChatRelationsProps {
	user: any;
	socket: any;
	results: User[];
}

const DirectChatRelations = ({ user, socket, results }: DirectChatRelationsProps) => {
	const [userClicked, setUserClicked] = useState(null);
	const handleUserClick = (user: any) => {
		setUserClicked(user);
	};
	/*-----------------------------------------*/
	const handleMenuClick = (e: any) => {
		if (e.target.textContent === "Chat") {
			socket?.emit("directMessage", { userID: userClicked.id, title: userClicked.username });
			console.log("Chat");
		} else if (e.target.textContent === "Profile") {
			console.log("Profile");
			// redirect when click on profile to profile page http://localhost:3000/profile/user1
			window.location.href = `http://localhost:3000/profile/${userClicked.login}`;

		} else if (e.target.textContent === "Invite") {
			console.log("Invite");
		}
	};
	/*-----------------------------------------*/
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<div onClick={(e) => handleMenuClick(e)} >
					Chat
				</div>
			),
		},
		{
			key: "2",
			label: (
				<div onClick={(e) => handleMenuClick(e)} >
					Profile
				</div>
			),
		},
		{
			key: "3",
			label: (
				<div onClick={(e) => handleMenuClick(e)} >
					Invite
				</div>
			),
		},
	];

	/*----------------------------------------------------------------------------------------*/
	return (
		<>
			<FriendTitle>
				<h2>All Friends</h2>
			</FriendTitle>
			<List
				itemLayout="horizontal"
				dataSource={results}
				renderItem={(result) => (
					<DirectItem key={result.id} onClick={() => handleUserClick(result)}>
						<DirectInfo>
							<DirectAvatar src={UserProfilePicture} />
							<DirectName>{result.username}</DirectName>
							<Dropdown menu={{ items }} trigger={["click"]}>
								<DirectArrow>
									<DownOutlined className="direct-arrow" />
								</DirectArrow>
							</Dropdown>
						</DirectInfo>
					</DirectItem>
				)}
			/>
		</>
	);
};

export default DirectChatRelations;
