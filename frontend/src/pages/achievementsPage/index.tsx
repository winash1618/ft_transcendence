import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { AchievementsWrapper } from "./achievementsPage.styled";
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
    <Row style={{padding: "30px"}} gutter={[64, 64]}>
      {achievements.map((achievement) => (
        <AchievementsWrapper key={achievement.id}>
          <AchievementsCard
            title={achievement.title}
            image={achievement.image}
            description={achievement.description}
          />
        </AchievementsWrapper>
      ))}
    </Row>
  );
};

export default AchievementsPage;
