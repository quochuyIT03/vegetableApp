// Trong file style.js, bạn có thể thêm các style sau:
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  background: #f4f4f4;
  padding: 20px;
`

export const Section = styled.div`
  flex: 1;
  margin: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px;
`

export const Title = styled.h1`
  color: #333;
`

export const SectionTitle = styled.h2`
  color: #0056b3;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 0 auto;
  text-align: center;
`

export const InfoText = styled.p`
  margin: 10px 0;
`

export const OrderItem = styled.li`
  list-style: none;
`

export const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: red;
`

// Tiếp tục sử dụng các styled components này trong file React của bạn để áp dụng style.