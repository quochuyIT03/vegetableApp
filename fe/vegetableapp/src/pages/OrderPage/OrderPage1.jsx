/* eslint-disable jsx-a11y/alt-text */
import { Button, Checkbox, Form, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperLeft, WrapperListOrder, UploadOutlined, WrapperPriceDiscount, WrapperItemOrder, WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber } from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct, orderSelect } from '../../redux/slides/orderSlide';
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';

const OrderPage = ({ count = 1 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const order = useSelector((state) => state.order)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [checkList, setCheckList] = useState([])
    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const onChange = (e) => {
        if (checkList.includes(e.target.value)) {
            const newCheckList = checkList.filter((item) => item !== e.target.value)
            setCheckList(newCheckList)
        } else {
            setCheckList([...checkList, e.target.value])
        }
    };
    ///////////////////////////////////////////////////
    const user = useSelector((state) => state.user);
    /////////////////////////////////////////////////
    const handleChangeCount = (type, idProduct) => {
        if (type === 'increase') {
            dispatch(increaseAmount({ idProduct }))
        } else {
            dispatch(decreaseAmount({ idProduct }))
        }
    }
    /////////////////////////////////////////////////
    const handleOnChangeCheckAll = (e) => {
        if (e.target.checked) {
            const newCheckList = []
            order?.orderItems?.forEach((item) => {
                newCheckList.push(item?.product)
            })
            setCheckList(newCheckList)
        } else {
            setCheckList([])
        }
    }
    const handleDeleteOrder = (idProduct) => {
        dispatch(deleleOrderProduct({ idProduct }))
    }

    const handleDeleteManyOrder = () => {
        if (checkList?.length > 1) {
            dispatch(deleleManyOrderProduct({ checkList }))
        }
    }

    const selectedItems = useMemo(() => {
        if (!order || !order.orderItems) return [];
        return order.orderItems.filter(item => checkList.includes(item.product));
    }, [order, checkList]);

    //////////////////////////////////////////////////////////////////////////
    // useEffect(() => {
    //   const storedCheckList = JSON.parse(localStorage.getItem('checkList'));
    //   if (storedCheckList) {
    //     setCheckList(storedCheckList);
    //   } else {
    //     selectAllItems();
    //   }
    // }, []);

    // const selectAllItems = () => {
    //   const allProductIds = order?.orderItems?.map((item) => item.product) || [];
    //   if (allProductIds.length > 0 && checkList.length === 0) {
    //     setCheckList(allProductIds);
    //     dispatch(orderSelect({ checkList: allProductIds }));
    //   }
    // };

    /////////////////////////////////////////////////////////////////////////
    const [stateUserDetails, setStateUserDetails] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    })

    const onUpdateUser = async () => {
        try {
            const data = await mutationUpdate.mutateAsync({ id: user?.id, token: user?.access_token, ...stateUserDetails });
            if (data) {
                message.success('Sửa thông tin thành công');
                setVisibleDrawer(false);

            } else {
                message.error('Sửa thông tin không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            message.error('Đã xảy ra lỗi khi cập nhật thông tin');
        }
    }
    /////////////////////////////////////////////////////////////
    const mutationUpdate = useMutationHooks(
        (data) => {
            console.log('data', data)
            const {
                id,
                token,
                ...rests
            } = data
            const res = UserService.updateUser(
                id,
                { ...rests },
                token,
            )
            return res
        },
    )

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    //////////////////////////////////Tính toán các giá trị////////////////
    const subtotal = selectedItems.reduce((total, item) => total + (item.price - (item.price * (item.discount / 100))) * item.amount, 0);
    // const discountPercent = selectedItems.reduce((total, item) => total + item.discount, 0);
    // const discount = subtotal * (discountPercent / 100);
    const taxPercent = 3;
    const tax = subtotal * (taxPercent / 100);
    const shippingFee = useMemo(() => {
        if (subtotal >= 150000) {
            return 20000;
        } else if (subtotal <= 0) {
            return 0;
        } else {
            return 10000;
        }
    }, [subtotal]);
    const total = subtotal + tax + shippingFee;
    /////////////////////////////////////////////////
    const [form] = Form.useForm();
    /////////////////////////////////////////////

    const handlePayment = () => {
        if (checkList.length === 0) {
            // Nếu danh sách sản phẩm chọn rỗng, hiển thị thông báo và không chuyển trang
            message.warning('Vui lòng chọn ít nhất một sản phẩm trước khi thanh toán.');
            return;
        }
        // Chuyển đến trang PaymentPage và truyền danh sách sản phẩm đã chọn dưới dạng state
        navigate('/payment', { state: { selectedItems: checkList } });
    };

    ////////////////////////////////////////////////


    useEffect(() => {
        form.setFieldsValue({
            name: stateUserDetails.name,
            address: stateUserDetails.address,
            phone: stateUserDetails.phone
        });
    }, [form, stateUserDetails]);
    /////////////////////////////////////

    ////////////////////////////////
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const handleDetailsUser = () => {
        setVisibleDrawer(true);
    }
    const handleCancel = () => {
        setVisibleDrawer(false);
    }
    ////////////////////////////////////////

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >
            <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={visibleDrawer} onCancel={handleCancel} okButtonProps={{ display: 'none' }} footer={null} >
                {/* <Loading isLoading={isLoading}> */}
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    form={form}
                    onFinish={onUpdateUser}
                    autoComplete="off">

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update User
                        </Button>
                    </Form.Item>

                </Form>
                {/* </Loading> */}
            </ModalComponent>

            <div style={{ margin: '0 auto', width: '1270px', height: '100%' }} >
                <h3> Giỏ hàng </h3>
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <WrapperLeft>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}  >
                                <Checkbox onChange={handleOnChangeCheckAll} checked={checkList?.length === order?.orderItems?.length}> </Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm) </span>
                            </span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                <span>Đơn giá </span>
                                <span>Số lượng </span>
                                <span>Thành tiền </span>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleDeleteManyOrder} />
                            </div>
                        </WrapperStyleHeader>

                        <WrapperListOrder >
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center' }} >
                                            <Checkbox onChange={onChange} value={order?.product} checked={checkList.includes(order?.product)}></Checkbox>
                                            <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover', marginLeft: '30px' }} />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }} >{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}> {fomatall(order.price - ((order?.discount / 100) * order.price))}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                                </button>
                                                <WrapperInputNumber min={1} max={10} defaultValue={order?.amount} value={order?.amount} size="small" />
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)} >
                                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '14px' }} > {fomatall((order.price - ((order?.discount / 100) * order.price)) * order?.amount)} </span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%', fontWeight: '400' }} >
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                                    <span style={{ whiteSpace: 'nowrap' }}>Giao đến:</span>
                                    <span
                                        onClick={handleDetailsUser}
                                        style={{
                                            marginLeft: '10px',
                                            color: '#1890ff',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            whiteSpace: 'wrap',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <EditOutlined style={{ marginLeft: '5px' }} />
                                        {user.address}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(subtotal)} </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <span>Thuế (VAT)</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(tax)}  <span style={{ color: 'red' }}>({taxPercent}%)</span> </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {`${fomatall(shippingFee)}`} </span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal >
                                <span >Tổng tiền: </span>
                                <span style={{ display: 'flex', flexDirection: 'column' }} >
                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px' }} > {fomatall(total)}  </span>
                                    <span style={{ color: '#000', fontSize: '14px' }} > (Đã bao gồm thuế) </span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#d144bd',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '20px',
                            }}
                            onClick={handlePayment}
                            textButton={'Thanh toán'}
                        >
                        </ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
        </div>
    )
}

export default OrderPage
