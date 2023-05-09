import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { CustomCard } from "./achievementsCard.styled";

const AchievementsCard = ({
  title,
  image,
  description,
}: {
  title: string;
  image: any;
  description: string;
}) => {
  return (
    <CustomCard cover={image}>
      <Meta title={title} description={description} />
    </CustomCard>
  );
};

export default AchievementsCard;
