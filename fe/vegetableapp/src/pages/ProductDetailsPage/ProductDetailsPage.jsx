import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ width: '100%', background: '#efefef' }} >
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h5> <span style={{ cursor: 'pointer', fontWeight: 'lighter' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Chi tiết sản phẩm </h5>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage
