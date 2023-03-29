import { PageNotFoundImg } from "../../../assets";
import {
  BodyWrapper,
  Image,
} from "../errorPages.styled";

const PageNotFound404 = () => {
  return (
    <BodyWrapper>
      <Image src={PageNotFoundImg} />
    </BodyWrapper>
  );
};

export default PageNotFound404;
