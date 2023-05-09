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
  return (
    <ProfileAchievementsContainer>
      <AchievementsTitle>Achievements</AchievementsTitle>
      {user?.achievements ? (
        <AchievementsInfo>
          <AchievementTitle>Winner</AchievementTitle>
          <AchievementDescription></AchievementDescription>
        </AchievementsInfo>
      ) : (
        <div>No achievements</div>
      )}
    </ProfileAchievementsContainer>
  );
};

export default ProfileAchievements;
