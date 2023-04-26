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
      title: "Achievement 1",
      description: "Description 1",
      image: <FontAwesomeIcon icon={faTrophy} />,
    },
    {
      id: 2,
      title: "Achievement 1",
      description: "Description 1",
      image: <FontAwesomeIcon icon={faTrophy} />,
    },
    {
      id: 3,
      title: "Achievement 1",
      description: "Description 1",
      image: <FontAwesomeIcon icon={faTrophy} />,
    },
  ];
  return (
    <Row>
      {achievements.map((achievement) => (
        <AchievementsWrapper key={achievement.id}>
          <AchievementsCard
            title={achievement.title}
            description={achievement.description}
          />
        </AchievementsWrapper>
      ))}
    </Row>
  );
};

export default AchievementsPage;
