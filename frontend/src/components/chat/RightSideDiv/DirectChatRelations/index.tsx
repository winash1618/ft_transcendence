import { useState } from "react";
import { UserProfilePicture } from "../../../../assets";
import { FriendTitle } from "./direct.styled";
import { List, Dropdown, Input, Badge, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Colors, User } from "../../chat.functions";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { Picture } from "../../chat.styled";
import { BASE_URL } from "../../../../api";

interface DirectChatRelationsProps {
	socket: any;
	results: User[];
}

const DirectChatRelations = ({ socket, results }: DirectChatRelationsProps) => {
	const [userClicked, setUserClicked] = useState(null);
	const [searchText, setSearchText] = useState("");
	const { socket: socketNew } = useAppSelector((state) => state.game);
	const { token } = useAppSelector((state) => state.auth);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleUserClick = (user: User) => {
		setUserClicked(user);
	};

	const handleMenuClick = (e: any) => {
		if (e.target.textContent === "Chat") {
			socket?.emit("directMessage", {
				userID: userClicked.id,
				title: userClicked.username,
			});
		} else if (e.target.textContent === "Profile") {
			window.location.href = `/profile/${userClicked.login}`;
		} else if (e.target.textContent === "Invite") {
			socketNew?.emit("Invite", userClicked);
		}
	};

	const filterResults = (data: User[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) =>
			item.username.toLowerCase().includes(searchText.toLowerCase())
		);
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
				dataSource={filterResults(results, searchText).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
				renderItem={(result) => (
					<List.Item
						onClick={() => handleUserClick(result)}
						style={{
							border: Colors.SECONDARY + " 1px solid",
							cursor: "pointer",
							paddingLeft: ".5rem",
							borderRadius: ".5rem",
							color: "white",
							marginTop: ".65rem",
							padding: ".75rem",
						}}
					>
						<List.Item.Meta
							avatar={
								<Picture
									src={`${BASE_URL}/users/profile-image/${result.profile_picture}/${token}`}
									onError={(e) => {
										e.currentTarget.src = UserProfilePicture;
									}}
									alt="A profile photo of the current user"
								/>
							}
							title={
								<span
									style={{
										color: "white",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									{result.username}
									<span
										style={{
											margin: "0 .5rem",
										}}
									>
										<Badge
											status={
												result.user_status === "ONLINE"
													? "success"
													: result.user_status === "IN_GAME"
														? "warning"
														: "error"
											}
											color={
												result.user_status === "ONLINE"
													? "#52c41a"
													: result.user_status === "IN_GAME"
														? "#faad14"
														: "#f5222d"
											}
										/>
									</span>
									<Dropdown menu={{ items }} trigger={["click"]}>
										<DownOutlined className="direct-arrow" />
									</Dropdown>
								</span>
							}
						/>
					</List.Item>
				)}
			/>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={filterResults(results, searchText).length}
				onChange={(page, pageSize) => {
					setCurrentPage(page);
					setPageSize(pageSize);
				}}
				style={{display: "flex", justifyContent: "center", alignItems: "flex-end", marginTop: "1rem"}}
			/>
		</>
	);
};

export default DirectChatRelations;
