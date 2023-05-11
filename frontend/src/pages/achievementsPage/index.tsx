import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { AchievementsContainer, AchievementsWrapper, CustomRow } from "./achievementsPage.styled";
import { Row } from "antd";
import AchievementsCard from "../../components/achievementsCard";

const AchievementsPage = () => {
  const achievements = [
    {
      id: 1,
      title: "Winner",
      description: "Win your first game to unlock this achievement",
      image: <FontAwesomeIcon size="3x" icon={faTrophy} />,
    },
    {
      id: 2,
      title: "Overlord",
      description: "Win 10 games to unlock this achievement",
      image: <FontAwesomeIcon size="3x" icon={faTrophy} />,
    },
    {
      id: 3,
      title: "Legendary",
      description: "Win 3 game consecutively to unlock this achievement",
      image: <FontAwesomeIcon size="3x" icon={faTrophy} />,
    },
  ];
  return (
    <AchievementsContainer style={{width: "100%"}}>
    <CustomRow style={{paddingTop: "30px"}}>
      {achievements.map((achievement) => (
        <AchievementsWrapper sm={8}
        md={8} lg={2} key={achievement.id}>
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
