import { Layout } from "antd";
import styled from "styled-components";

const { Sider } = Layout;

export const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 0 0.8rem 0 0;
  justify-content: center;
  align-items: center;
`;


export const LogoImg = styled.img`
  width: 100%;
  max-width: 4rem;
  max-height: 4rem;
  min-width: 50px;
  min-height: 50px;;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  float: right;
`;
export const CustomSider = styled(Sider)`
  position: absolute !important;
  border-radius: 15px !important;
  z-index: 99999;
  background: var(--main-600) !important;
  & .ant-layout-sider-zero-width-trigger {
    top: 17px;
    overflow: hidden;
  }
`;

export const NotificationsWrapper = styled.div`
  position: relative;
`;

export const NotificationsCounter = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -5px;
  width: 20px;
  font-size: 0.8rem;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  top: -5px;
`;

export const InviteWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

export const InviteDescription = styled.p`
  font-size: 0.9rem;
  line-height: 20px;
`;

export const NotificationsUl = styled.ul`
  position: absolute;
  overflow-y: auto;
  z-index: 999999;
  max-height: 500px;
  left: -15vw;
  background: #fff;
  /* @media (max-width: 568px) {
    max-width: 200px;
  } */
  list-style-type: none;
  border-radius: 10px;
  color: #000;
`;

export const NotificationsLi = styled.li`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
`;

export const InviteButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;
`;
