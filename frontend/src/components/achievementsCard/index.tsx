import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";

const AchievementsCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <Meta title={title} description={description} />
    </Card>
  );
};

export default AchievementsCard;
