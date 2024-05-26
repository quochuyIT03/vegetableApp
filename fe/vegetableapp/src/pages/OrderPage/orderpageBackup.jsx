/* eslint-disable jsx-a11y/alt-text */
import { Button, Checkbox, Form, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperLeft, WrapperListOrder, UploadOutlined, WrapperPriceDiscount, WrapperItemOrder, WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber, WrapperStyleHeaderDelivery } from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingCoponent/LoadingCoponent';
import { updateUser } from '../../redux/slides/userSlide'
import StepComponent from '../../components/StepComponent/StepComponent';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setstateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  ////////////////NHẤN CHỌN 1 SẢN PHẨM///////////////
  const onChange = (e) => {
    console.log(`checked = ${e.target.value}`);
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  console.log('listChecked', listChecked)

  ////////NHẤN CHỌN NHIỀU SẢN PHẨM////////////////
  const handleOnChangeCheckAll = (e) => {
    console.log('e.target', e.target.checked)
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  /////////THAY ĐỔI SỐ LƯỢNG SẢN PHẨM////////////
  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
    }
  }

  ////XÓA 1 SẢN PHẨM ĐƯỢC CHỌN//// 
  const handleDeleteOrder = (idProduct) => {
    dispatch(deleleOrderProduct({ idProduct }))
  }

  ////////xÓA NHIỀU SẢN PHẨM ĐƯỢC CHỌN////////
  const deleleAllOrderProduct = () => {
    if (listChecked?.length > 1) {
      dispatch(deleleManyOrderProduct({ listChecked }))
    }
  }
  /////////////////////SỬ LÝ SỰ KIỆN ONCLICK NÚT THANH TOÁN/////////////
  const handleAddCard = () => {
    console.log('user', user)
    if (!order?.orderItemsSelected?.length) {
      message.warning('Vui lòng chọn sản phẩm')
    } else if (!user?.name || !user?.address || !user?.phone || !user?.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    }
  }

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

  const { isLoading, data } = mutationUpdate

  const handleCancelUpdateInfo = () => {
    setstateUserDetails({
      name: '',
      email: '',
      phone: '',
      address: '',
      isAdmin: false,
      avatar: '',
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  console.log('data', data)

  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnChangeDetails = (e) => {
    console.log('check', e.target.name, e.target.value)
    setstateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  console.log('stateUserDetails', stateUserDetails)
  //////////////////////////////////////////////////////////////////
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  ///////////////////////////PHẦN SỬ DỤNG USEEFFECT/////
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [dispatch, listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setstateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo, user?.address, user?.city, user?.name, user?.phone])

  ////////////TÍNH TOÁN CÁC GIÁ TRỊ BẰNG USEMEMO////
  const priceMemo = useMemo(() => {
    const kq = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return kq
  }, [order])

  const PriceDiscountMemo = useMemo(() => {
    const kq = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount))
    }, 0)
    if (Number(kq)) {
      return kq
    }
    return 0
  }, [order])

  const shippingPriceMemo = useMemo(() => {
    if (priceMemo >= 100000 && priceMemo < 500000) {
      return 20000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 10000;
    }
  }, [priceMemo, order?.orderItemsSelected?.length]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(PriceDiscountMemo) + Number(shippingPriceMemo)
  }, [priceMemo, PriceDiscountMemo, shippingPriceMemo])

  const deliveryItems = [
    {
      title: '10.000 VND',
      description: 'Dưới 100.000 VND',
    },
    {
      title: '20.000 VND',
      description: 'Từ 100.000 VND đến 500.000 VND',
      subTitle: 'Left 00:00:08',
    },
    {
      title: '0 VND',
      description: 'Trên 500.000 VND',
    },
  ]
  const currentStep = useMemo(() => {
    if (order.orderItemsSelected.length === 0) {
      return 0;
    } else if (shippingPriceMemo === 10000) {
      return 0;
    } else if (shippingPriceMemo === 20000) {
      return 1;
    } else if (shippingPriceMemo === 0) {
      return 2;
    } else {
      return 0;
    }
  }, [order.orderItemsSelected.length, shippingPriceMemo]);
  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >

      <div style={{ margin: '0 auto', width: '1270px', height: '100%' }} >
        <h3> Giỏ hàng </h3>
        <div style={{ display: 'flex', justifyContent: 'center' }} >
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent items={deliveryItems} current={currentStep} />
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}  >
                <Checkbox onChange={handleOnChangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}  > </Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm) </span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <span>Đơn giá </span>
                <span>Số lượng </span>
                <span>Thành tiền </span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={deleleAllOrderProduct} />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder >
              {order?.orderItems?.map((order) => {
                console.log('map', order)
                return (
                  <WrapperItemOrder>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center' }} >
                      <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} ></Checkbox>
                      <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover', marginLeft: '30px' }} />
                      <div style={{
                        width: 260,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }} >{order?.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}> {fomatall(order?.price - ((order?.discount / 100) * order?.price))}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                        <WrapperInputNumber min={1} max={order?.countInStock} defaultValue={order?.amount} value={order?.amount} size="small" />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock, order?.amount === 1)} >
                          <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '14px' }} > {fomatall((order?.price - ((order?.discount / 100) * order?.price)) * order?.amount)} </span>
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
                    onClick={handleChangeAddress}
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
                    <span> {`${user?.address}, ${user?.city}`} </span>

                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Tạm tính</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(priceMemo)} </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Discount</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {PriceDiscountMemo}% </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Thuế (VAT)</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} >  <span style={{ color: 'red' }}></span> </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(shippingPriceMemo)} </span>
                </div>
              </WrapperInfo>
              <WrapperTotal >
                <span >Tổng tiền: </span>
                <span style={{ display: 'flex', flexDirection: 'column' }} >
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px' }} > {fomatall(totalPriceMemo)}  </span>
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
              onClick={() => handleAddCard()}
              textButton={'Thanh toán'}
            >
            </ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdateInfo} onOk={handleUpdateInfoUser} >
        {/* <Loading isLoading={isLoading}> */}
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 22 }}
          style={{ maxWidth: 600 }}
          form={form}
          // onFinish={onUpdateUser}
          autoComplete="on">
          <Form.Item
            label="User Name"
            name="name"
            rules={[{ required: true, message: 'Please input your user name!' }]}
          >
            <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <InputComponent value={stateUserDetails['phone']} onChange={handleOnChangeDetails} name="phone" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <InputComponent value={stateUserDetails['address']} onChange={handleOnChangeDetails} name="address" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <InputComponent value={stateUserDetails['city']} onChange={handleOnChangeDetails} name="city" />
          </Form.Item>
        </Form>
        {/* </Loading> */}
      </ModalComponent>
    </div>
  )
}

export default OrderPage
