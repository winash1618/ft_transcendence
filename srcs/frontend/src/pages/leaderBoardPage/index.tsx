import {
	LeaderboardItem,
	LeaderboardRank,
	LeaderboardAvatar,
	LeaderboardName,
	LeaderboardScore,
} from "./leader.styled";
import { useAppSelector } from "../../hooks/reduxHooks";
import { BASE_URL, axiosPrivate } from "../../api";

import { List, Pagination } from "antd";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { UserProfilePicture } from "../../assets";
const { Title } = Typography;
interface LeaderboardData {
  rank: number;
  login: string;
  username: string;
  rating: number;
  profile_picture: string;
}

const LeaderBoardPage = () => {
	const { token } = useAppSelector((state) => state.auth);
	const [data, setData] = useState<LeaderboardData[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const getInfos = async () => {
		try {
			await axiosPrivate.get("/users/leaderboard/leaders",).then(response => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					window.location.href = '/error';
					// window.location.reload();
				}
			}).catch(error => {
				window.location.href = '/error';
				// window.location.reload();
			});
		} catch (err) {
		}
	};

  useEffect(() => {
    getInfos();
  }, []);

	return (
		<div>
			<Title style={{ color: "white" }}>Leaderboard</Title>
			<List
				itemLayout="horizontal"
				dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
				renderItem={(player, index) => (
					<LeaderboardItem key={player.rank}>
						<LeaderboardRank>{index + 1}</LeaderboardRank>
						<LeaderboardName>{player.login}</LeaderboardName>
						<LeaderboardScore className="leaderboard-score">
							Score: {player.rating}
						</LeaderboardScore>
						<LeaderboardAvatar
							className="leaderboard-avatar"
							src={`${BASE_URL}/users/profile-image/${player.profile_picture}/${token}`}
							onError={(e) => {
								e.currentTarget.src = UserProfilePicture;
							}}
						/>
					</LeaderboardItem>
				)}
			/>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={data.length}
				onChange={(page, pageSize) => {
					setCurrentPage(page);
					setPageSize(pageSize);
				}}
				style={{display: "flex", justifyContent: "center", alignItems: "flex-end", marginTop: "1rem"}}
			/>
		</div>
	);
};

export default LeaderBoardPage;
