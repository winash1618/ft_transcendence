import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import {
  AchievementsContainer,
  AchievementsWrapper,
  CustomRow,
} from "./achievementsPage.styled";
import { Row } from "antd";
import AchievementsCard from "../../components/achievementsCard";
import { axiosPrivate } from "../../api";
import { useAppSelector } from "../../hooks/reduxHooks";

const AchievementsPage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [achievements, setAchievements] = useState<any[]>([]);
  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await axiosPrivate.get(
        `/users/achievements/${userInfo.id}`
      );
      setAchievements([
        {
          id: 1,
          title: "Da Player",
          description: "Play your first game to unlock this achievement",
          image: <FontAwesomeIcon color={response.data.played_first ? "yellow" : "black"} size="3x" icon={faTrophy} />,
        },
        {
          id: 2,
          title: "Overlord",
          description: "Win 3 games to unlock this achievement",
          image: <FontAwesomeIcon color={response.data.won_three ? "yellow" : "black"} size="3x" icon={faTrophy} />,
        },
        {
          id: 3,
          title: "Legendary",
          description: "Win 10 games to unlock this achievement",
          image: <FontAwesomeIcon color={response.data.won_ten ? "yellow" : "black"} size="3x" icon={faTrophy} />,
        },
      ]);
      console.log(response.data);
    };
    fetchAchievements();
  });
  return (
    <AchievementsContainer style={{ width: "100%" }}>
      <CustomRow style={{ paddingTop: "30px" }}>
        {achievements.map((achievement) => (
          <AchievementsWrapper sm={8} md={8} lg={2} key={achievement.id}>
            <AchievementsCard
              title={achievement.title}
              image={achievement.image}
              description={achievement.description}
            />
          </AchievementsWrapper>
        ))}
      </CustomRow>
    </AchievementsContainer>
  );
};

export default AchievementsPage;
