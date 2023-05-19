import { GroupTitle } from "./group.styled";
import { List, Dropdown, MenuProps, Input } from "antd";
import { DownOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { UserProfilePicture } from "../../../../assets";
import { FaUserPlus, FaUserFriends, FaUserSlash } from "react-icons/fa";
import { Colors, GNav, Role, User } from "../../chat.functions";
import { useState } from "react";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { Picture } from "../../chat.styled";
import { BASE_URL, axiosPrivate } from "../../../../api";
import { IoMdAddCircleOutline } from "react-icons/io";

interface GroupChatRelationsProps {
	socket: any;
	conversationID: string;
	conversation: any;
	groupResults: any;
	setGroupResults: any;
	setGroupNav: any;
	groupNav: GNav;
}

interface ResultObject {
	user: User;
	role: any;
	status: any;
	id: string;
	username: string;
	profile_picture: string;
}

const GroupChatRelations = ({
	socket,
	conversationID,
	conversation,
	groupResults,
	setGroupResults,
	setGroupNav,
	groupNav,
}: GroupChatRelationsProps) => {
	const [userObject, setUserObject] = useState<any>(null);
	const [searchText, setSearchText] = useState("");
	const { token } = useAppSelector((state) => state.auth);
	/*-----------Handle User Click-------------------------------------------------*/
	const handleUserClick = (participant: any) => {
		setUserObject(participant.user);
	};
	/*-----------Handle User Click-------------------------------------------------*/
	/*-----------Handle Menu Click-------------------------------------------------*/
	const handleMenuClick = (e: any) => {
		if (e.target.textContent === "Make Admin") {
			socket?.emit("makeAdmin", {
				conversationID: conversation.id,
				userID: userObject.id,
			});
			setGroupResults(
				groupResults.map((result) => {
					if (result.user.id === userObject.id) {
						return { ...result, role: Role.ADMIN };
					}
					return result;
				})
			);
		} else if (e.target.textContent === "Ban") {
			socket?.emit("banUser", {
				conversationID: conversation.id,
				userID: userObject.id,
			});
			setGroupResults(groupResults.filter((result) => result.user.id !== userObject.id));
		} else if (e.target.textContent === "Mute") {
			socket?.emit("muteUser", {
				conversationID: conversation.id,
				userID: userObject.id,
			});
		} else if (e.target.textContent === "Kick") {
			socket?.emit("removeParticipant", {
				conversationID: conversation.id,
				userID: userObject.id,
			});
			setGroupResults(groupResults.filter((result) => result.user.id !== userObject.id));
		}
	};
	/*-----------Handle Menu Click-------------------------------------------------*/
	/*-----------Handle Unban Click-------------------------------------------------*/
	const handleUnbanClick = (object: any) => {
		setUserObject(object.user);
		socket?.emit("unbanUser", {
			conversationID: conversation.id,
			userID: object.user.id,
		});
		setGroupResults(groupResults.filter((result) => result.user.id !== object.user.id));
	};
	/*-----------Handle Unban Click-------------------------------------------------*/
	/*-----------Handle Add Click-------------------------------------------------*/
	const handleAddClick = (object: any) => {
		setUserObject(object.username);
		socket?.emit("addParticipant", {
			conversationID: conversation.id,
			userID: object.id,
		});
		setGroupResults(groupResults.filter((result) => result.id !== object.id));
	};
	/*-----------Handle Add Click-------------------------------------------------*/

	const filterResults = (data: ResultObject[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		if (groupNav !== GNav.ADD && conversationID !== null)
			return data.filter((item) => item.user.username.toLowerCase().includes(searchText.toLowerCase()));
		return data.filter((item) => item.username.toLowerCase().includes(searchText.toLowerCase()));
	};

	/*-----------MENU-------------------------------------------------*/
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <div onClick={(e) => handleMenuClick(e)}>Make Admin</div>,
			disabled: conversation
				&& conversation !== undefined
				&& conversation.participants
				&& conversation.participants !== undefined
				&& (conversation.participants[0].role !== Role.OWNER)
				? true
				: false,
		},
		{
			key: "2",
			label: <div onClick={(e) => handleMenuClick(e)}>Ban</div>,
		},
		{
			key: "3",
			label: <div onClick={(e) => handleMenuClick(e)}>Mute</div>,
		},
		{
			key: "4",
			label: <div onClick={(e) => handleMenuClick(e)}>Kick</div>,
		},
	];
	/*----------------------------------------------------------------*/
	/*----------------------------------------------------------------*/
	const HandleGroupNavClick = (nav: any) => async () => {
		setGroupResults([]);
		if (nav === GNav.GROUPS && conversationID !== null) {
			try {
				await axiosPrivate.get(`/chat/${conversationID}/members`).
					then(response => {
						if (response.status === 200) {
							setGroupResults(response.data);
						} else {
							window.location.href = '/error';
						}
					})
					.catch(error => {
						console.error('An error occurred:', error);
						window.location.href = '/error';
					});
			} catch (err) {
				console.log(err);
			}
		}
		if (nav === GNav.BLOCKED && conversationID !== null) {
			setGroupResults([]);
			try {
				await axiosPrivate.get(`/chat/channel/${conversationID}/banned`)
					.then(response => {
						if (response.status === 200) {
							setGroupResults(response.data);
						} else {
							window.location.href = '/error';
						}
					})
					.catch(error => {
						console.error('An error occurred:', error);
						window.location.href = '/error';
					});
			} catch (err) {
				console.log(err);
			}
		}
		if (nav === GNav.ADD && conversationID !== null) {
			setGroupResults([]);
			try {
				await axiosPrivate.get(`/chat/channel/${conversationID}/addFriends`)
					.then(response => {
						if (response.status === 200) {
							setGroupResults(response.data.friends);
						} else {
							window.location.href = '/error';
						}
					})
					.catch(error => {
						console.error('An error occurred:', error);
						window.location.href = '/error';
					});
			} catch (err) {
				console.log(err);
			}
		}
		setGroupNav(nav);
	};

	if (conversation !== undefined && conversation !== null) {
		return (
			<>
				<GroupTitle>
					<FaUserFriends
						onClick={HandleGroupNavClick(GNav.GROUPS)}
						color={groupNav === GNav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
						size={30}
					/>
					<FaUserSlash
						onClick={HandleGroupNavClick(GNav.BLOCKED)}
						color={groupNav === GNav.BLOCKED ? Colors.WHITE : Colors.PRIMARY}
						size={30}
					/>
					<FaUserPlus
						onClick={HandleGroupNavClick(GNav.ADD)}
						color={groupNav === GNav.ADD ? Colors.WHITE : Colors.PRIMARY}
						size={30}
					/>
				</GroupTitle>
				<Input.Search
					placeholder="Search Users"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
				{groupNav === GNav.GROUPS ? (
					<List
						itemLayout="horizontal"
						locale={{ emptyText: "No groups found" }}
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (

							<List.Item
								onClick={() => handleUserClick(result)}
								style={{
									border: Colors.SECONDARY + ' 1px solid',
									cursor: 'pointer',
									paddingLeft: '.5rem',
									borderRadius: '.5rem',
									color: 'white',
									marginTop: '.65rem',
									padding: '.75rem'
								}}
							>
								<List.Item.Meta
									avatar={<Picture
										src={`${BASE_URL}/users/profile-image/${result.user.profile_picture}/${token}`}
										onError={(e) => {
											e.currentTarget.src = UserProfilePicture;
										}}
										alt="A profile photo of the current user"
									/>}
									title={
										<span style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											{result.user.username}
											{conversation.participants[0].role !== Role.USER ? (
												(result.role === "USER" || result.role === "ADMIN") ? (
													<Dropdown menu={{ items }} trigger={["click"]}>
														<DownOutlined className="group-arrow" />
													</Dropdown>
												) : (
													<MinusCircleOutlined />
												)
											) : (
												<MinusCircleOutlined />
											)}
										</span>
									}
								/>
							</List.Item>
						)}
					/>
				) : groupNav === GNav.BLOCKED ? (
					<List
						itemLayout="horizontal"
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (
							<List.Item
								onClick={() => handleUserClick(result)}
								style={{
									border: Colors.SECONDARY + ' 1px solid',
									cursor: 'pointer',
									paddingLeft: '.5rem',
									borderRadius: '.5rem',
									color: 'white',
									marginTop: '.65rem',
									padding: '.75rem'
								}}
							>
								<List.Item.Meta
									avatar={<Picture
										src={`${BASE_URL}/users/profile-image/${result.user.profile_picture}/${token}`}
										onError={(e) => {
											e.currentTarget.src = UserProfilePicture;
										}}
										alt="A profile photo of the current user"
									/>}
									title={
										<span style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											{result.user.username}
											{conversation.participants[0].role !== Role.USER ? (
												(result.role === "USER" || result.role === "ADMIN") ? (
													<IoMdAddCircleOutline size={24} color="green" onClick={() => handleUnbanClick(result)} />
												) : (
													<MinusCircleOutlined />
												)
											) : (
												<MinusCircleOutlined />
											)}
										</span>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<List
						itemLayout="horizontal"
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (
							<List.Item
								onClick={() => handleUserClick(result)}
								style={{
									border: Colors.SECONDARY + ' 1px solid',
									cursor: 'pointer',
									paddingLeft: '.5rem',
									borderRadius: '.5rem',
									color: 'white',
									marginTop: '.65rem',
									padding: '.75rem'
								}}
							>
								<List.Item.Meta
									avatar={<Picture
										src={`${BASE_URL}/users/profile-image/${result.profile_picture}/${token}`}
										onError={(e) => {
											e.currentTarget.src = UserProfilePicture;
										}}
										alt="A profile photo of the current user"
									/>}
									title={
										<span style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											{result.username}
											{conversation.participants[0].role !== Role.USER ? (
												<IoMdAddCircleOutline size={24} color="green" onClick={() => handleAddClick(result)} />
											) : <MinusCircleOutlined />}
										</span>
									}
								/>
							</List.Item>
						)}
					/>
				)}
			</>
		);
	}
	return null;
};

export default GroupChatRelations;
