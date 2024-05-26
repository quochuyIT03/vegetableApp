import { Image } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import {
  StarFilled

} from '@ant-design/icons';
import logo from '../../assets/images/abcs.png'
import { useNavigate } from 'react-router-dom';
import { fomatall } from "../../fomatall";

const CardComponent = (props) => {
  const { name, price, image, description, countInStock, rating, type, sale, discount, id } = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  const formattedPrice = fomatall(price);
  // Tính giá sau khi giảm giá
  const discountedPrice = price - (price * (discount / 100));

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
          // background:'#efefef'
        },
      }}
      style={{
        width: 210,
        // background:'#efefef'
      }}
      cover={<img alt="ảnh" src={image} />}
      onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
      disabled={countInStock === 0}

    >
      <Image preview={false} src={logo} style={{ width: '68px', height: '14px' }} />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReporText>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {sale || 500} </WrapperStyleTextSell>

      </WrapperReporText>
      <WrapperStyleTextSell> Số lượng trong kho: {countInStock || 500} </WrapperStyleTextSell>
      <WrapperPriceText>
        {/* Hiển thị giá trước khi giảm giá */}
        <span style={{ marginRight: '8px' }}>
          {discount > 0 ? <del>{formattedPrice}</del> : formattedPrice}
        </span>
        {/* Kiểm tra nếu discount > 0 thì mới hiển thị giảm giá và giá sau khi giảm giá */}
        {discount > 0 && (
          <>
            <WrapperPriceDiscountText>
              -{discount}%<br />
            </WrapperPriceDiscountText>
            <span>{fomatall(discountedPrice)} </span>
          </>
        )}
      </WrapperPriceText>

    </WrapperCardStyle>
  )
}

export default CardComponent
