import { useState } from "react";
import { UserProfilePicture } from "../../../assets";
import {
	DirectItem,
	DirectInfo,
	DirectName,
	DirectAvatar,
	DirectArrow,
	FriendTitle,
} from "./direct.styled";

import { List, Dropdown, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { User } from "../../chat.functions";

interface DirectChatRelationsProps {
	user: any;
	socket: any;
	results: User[];
}

const DirectChatRelations = ({ user, socket, results }: DirectChatRelationsProps) => {
	const [userClicked, setUserClicked] = useState(null);
	const [searchText, setSearchText] = useState("");

	const handleUserClick = (user: User) => {
		setUserClicked(user);
	};

	const handleMenuClick = (e: any) => {
		if (e.target.textContent === "Chat") {
			socket?.emit("directMessage", { userID: userClicked.id, title: userClicked.username });
			console.log("Chat");
		} else if (e.target.textContent === "Profile") {
			console.log("Profile");
			window.location.href = `http://localhost:3000/profile/${userClicked.login}`;
		} else if (e.target.textContent === "Invite") {
			console.log("Invite");
		}
	};

	const filterResults = (data: User[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.username.toLowerCase().includes(searchText.toLowerCase()));
	};

	const items = [
		{
			key: "1",
			label: <div onClick={(e) => handleMenuClick(e)}>Chat</div>,
		},
		{
			key: "2",
			label: <div onClick={(e) => handleMenuClick(e)}>Profile</div>,
		},
		{
			key: "3",
			label: <div onClick={(e) => handleMenuClick(e)}>Invite</div>,
		},
	];

	return (
		<>
			<FriendTitle>
				<h3>All Friends</h3>
			</FriendTitle>
			<Input.Search
				placeholder="Search friends"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
        locale={{ emptyText: "No friends found" }}
				dataSource={filterResults(results, searchText)}
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
