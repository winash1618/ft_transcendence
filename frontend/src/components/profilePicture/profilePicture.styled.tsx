import { Upload } from "antd";
import styled from "styled-components";

export const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CustomUpload = styled(Upload)`
  width: 100%;
  & .ant-upload span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
  }
  & .ant-upload {
    width: 100%;
  }
`;

export const ProfileImage = styled.img`
  width: 300px;
  border: 1px solid #000;
  object-fit: cover;
  height: 300px;
  border-radius: 50%;
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export const ProfileLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid #000;
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;
