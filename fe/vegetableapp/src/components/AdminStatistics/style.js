import styled from "styled-components";

export const AdminStatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 50px;
`;

export const ChartContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%; 
    max-width: 1000px;
    margin: 0 auto;
`;

export const ChartWrapper = styled.div`
    flex: 1; 
    margin: 0 10px; 
    background:#f0f0f0;
    align-content: center;
    border-radius: 10px;    
    
`;

export const UserInfo = styled.div`
  background: linear-gradient(130deg, #d279d9, #cbb4d5, #80c5da);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width:350px;
  height:200px;
  color: #fff3f3;
`;
export const UserInfo1 = styled.div`
  background: linear-gradient(130deg, #EECC51, #203c58);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width:350px;
  height:200px;
  color: #fff3f3;
`;
export const UserInfo2 = styled.div`
  background: linear-gradient(130deg, #05999E, #CBE7E3);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width:350px;
  height:200px;
  color: #fff3f3;
`;

export const AdminName = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
`;

export const CardText = styled.h6`
  color: #e2e8ec;
  font-weight: bold;
`;