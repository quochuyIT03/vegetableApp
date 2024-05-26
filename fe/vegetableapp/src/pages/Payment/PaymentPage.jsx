/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Form, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperInfo, WrapperLeft, WrapperRight, WrapperTotal, WrapperInfoPayment, WrapperInfoPaymentMethod } from './style'
import { increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { EditOutlined, TruckOutlined, RocketOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import InputComponent from '../../components/InputComponent/InputComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const [payment, setPayment] = useState('');
  const [delivery, setDelivery] = useState('');
  const user = useSelector((state) => state.user)
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)
  const [stateUserDetails, setstateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const dispatch = useDispatch()
  const [form] = Form.useForm();


  /////////////////////SỬ LÝ SỰ KIỆN ONCLICK NÚT THANH TOÁN/////////////
  const handleAddOrder = () => {
    if (user?.access_token && order?.orderItemsSelected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: shippingPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email
        }
      )
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

  const mutationAddOrder = useMutationHooks(
    (data) => {
      console.log('data', data)
      const {
        token,
        ...rests
      } = data
      const res = OrderService.createOrder(
        { ...rests },
        token,
      )
      return res
    },
  )


  const { isLoading, data } = mutationUpdate
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrOrdered = []
      order?.orderItemsSelected?.forEach(element => {
        arrOrdered.push(element.product)
      });
      dispatch(deleleManyOrderProduct({ listChecked: arrOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/paymentSuccess', {
        state: {
          delivery,
          payment,
          order: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError, dataAdd])

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

  const handlePaymentMethodChange = (e) => {
    setPayment(e.target.value);
  }

  const handleShippingMethodChange = (e) => {
    setDelivery(e.target.value)
  }

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      {
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: shippingPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid: details.update_time
      }
    )
    console.log('details, data', details, data)
  }

  ///////////////////////////PHẦN SỬ DỤNG USEEFFECT/////

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
    let shippingPrice = 10000; // Giá mặc định

    if (priceMemo > 100000) {
      shippingPrice = 20000; // Nếu giá trị đơn hàng lớn hơn 100000 thì phí là 20000
    }

    if (delivery === 'standard') {
      shippingPrice -= 5000; // Giảm 5000 nếu chọn phương thức giao hàng tiêu chuẩn
    }

    return priceMemo === 0 ? 0 : shippingPrice; // Nếu không có sản phẩm nào thì phí giao hàng là 0
  }, [priceMemo, delivery]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(PriceDiscountMemo) + Number(shippingPriceMemo)
  }, [priceMemo, PriceDiscountMemo, shippingPriceMemo])
  /////////////////////////////////////////////////////////////////////////////////////////
  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }

  }, [])

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >

      <div style={{ margin: '0 auto', width: '1270px', height: '100%' }} >
        <h3> Thanh toán </h3>
        <div style={{ display: 'flex', justifyContent: 'center' }} >
          <WrapperLeft>
            <WrapperInfoPayment>
              <div style={{ marginRight: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px' }} >
                  <span style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Vận chuyển</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="shippingMethod" value="standard" onChange={handleShippingMethodChange} />
                  <TruckOutlined style={{ marginLeft: '10px', marginRight: '10px', fontSize: '24px' }} />
                  <span style={{ color: '#d57628d9', fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>Standard</span>
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px' }}>Giao hàng bình thường</span>
                  <span style={{ color: '#000', fontSize: '18px' }}>  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="shippingMethod" value="express" onChange={handleShippingMethodChange} />
                  <RocketOutlined style={{ marginLeft: '10px', marginRight: '10px', fontSize: '24px' }} />
                  <span style={{ color: '#d57628d9', fontSize: '18px', fontWeight: 'bold', marginRight: '53px' }}>Flash</span>
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px' }}>Giao hàng nhanh</span>
                  <span style={{ color: '#000', fontSize: '18px' }}></span>
                </div>
              </div>
            </WrapperInfoPayment>

            <WrapperInfoPaymentMethod>
              <div style={{ marginRight: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px' }} >
                  <span style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Phương thức thanh toán</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="paymentMethod" value="directCash" onChange={handlePaymentMethodChange} />
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px', marginLeft: '20px' }}>Thanh toán tiền mặt khi nhận hàng</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="paymentMethod" value="paypal" onChange={handlePaymentMethodChange} />
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px', marginLeft: '20px' }}>Thanh toán qua PayPal</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" style={{ width: '40px', height: '40px', marginRight: '10px', marginLeft: '10px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="paymentMethod" value="zalopay" onChange={handlePaymentMethodChange} />
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px', marginLeft: '20px' }}>Thanh toán qua ZaloPay</span>
                  <img src="https://payos.vn/docs/img/logo.svg" alt="ZaloPay" style={{ width: '40px', height: '40px', marginRight: '10px', marginLeft: '10px' }} />
                </div>
              </div>
            </WrapperInfoPaymentMethod>
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
            {payment === 'paypal' && sdkReady ? (
              <div>
                <PayPalButton
                  amount={Math.round(totalPriceMemo / 25000)}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    alert("Thanh toán không thành công, vui lòng chọn phương thức thanh toán khác!")
                  }}
                />
              </div>
            ) : (
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
                onClick={() => handleAddOrder()}
                textButton={'Đặt hàng'}
              >
              </ButtonComponent>
            )}

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

export default PaymentPage
