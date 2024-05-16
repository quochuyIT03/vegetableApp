/* eslint-disable jsx-a11y/alt-text */
import { Checkbox } from 'antd';
import React, { useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperItemOrder , WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber  } from './style'
import {DeleteOutlined , MinusOutlined , PlusOutlined } from '@ant-design/icons';
import { fomatall } from '../../fomatall';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct  } from '../../redux/slides/orderSlide';

const OrderPage = ({count=1}) => {
  const order = useSelector((state) => state.order)
  const dispatch = useDispatch()
  const [checkList, setCheckList] = useState([])
  const onChange = (e) => {
    if(checkList.includes(e.target.value)) {
      const newCheckList = checkList.filter((item) => item !== e.target.value  )
      setCheckList(newCheckList)
    }else {
      setCheckList([...checkList, e.target.value])
    }
  
  }; 
  /////////////////////////////////////////////////
const handleChangeCount = (type, idProduct) => {
  if(type === 'increase')
    {
      dispatch(increaseAmount({idProduct}))
    }else {
       dispatch(decreaseAmount({idProduct}))
    }
  
}
/////////////////////////////////////////////////
const handleOnChangeCheckAll = (e) => {
    if(e.target.checked){
      const newCheckList = []
      order?.orderItems?.forEach((item) => {
        newCheckList.push(item?.product)
      })
      setCheckList(newCheckList)
    }else{
      setCheckList([])
    }
}
const handleDeleteOrder = (idProduct) => {  
  dispatch(deleleOrderProduct({idProduct}))

}

const handleDeleteManyOrder = () => {
  if(checkList?.length > 1){
    dispatch(deleleManyOrderProduct({checkList}))
  }
  
}
//////////////////////////////////////////////////////////////////////////
// const discountPercent = useMemo(() => {
//   const rs = order?.orderItems?.reduce((total, cur) => {
//     return total + cur.discount; // Tính tổng giá trị giảm giá của tất cả sản phẩm
//   }, 1);
//   if(Number(rs)){
//     return rs
//   }
// }, [order]);
// const discount = useMemo(() => {
//   const rs = order?.orderItems?.reduce((total, cur) => {
//     return total + ((cur.discount * cur.amount)); // Tính tổng giá trị giảm giá của tất cả sản phẩm
//   }, 1);
//   if(Number(rs)){
//     return rs
//   }
// }, [order]);


/////////////////////////////////////////////////////////////////////////

//////////////////////////////////Tính toán các giá trị////////////////
const subtotal = order.orderItems.reduce((total, item) => total + (item.price - (item.price * (item.discount / 100))) * item.amount, 0); // Số tiền tạm tính ban đầu
 // Số tiền tạm tính ban đầu
  const discountPercent = order.orderItems.reduce((total, item) => total + item.discount, 0);  //Phần trăm giảm giá
  const discount = subtotal * (discountPercent / 100);// Số tiền giảm giá 
  const taxPercent = 3; 
  const tax = subtotal * (taxPercent / 100); // Số tiền thuế
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shippingFee = useMemo(() => {
    if (subtotal >= 150000) {
        return 20000;
    } else if (subtotal <= 0) {
        return 0;
    } else {
        return 10000;
    }
}, [subtotal]); 

  const total = subtotal + tax + shippingFee - discount; // Tổng tiền
////////////////////////////////////////////////
  return (
    <div style={{ background: '#f5f5fa', width:'100%', height: '100vh' }} >

     <div style={{ margin: '0 auto', width:'1270px', height: '100%' }} >
      <h3> Giỏ hàng </h3>

        <div style={{ display: 'flex', justifyContent: 'center' }} >

          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={ { display: 'inline-block', width: '390px' } }  >
                <Checkbox onChange={handleOnChangeCheckAll} checked={checkList?.length === order?.orderItems?.length}> </Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm) </span>
              </span>
              <div style={{ flex:1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <span>Đơn giá </span>
                <span>Số lượng </span>
                <span>Thành tiền </span>
                <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleDeleteManyOrder} />
              </div>
            </WrapperStyleHeader>
            
            <WrapperListOrder >
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder>
                <div style={{ width: '390px', display:'flex', alignItems:'center'}} >
                  <Checkbox onChange={onChange} value={order?.product} checked={checkList.includes(order?.product)}></Checkbox>
                  <img src={order.image} style={{ width: '77px', height: '79px', objectFit:'cover', marginLeft:'30px' }} /> 
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap'
                  }} >{order?.name}</div>
                </div>
                <div style={{  flex:1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <span>
                    <span style={{fontSize:'13px', color:'#242424' }}> {fomatall( order.price - ((order?.discount /100) * order.price))}</span>
                    <WrapperPriceDiscount>
                    {fomatall(order.price)}
                    </WrapperPriceDiscount>
                </span>
                  <WrapperCountOrder>
                  <button style={{border: 'none', background: 'transparent', cursor: 'pointer' }}  onClick={() => handleChangeCount('decrease', order?.product)}>
                    <MinusOutlined style = {{color: '#000', fontSize:'20px'}} />
                  </button>
                    <WrapperInputNumber min={1} max={10} defaultValue={order?.amount} value={order?.amount} size="small" />              
                  <button style={{border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)} >
                    <PlusOutlined  style = {{color: '#000', fontSize:'20px'}} />
                  </button>
                  </WrapperCountOrder>
                  <span style={{ color: 'rgb(255, 66, 78)', fontSize: '14px' }} > {fomatall(( order.price - ((order?.discount /100) * order.price)) * order?.amount)} </span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)} />
                  </div>
               
                </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
            
          </WrapperLeft>

          <WrapperRight>

            <div style={{ width: '100%' , fontWeight:'400'}} >
              <WrapperInfo>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }} >
                  <span>Tạm tính</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(subtotal)} </span>
                </div>  
                {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }} >
                  <span>Giảm giá</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {`${fomatall(discount)}`}  <span style={{ color: 'red' }}>({discountPercent}) </span></span>
                </div> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }} >
                  <span>Thuế (VAT)</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {fomatall(tax)}  <span style={{ color: 'red' }}>({taxPercent}%)</span> </span>
                </div>  
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }} >
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {`${fomatall(shippingFee)}`} </span>
                </div> 
              </WrapperInfo>
              <WrapperTotal >
                <span >Tổng tiền: </span>
                <span style={{display: 'flex', flexDirection:'column' }} > 
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
              textButton = {'Thanh toán'}
            >


            </ButtonComponent>


          </WrapperRight>


        </div>

     </div>

    </div>
  )
}

export default OrderPage
