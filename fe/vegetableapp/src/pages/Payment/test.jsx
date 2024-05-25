import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Container, Title, Section, SectionTitle, InfoText, OrderItem, TotalAmount } from './style1';
import { fomatall } from '../../fomatall';

const PaymentPage = () => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const calculateTotalAmount = useMemo(() => {
    if (!order || !order.orderItems || order.orderItems.length === 0) {
      return 0;
    }

    const subtotal = order.orderItems.reduce((total, item) => {
      const itemPriceAfterDiscount = item.discount ? item.price - (item.price * (item.discount / 100)) : item.price;
      return total + (itemPriceAfterDiscount * item.amount);
    }, 0);

    const taxPercent = 3;
    const tax = subtotal * (taxPercent / 100);

    const shippingFee = subtotal >= 150000 ? 20000 : subtotal > 0 ? 10000 : 0;

    return subtotal + tax + shippingFee;
  }, [order]);
  

  return (
    <Container>
      <Title>Thanh toán</Title>
      <Section>
        <SectionTitle>Thông tin giao hàng</SectionTitle>
        <InfoText><strong>Họ và tên:</strong> {user.name}</InfoText>
        <InfoText><strong>Địa chỉ:</strong> {user.address}</InfoText>
        <InfoText><strong>Thành phố:</strong> {order.city}</InfoText>
        <InfoText><strong>Số điện thoại:</strong> {user.phone}</InfoText>
      </Section>
      <Section>
        <SectionTitle>Chi tiết đơn hàng</SectionTitle>
        <ul>
          {order.orderItems.map((item) => (
            <OrderItem key={item.product}>
              <InfoText><strong>Tên sản phẩm:</strong> {item.name}</InfoText>
              <InfoText><strong>Giá:</strong> {item.price}</InfoText>
              <InfoText><strong>Số lượng:</strong> {item.amount}</InfoText>
            </OrderItem>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionTitle>Tổng số tiền cần thanh toán:</SectionTitle>
        <TotalAmount>{`${fomatall(calculateTotalAmount)}`} </TotalAmount>
      </Section>
    </Container>
  );
};

export default PaymentPage;