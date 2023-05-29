import { ServerErrorImg } from "../../../assets";
import {
  BodyTitle,
  BodyWrapper,
  Image,
} from "../errorPages.styled";

const ServerError = () => {
  return (
    <BodyWrapper>
      <Image style={{ maxWidth: "250px" }} src={ServerErrorImg} />
      <BodyTitle>Server is currently down. Please try again later.</BodyTitle>
    </BodyWrapper>
  );
};

export default ServerError;
