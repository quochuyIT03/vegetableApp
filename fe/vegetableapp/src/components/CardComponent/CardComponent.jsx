import { Image } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import {
    StarFilled
   
  } from '@ant-design/icons';
import logo from '../../assets/images/abcs.png'
import { useNavigate } from 'react-router-dom';


const CardComponent = (props) => {
  const {name, price, image, description, countInStock, rating, type, sale, discount, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
    hoverable
    styles={{
      header: {
        width: '200px',
        height: '200px',
      },
      body: {
        padding: '10px',
      },
    }}
    style={{
      width: 210,
    }}
    cover={<img alt="example" src={image} />}
    onClick={() => handleDetailsProduct(id)}
  >
    <Image preview ={false} src= {logo} style={{width: '68px', height: '14px'}}/>
    <StyleNameProduct>{name}</StyleNameProduct>
    <WrapperReporText> 
    <span style={{marginRight: '4px'}}>
        <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>     
    </span>
    <WrapperStyleTextSell> | Đã bán {sale || 500}+ </WrapperStyleTextSell>
   
    </WrapperReporText>
    <WrapperPriceText> 
      <span style={{marginRight: '8px'}}>{price.toLocaleString('vi',{style : 'currency', currency :'VND'})} </span>
      <WrapperPriceDiscountText>
       -{discount || 10 }%
    </WrapperPriceDiscountText>

    </WrapperPriceText>
    
  </WrapperCardStyle>
  )
}

export default CardComponent
