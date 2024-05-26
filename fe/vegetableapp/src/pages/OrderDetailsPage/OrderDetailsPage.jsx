/* eslint-disable jsx-a11y/alt-text */
import { Image } from 'antd';
import React, { useMemo, useState } from 'react';
import { WrapperInfo, HeaderContent, WrapperStyleHeader, WrapperItem, WrapperItemOrderLabel, WrapperLable } from './style';
import { fomatall } from '../../fomatall';
import * as OrderService from '../../services/OrderService';
import { useLocation, useParams } from 'react-router-dom';
import { WrapperHeader } from '../Profile/style';
import { WrapperContainer } from '../MyOrderPage/style';
import { WrapperProduct, WrapperProductDetails, } from './style';
import { useQuery } from '@tanstack/react-query';
import { orderContant } from '../../contant';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingCoponent/LoadingCoponent';

const OrderDetailsPage = () => {
  const user = useSelector((state) => state.user)
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params
  console.log('params', params)
  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const { isLoading, data } = useQuery({
    queryKey: ['order-details'],
    queryFn: fetchDetailsOrder,
    enabled: !!id,
  });
  console.log('dataaaa', data)

  const priceMemo = useMemo(() => {
    const kq = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return kq
  }, [data])


  return (
    <Loading isLoading={isLoading}>
      <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', padding: '20px 0' }}>
        <div style={{ margin: '0 auto', width: '80%', maxWidth: '1270px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Chi tiết đơn hàng</h3>
          <WrapperHeader>
            <WrapperInfo>
              <WrapperContainer>Địa chỉ người nhận</WrapperContainer>
              <WrapperLable>
                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                <div className='address-info'><span>Địa chỉ:</span> {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.city} `} </div>
                <div className='phone-info'><span>Điện thoại:</span> {data?.shippingAddress?.phone}</div>
              </WrapperLable>
            </WrapperInfo>

            <WrapperInfo>
              <WrapperContainer>Hình thức giao hàng</WrapperContainer>
              <WrapperLable>
                <div className='delivery-info'><span className='name-delivery'>Giao hàng:</span> Giao hàng bình thường</div>
                <div className='delivery-fee'><span>Phí giao hàng:</span> {data?.shippingPrice}</div>
              </WrapperLable>
            </WrapperInfo>

            <WrapperInfo>
              <WrapperContainer>Hình thức thanh toán</WrapperContainer>
              <WrapperLable>
                <div className='payment-info'> {orderContant.payment[data?.paymentMethod]} </div>
                <div className='status-payment'> {data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
              </WrapperLable>
            </WrapperInfo>
          </WrapperHeader>

          <WrapperStyleHeader>
            <HeaderContent>
              <div className='product-title'>Sản phẩm</div>
              <WrapperLable>Giá</WrapperLable>
              <WrapperLable>Số lượng</WrapperLable>
              <WrapperLable>Giảm giá</WrapperLable>
            </HeaderContent>
          </WrapperStyleHeader>

          {data?.orderItems?.map((order) => {
            return (
              <WrapperProduct>
                <WrapperProductDetails>
                  <Image src={order?.image}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{
                    // width: 260,
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis',
                    // whiteSpace: 'nowrap',
                    // marginLeft: '10px',
                    // height: '70px',
                  }}
                  >Rau</div>
                </WrapperProductDetails>

                <WrapperItem> {order?.price} </WrapperItem>
                <WrapperItem> {order?.amount} </WrapperItem>
                <WrapperItem> {order?.discount ? fomatall(priceMemo * order?.discount / 100) : 0} </WrapperItem>
                {/* <WrapperItem> {order?.amount}</WrapperItem> */}

              </WrapperProduct>
            )
          })}
          <WrapperItemOrderLabel>Phí vận chuyển: <span style={{ fontWeight: 'lighter', color: 'black' }}> {fomatall(data?.shippingPrice)}</span></WrapperItemOrderLabel>
          <div>
            <WrapperItemOrderLabel>Tạm tính: <span style={{ fontWeight: 'lighter', color: 'black' }} >{fomatall(priceMemo)}</span> </WrapperItemOrderLabel>
          </div>
          <WrapperItemOrderLabel>Tổng cộng: <span style={{ fontWeight: 'lighter', color: 'black' }} > {fomatall(data?.totalPrice)}</span> </WrapperItemOrderLabel>


        </div>
      </div>
    </Loading>

  );
}

export default OrderDetailsPage;
