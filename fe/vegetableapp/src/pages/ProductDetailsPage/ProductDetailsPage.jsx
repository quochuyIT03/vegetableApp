import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ height: '100vh', width: '100%',background: '#efefef' }} >
      <div style={{ height: '100%', width: '1270px', margin: '0 auto'}}>
        <h5> <span style={ { cursor: 'pointer', fontWeight: 'bold' } } onClick={() => {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm </h5>
        {/* <div style={{ display: 'flex', background: '#fff'}}> */}
          <ProductDetailsComponent idProduct={id} />
        {/* </div> */}
      </div>
    </div>
  )
}

export default ProductDetailsPage
