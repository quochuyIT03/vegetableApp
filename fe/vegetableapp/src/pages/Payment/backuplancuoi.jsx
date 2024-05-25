/* eslint-disable jsx-a11y/alt-text */
import { Checkbox, Form, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperItemOrder, WrapperRight, WrapperInfoPaymentMethod, WrapperStyleHeader, WrapperTotal, WrapperInputNumber, WrapperInfoPayment } from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined, EditOutlined, TruckOutlined, RocketOutlined, EuroCircleOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct, orderSelect } from '../../redux/slides/orderSlide';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import * as OrderService from '../../services/OrderService'
import { useMutationHooks } from '../../hooks/useMutationHook'

const PaymentPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isShippingFee, setShippingFee] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
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

  //////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const storedCheckList = JSON.parse(localStorage.getItem('checkList'));
    if (storedCheckList) {
      setCheckList(storedCheckList);
    } else {
      selectAllItems();
    }
  }, []);

  const selectAllItems = () => {
    const allProductIds = order?.orderItems?.map((item) => item.product) || [];
    if (allProductIds.length > 0 && checkList.length === 0) {
      setCheckList(allProductIds);
      dispatch(orderSelect({ checkList: allProductIds }));
    }
  };

  // Use a flag to check if all products are deleted
  const allProductsDeleted = order?.orderItems.length === 0;

  useEffect(() => {
    // If all products are deleted, select all items
    if (allProductsDeleted) {
      selectAllItems();
    }

    localStorage.setItem('checkList', JSON.stringify(checkList));
  }, [checkList, allProductsDeleted]);

  const selectedItems = useMemo(() => {
    if (!order || !order.orderItems) return [];
    return order.orderItems.filter(item => checkList.includes(item.product));
  }, [order, checkList]);

  /////////////////////////////////////////////////////////////////////////

  //////////////////////////////////Tính toán các giá trị////////////////
  const subtotal = selectedItems.reduce((total, item) => total + (item.price - (item.price * (item.discount / 100))) * item.amount, 0);
  const discountPercent = selectedItems.reduce((total, item) => total + item.discount, 0);
  const discount = subtotal * (discountPercent / 100);
  const taxPercent = 3;
  const tax = subtotal * (taxPercent / 100);
  // const shippingFee = useMemo(() => {
  //   if (shippingMethod === 'standard') {
  //     return 10000;
  //   } else if (shippingMethod === 'express') {
  //     return 20000;
  //   }
  // }, [shippingMethod]);

  const handleShippingMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setShippingMethod(selectedMethod);
    if (selectedMethod === 'standard') {
      setShippingFee(10000);
    } else if (selectedMethod === 'express') {
      setShippingFee(20000);
    }
  };
  const total = subtotal + tax + isShippingFee - discount;
  /////////////////////////////////////////////////
  const handleEditAddress = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };
  const [form] = Form.useForm();
  /////////////////////////////////////////////
  const handlePayment = () => {
    if (checkList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm trước khi thanh toán.');
      return;
    }
    navigate('/payment');
  }
  ////////////////////////////////////////////////
  useEffect(() => {
    form.setFieldsValue({
      fullName: user.name,
      address: user.address,
      phone: user.phone
    });
  }, [form, user]);
  ///////////////////////////////////////////////////
  const mutationUpdate = useMutationHooks(
    (data) => {
      const {
        id,
        token,
        ...rests
      } = data
      const res = OrderService.createOrder(
        id,
        token,
        { ...rests },
        token
      )
      return res
    },
  )
  ////////////////////////////////////////////////////
  const mutationAddOrder = useMutationHooks(
    (data) => {
      console.log('data', data)
      const {
        token,
        ...rests
      } = data
      const res = OrderService.createOrder(
        token,
        { ...rests }
      )
      return res
    },
  )
  /////////////////////////////////////////////////

  // const handleShippingMethodChange = (event) => {
  //   const selectedMethod = event.target.value;
  //   setShippingMethod(selectedMethod);
  //   if (selectedMethod === 'standard') {
  //     setShippingFee(10000);
  //   } else if (selectedMethod === 'express') {
  //     setShippingFee(20000);
  //   }
  // };
  const { isLoading: isLoadingAddOrder } = mutationAddOrder
  const { isLoading, data } = mutationUpdate
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // const handleAddOrder = () => {

  //   // if (
  //   //   user?.access_token &&
  //   //   order?.orderSelect &&
  //   //   user?.name &&
  //   //   user?.address &&
  //   //   user?.phone &&
  //   //   user?.city &&
  //   //   subtotal &&
  //   //   user?.id
  //   // )
  //   {
  //     mutationAddOrder.mutate({

  //       token: user?.access_token,
  //       orderItems: order?.orderSelect,
  //       fullName: user?.name,
  //       address: user?.address,
  //       phone: user?.phone,
  //       city: user?.city,
  //       paymentMethod: shippingFee,
  //       shippingPrice: shippingFee,
  //       itemsPrice: subtotal,
  //       user: user?.id
  //     }, 
  //     {
  //       onSuccess: () => {
  //         message.success('Đặt hàng thành công');
  //       }
  //     });
  //   }
  // };
  const handleAddOrder = () => {
    const token = user?.access_token;
    const orderItems = order?.selectedItems;
    const fullName = user?.name;
    const address = user?.address;
    const phone = user?.phone;
    // const city = user?.city;
    const itemsPrice = subtotal;
    const userId = user?.id;
    const shippingPrice = order?.shippingPrice;

    console.log('Token:', token);
    console.log('Order Items:', orderItems);
    console.log('Full Name:', fullName);
    console.log('Address:', address);
    console.log('Phone:', phone);
    // console.log('City:', city);
    console.log('Payment Method:', paymentMethod);
    console.log('shippingPrice:', subtotal);
    console.log('Items Price:', itemsPrice);
    console.log('User ID:', userId);


    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderSelect,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      // city: user?.address,
      paymentMethod: paymentMethod,
      shippingPrice: subtotal,
      itemsPrice: subtotal,
      user: user?.id
    }, {
      onSuccess: () => {
        message.success('Đặt hàng thành công');
      },
      onError: (error) => {
        message.error(`Đặt hàng thất bại: ${error.message}`);
      }
    });
  };

  const handlePlaceOrder = () => {
    if (!shippingMethod || !paymentMethod) {
      message.warning('Vui lòng chọn phương thức vận chuyển và phương thức thanh toán trước khi đặt hàng.');
    } else {

      handleAddOrder()
    }
  };
  console.log('order', order, user)

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }} >
      <div style={{ margin: '0 auto', width: '1270px', height: '100%' }} >
        <h3> Phương thức thanh toán </h3>
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
                  <span style={{ color: '#000', fontSize: '18px' }}> {fomatall(10000)} </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="shippingMethod" value="express" onChange={handleShippingMethodChange} />
                  <RocketOutlined style={{ marginLeft: '10px', marginRight: '10px', fontSize: '24px' }} />
                  <span style={{ color: '#d57628d9', fontSize: '18px', fontWeight: 'bold', marginRight: '53px' }}>Flash</span>
                  <span style={{ color: '#000', fontSize: '18px', marginRight: '20px' }}>Giao hàng nhanh</span>
                  <span style={{ color: '#000', fontSize: '18px' }}>{fomatall(20000)}</span>
                </div>
              </div>
            </WrapperInfoPayment>

            <WrapperInfoPaymentMethod>
              <div style={{ marginRight: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px' }} >
                  <span style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Phương thức thanh toán</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="radio" name="paymentMethod" value="direct-cash" onChange={handlePaymentMethodChange} />
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
                    onClick={handleEditAddress}
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
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {`${fomatall(isShippingFee)}`} </span>
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
              onClick={handleAddOrder}
              textButton={'Đặt hàng'}
            >
            </ButtonComponent>
          </WrapperRight>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

