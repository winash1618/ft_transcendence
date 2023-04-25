import { Layout } from "antd";
import styled from "styled-components";

const { Sider } = Layout;

export const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem 0.8rem 0 0;
  justify-content: center;
  align-items: center;
`;

export const LogoImg = styled.img`
  width: 100%;
  max-width: 100px;
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
  display: flex;
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
