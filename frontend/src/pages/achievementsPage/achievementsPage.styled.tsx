import { Col, Row } from "antd";
import styled from "styled-components";

export const AchievementsWrapper = styled(Col)`
    width: 250px;
    max-width: 250px;
`

export const CustomRow = styled(Row)`
width: 100%;
margin: auto;
gap: 40px;
max-width: 830px;
@media (max-width: 861px) {
    max-width: 540px;
}
@media (max-width: 768px) {
    max-width: 250px;
}
`

export const AchievementsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`