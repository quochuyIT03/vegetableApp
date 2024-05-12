import { Image } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import {
    StarFilled
   
  } from '@ant-design/icons';
import logo from '../../assets/images/abcs.png'
import img1 from '../../assets/images/bok_choy.jpg'

const CardComponent = () => {
  return (
    <WrapperCardStyle
    hoverable
    headStyle={{width: '200px', 
        height: '200px'
    }}
    style={{
      width: 210,
      
    }}
    bodyStyle={{padding: '10px'}}
    cover={<img alt="example" src={img1} />}
  >
    <Image preview ={false} src= {logo} style={{width: '68px', height: '14px'}}/>
    <StyleNameProduct>Rau muống</StyleNameProduct>
    <WrapperReporText> 
    <span style={{marginRight: '4px'}}>
        <span>4.96</span> <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>     
    </span>
    <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
   
    </WrapperReporText>
    <WrapperPriceText> 
      <span style={{marginRight: '8px'}}>20.000VND </span>
      <WrapperPriceDiscountText>
        -10%
    </WrapperPriceDiscountText>

    </WrapperPriceText>
    
  </WrapperCardStyle>
  )
}

export default CardComponent
