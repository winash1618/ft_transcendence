import { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  AchievementDescription,
  AchievementsInfo,
  AchievementsTitle,
  AchievementTitle,
  ProfileAchievementsContainer,
} from "./profileAchievements.styled";

const ProfileAchievements = () => {
  const { user } = useAppSelector((state) => state.users);
  const [achievements, setAchievements] = useState<any[]>([]);
  useEffect(() => {
    if (user.id) {
      const fetchAchievements = async () => {
        const response = await axiosPrivate.get(
          `/users/achievements/${user.id}`
        );
        setAchievements(
          [
            {
              id: 1,
              title: "Da Player",
              description: "Play your first game to unlock this achievement",
              isAchieved: response.data.played_first,
            },
            {
              id: 2,
              title: "Overlord",
              description: "Win 3 games to unlock this achievement",
              isAchieved: response.data.won_three,
            },
            {
              id: 3,
              title: "Legendary",
              description: "Win 10 games to unlock this achievement",
              isAchieved: response.data.won_ten,
            },
          ].filter((achievement) => achievement.isAchieved)
        );
      };
      fetchAchievements();
    }
  }, [user]);

  return (
    <ProfileAchievementsContainer>
      <AchievementsTitle>Achievements</AchievementsTitle>
      {achievements.map((achievement: any) => (
        <AchievementsInfo key={achievement.title}>
          <AchievementTitle>{achievement.title}</AchievementTitle>
          <AchievementDescription>
            {achievement.description}
          </AchievementDescription>
        </AchievementsInfo>
      ))}
      {achievements.length === 0 && <div>No achievements</div>}
    </ProfileAchievementsContainer>
  );
};

export default ProfileAchievements;
