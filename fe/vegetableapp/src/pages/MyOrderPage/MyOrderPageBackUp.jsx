/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingCoponent/LoadingCoponent';
import { WrapperContainer, WrapperInfo, WrapperItemOrder, WrapperListOrder } from './style';
import { Button } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation } from 'react-router-dom';

const MyOrderPage = () => {
    const location = useLocation()
    const { state } = location
    console.log('location', location)
    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderbyUserId(state?.id, state?.access_token)
        return res.data
    }

    const { isLoading, data } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!state?.id && !!state?.token,
    });

    return (
        <Loading isLoading={isLoading}>
            <WrapperContainer>
                <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.map((list) => {
                            return list?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?._id} >
                                        <WrapperInfo>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }} >Trạng thái</span>
                                            <div><span style={{ color: 'rgb(255, 66, 78)' }} >Giao hàng:</span> {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao'}`} </div>
                                            <div><span style={{ color: 'rgb(255, 66, 78)' }} >Thanh toán:</span> {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`} </div>
                                            <WrapperItemOrder>
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
                                                    <span>
                                                        <span style={{ fontSize: '13px', color: '#242424' }}> Tổng tiền: {order?.price * order?.amount} </span>
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
                                                    // onClick={handleAddOrderProduct}
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
                                                    // onClick={handleAddOrderProduct}
                                                    textButton={'Xem chi tiết'}
                                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                >
                                                </ButtonComponent>
                                            </div>
                                        </WrapperInfo>
                                    </WrapperItemOrder>
                                )
                            })
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>

    )
}

export default MyOrderPage
