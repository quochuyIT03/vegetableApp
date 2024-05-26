/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { WrapperValue, WrapperInfoPayment, WrapperInfoPaymentMethod, WrapperInfo, WrapperItemOrder, WrapperInfoOrderItems } from './style'
import { EditOutlined, TruckOutlined, RocketOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';


const PaymentSuccess = () => {
  const order = useSelector((state) => state.order)
  const location = useLocation()
  const { state } = location
  console.log('location', location)


  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >

      <div style={{ margin: '0 auto', width: '1270px', height: '100%' }} >
        <h3> Đơn hàng đặt thành công </h3>
        <div style={{ justifyContent: 'center' }} >
          <WrapperInfoPayment>
            <div style={{ marginRight: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }} >
                <span style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Vận chuyển</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

                <div>
                  <WrapperValue>
                    <TruckOutlined style={{ marginLeft: '10px', marginRight: '10px', fontSize: '24px' }} />

                    <span style={{ color: '#000', fontSize: '18px', marginRight: '20px' }}> {orderContant.delivery[state?.delivery]}</span>
                    <span style={{ color: '#000', fontSize: '18px' }}>  </span>
                  </WrapperValue>
                </div>
              </div>

            </div>
          </WrapperInfoPayment>

          <WrapperInfoPaymentMethod>
            <div style={{ marginRight: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }} >
                <span style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Phương thức thanh toán</span>
              </div>

              <WrapperValue>
                {orderContant.payment[state?.payment]}
              </WrapperValue>

            </div>
          </WrapperInfoPaymentMethod>
          <WrapperInfoOrderItems>
            {state.order?.map((order) => {
              return (
                <WrapperItemOrder key={order?.name}>
                  <div style={{ width: '390px', display: 'flex', alignItems: 'center' }} >
                    <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover', marginLeft: '30px' }} />
                    <div style={{
                      width: 260,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }} >{order?.name}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }} >
                    <span>
                      <span style={{ fontSize: '13px', color: '#242424' }}> Giá tiền {order?.price} </span>
                    </span>
                    <span>
                      <span style={{ fontSize: '13px', color: '#242424' }}> Số lượng: {order?.amount} </span>
                    </span>

                  </div>
                </WrapperItemOrder>
              )
            })}

          </WrapperInfoOrderItems>
          <div>
            <span style={{ fontSize: '13px', color: '#242424' }}> Tổng tiền: {state?.totalPriceMemo} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
