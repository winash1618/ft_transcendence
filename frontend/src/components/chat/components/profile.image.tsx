import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../api";
import { UserProfilePicture } from "../../../assets";
import { Picture } from "../chat.styled";

const ProfilePicture = ({ conversation, token }) => {
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		const profilePictureUrl = `${BASE_URL}/users/profile-image/${conversation.participants[0].user.profile_picture}/${token}`;

		axios
			.head(profilePictureUrl)
			.then((response) => {
				if (response.status === 200) {
					setImageUrl(profilePictureUrl);
				} else {
					console.log(`URL ${profilePictureUrl} is not available`);
				}
			})
			.catch((error) => {
				console.error(`Error checking URL ${profilePictureUrl}: ${error}`);
			});
	}, [conversation, token]);

	if (imageUrl) {
		return (
			<Picture
				src={imageUrl}
				onError={(e) => {
					e.currentTarget.src = UserProfilePicture;
				}}
				alt="A profile photo of the current user"
			/>
		);
	} else {
		<Picture
			src={UserProfilePicture}
			alt="A profile photo of the current user"
		/>
	}
};

export default ProfilePicture;