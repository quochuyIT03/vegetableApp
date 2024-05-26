/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingCoponent/LoadingCoponent';
import { WrapperContainer, WrapperInfo, WrapperItemOrder, WrapperListOrder } from './style';
import { Button, message } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { fomatall } from '../../fomatall';
import { useMutationHooks } from '../../hooks/useMutationHook';

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  console.log('location', location)
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token,
  });
  const { isLoading, data } = queryOrder
  const renderProduct = (data) => {
    return data?.map((order) => {
      return <div style={{ width: '390px', display: 'flex', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #919191' }} >
        <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover', marginLeft: '30px' }} />
        <div style={{
          width: 260,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }} >{order?.name}</div>
        <span style={{ color: '#151515' }} > {fomatall(order?.price)} </span>
      </div>
    })
  }

  const handleViewOrderDetails = (id) => {
    navigate(`/order-details/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems } = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCancelOrderDetails = (order) => {
    mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems }, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if (isErrorCancel) {
      message.error()
    }
  }, [isErrorCancel, isSuccessCancel])

  return (
    // <Loading isLoading={isLoading || isLoadingCancel}>
    <WrapperContainer>

      <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >
        <h4>Đơn hàng của tôi</h4>
        <WrapperListOrder>
          {data?.map((order) => {
            return (
              <WrapperItemOrder key={order?._id} >
                <WrapperInfo>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }} >Trạng thái</span>
                  <div><span style={{ color: 'rgb(255, 66, 78)' }} >Giao hàng:</span> {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao'}`} </div>
                  <div><span style={{ color: 'rgb(255, 66, 78)' }} >Thanh toán:</span> {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`} </div>
                  <WrapperItemOrder>
                    {renderProduct(order?.orderItems)}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }} >
                      <span>
                        <span style={{ fontSize: '17px', color: '#242424' }}> Tổng tiền: {fomatall(order?.totalPrice)} </span>
                      </span>
                    </div>
                  </WrapperItemOrder>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                    <ButtonComponent
                      size={40}
                      styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '200px',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '20px',
                        marginTop: '20px',
                      }}
                      onClick={() => handleCancelOrderDetails(order)}
                      textButton={'Hủy đơn hàng'}
                      styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    >

                    </ButtonComponent>
                    <ButtonComponent
                      size={40}
                      styleButton={{
                        background: '#84d5de',
                        height: '48px',
                        width: '200px',
                        border: 'none',
                        borderRadius: '4px',
                        marginTop: '20px',
                      }}
                      onClick={() => handleViewOrderDetails(order?._id)}
                      textButton={'Xem chi tiết'}
                      styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    >

                    </ButtonComponent>
                  </div>
                </WrapperInfo>

              </WrapperItemOrder>

            )
          })}
        </WrapperListOrder>


      </div>
    </WrapperContainer>
    // </Loading>

  )
}

export default MyOrderPage