import {
	GroupArrow,
	GroupAvatar,
	GroupInfo,
	GroupItem,
	GroupName,
	GroupTitle,
} from "./group.styled";
import { List, Dropdown, MenuProps, Button, Input, Result } from "antd";
import { DownOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { UserProfilePicture } from "../../../../assets";
import { FaUserPlus, FaUserFriends, FaUserSlash } from "react-icons/fa";
import { Colors, GNav, Role, User } from "../../chat.functions";
import { useState } from "react";
import axios from "axios";
import { logOut } from "../../../../store/authReducer";
import { useAppDispatch } from "../../../../hooks/reduxHooks";

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
	const [user, setUser] = useState<any>(null);
	const [searchText, setSearchText] = useState("");
	/*-----------Handle User Click-------------------------------------------------*/
	const handleUserClick = (participant: any) => {
		setUser(participant.user);
	};
	/*-----------Handle User Click-------------------------------------------------*/
	/*-----------Handle Menu Click-------------------------------------------------*/
	const handleMenuClick = (e: any) => {
		if (e.target.textContent === "Make Admin") {
			socket?.emit("makeAdmin", {
				conversationID: conversation.id,
				userID: user.id,
			});
			setGroupResults(
				groupResults.map((result) => {
					if (result.user.id === user.id) {
						return { ...result, role: Role.ADMIN };
					}
					return result;
				})
			);
			console.log("Make Admin");
		} else if (e.target.textContent === "Ban") {
			console.log("User Ban", user);
			socket?.emit("banUser", {
				conversationID: conversation.id,
				userID: user.id,
			});
			setGroupResults(groupResults.filter((result) => result.user.id !== user.id));
			console.log("Ban");
		} else if (e.target.textContent === "Mute") {
			socket?.emit("muteUser", {
				conversationID: conversation.id,
				userID: user.id,
			});
			console.log("Mute");
		} else if (e.target.textContent === "Kick") {
			socket?.emit("removeParticipant", {
				conversationID: conversation.id,
				userID: user.id,
			});
			setGroupResults(groupResults.filter((result) => result.user.id !== user.id));
			console.log("Kick");
		}
	};
	/*-----------Handle Menu Click-------------------------------------------------*/
	/*-----------Handle Unban Click-------------------------------------------------*/
	const handleUnbanClick = (object: any) => {
		console.log("unban");
		setUser(object.user);
		socket?.emit("unbanUser", {
			conversationID: conversation.id,
			userID: object.user.id,
		});
		setGroupResults(groupResults.filter((result) => result.user.id !== object.user.id));
	};
	/*-----------Handle Unban Click-------------------------------------------------*/
	/*-----------Handle Add Click-------------------------------------------------*/
	const handleAddClick = (object: any) => {
		console.log("Add");
		setUser(object.username);
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
		console.log(data);
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
				&& conversation.participants[0].role !== Role.OWNER
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
	const dispatch = useAppDispatch();
	const HandleGroupNavClick = (nav: any) => async () => {
		const getToken = async () => {
			try {
				const response = await axios.get("http://localhost:3001/token", {
					withCredentials: true,
				});
				localStorage.setItem("auth", JSON.stringify(response.data));
				return response.data.token;
			} catch (err) {
				dispatch(logOut());
				window.location.reload();
				return null;
			}
		};
		if (nav === GNav.GROUPS && conversationID !== null) {
			const token = await getToken();
			try {
				const result = await axios.get(
					`http://localhost:3001/chat/${conversationID}/members`,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setGroupResults(result.data);
				console.log("Group members", result.data);
			} catch (err) {
				console.log(err);
			}
		}
		if (nav === GNav.BLOCKED && conversationID !== null) {
			const token = await getToken();
			console.log(conversationID);
			try {
				const result = await axios.get(
					`http://localhost:3001/chat/channel/${conversationID}/banned`,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setGroupResults(result.data);
				console.log("Banned Members", result);
			} catch (err) {
				console.log(err);
			}
		}
		if (nav === GNav.ADD && conversationID !== null) {
			const token = await getToken();
			console.log(conversationID);
			try {
				const result = await axios.get(
					`http://localhost:3001/chat/channel/${conversationID}/addFriends`,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setGroupResults(result.data.friends);
				console.log("Add Members", result.data.friends);
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
					placeholder="Search friends"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
				{groupNav === GNav.GROUPS ? (
					<List
						itemLayout="horizontal"
						locale={{ emptyText: "No groups found" }}
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (
							<GroupItem key={result.id} onClick={() => handleUserClick(result)}>
								<GroupInfo>
									<GroupAvatar src={UserProfilePicture} />
									<GroupName>{result.user.username}</GroupName>
									{conversation.participants[0].role !== Role.USER ? (
										result.role === "USER" ? (
											<Dropdown menu={{ items }} trigger={["click"]}>
												<GroupArrow>
													<DownOutlined className="group-arrow" />
												</GroupArrow>
											</Dropdown>
										) : (
											<MinusCircleOutlined />
										)
									) : (
										<MinusCircleOutlined />
									)}
								</GroupInfo>
							</GroupItem>
						)}
					/>
				) : groupNav === GNav.BLOCKED ? (
					<List
						itemLayout="horizontal"
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (
							<GroupItem>
								<GroupInfo>
									<GroupAvatar src={UserProfilePicture} />
									<GroupName>{result.user.username}</GroupName>
									{conversation.participants[0].role !== Role.USER ? (
										result.role === "USER" ? (
											<Button
												type="primary"
												onClick={() => handleUnbanClick(result)}
											>
												Unban
											</Button>
										) : (
											<MinusCircleOutlined />
										)
									) : (
										<MinusCircleOutlined />
									)}
								</GroupInfo>
							</GroupItem>
						)}
					/>
				) : (
					<List
						itemLayout="horizontal"
						dataSource={filterResults(groupResults, searchText) as any}
						renderItem={(result: ResultObject) => (
							<GroupItem>
								<GroupInfo>
									<GroupAvatar src={UserProfilePicture} />
									<GroupName>{result.username}</GroupName>
									{conversation.participants[0].role !== Role.USER ? (
										<Button type="default" onClick={() => handleAddClick(result)}>
											Add
										</Button>
									) : <MinusCircleOutlined />}
								</GroupInfo>
							</GroupItem>
						)}
					/>
				)}
			</>
		);
	}
	return null;
};

export default GroupChatRelations;
