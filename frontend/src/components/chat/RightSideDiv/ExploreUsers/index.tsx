import { useState } from "react";
import { UserProfilePicture } from "../../../../assets";
import { FriendTitle } from "./explore.styled";
import { List, Input } from "antd";
import { Colors, User } from "../../chat.functions";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { Picture } from "../../chat.styled";
import { BASE_URL, axiosPrivate } from "../../../../api";

const ExploreUsers = () => {
	const [results, setResults] = useState<User[]>([]);
	const { token } = useAppSelector((state) => state.auth);

	const handleUserClick = (user: User) => {
		window.location.href = `/profile/${user.login}`;
	};

	const searchUsers = async (searchText: string) => {
		if (searchText.length > 3 && searchText.length < 20) {
			try {
				await axiosPrivate.get('/search', { params: { search: searchText } })
					.then(response => {
						if (response.status === 200) {
							setResults(response.data);
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
		} else {
			setResults([]);
		}
	};

	return (
		<>
			<FriendTitle>
				<h3>Search Users</h3>
			</FriendTitle>
			<Input.Search
				placeholder="Search Users"
				onChange={(e) => searchUsers(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
				locale={{ emptyText: "No friends found" }}
				dataSource={results}
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
								</span>
							}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default ExploreUsers;
