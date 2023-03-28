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
  z-index: 99999;
  height: 100vh;
  background: #222222 !important;
`;
