import { Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, 
    WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleSmallImage, WrapperStyleTextSell } from './style'
import {
     PlusOutlined, MinusOutlined
   
  } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingCoponent/LoadingCoponent'
import { useSelector } from 'react-redux';


const ProductDetailsComponent = ({idProduct}) => {
    const [numOfProduct, setNumOfProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const onChange = (e) => {
        setNumOfProduct(Number(e))
    }
    const fetchGetDetailsProduct = async (context) => {
            const id = context?.queryKey && context?.queryKey[1]
            if(id){
                const res = await ProductService.getDetailsProduct(id);
                return res.data
            }
    }

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumOfProduct(numOfProduct + 1);
        } else {
            if (numOfProduct > 1) {
                setNumOfProduct(numOfProduct - 1);
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['products-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        fetchGetDetailsProduct: { enabled: !!idProduct }
        
      });
      console.log('productDetails',productDetails)
  return (
    <Loading isLoading={isLoading}>


        <Row style={{padding: '16px', borderRadius:'4px'}}>
            <Col span={10} style={{ borderRight: '2px solid #e5e5e5', paddingRight: '8px' }}> 
                <Image src = {productDetails?.image} alt="image product" preview={true} />
                <Row style={{paddingTop: '10px', justifyContent:'space-between'}}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>
 
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                


                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '6px' }} > 
                <WrapperStyleNameProduct> { productDetails?.name } </WrapperStyleNameProduct>
                <div>
                <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                    <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct> {productDetails?.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})} </WrapperPriceTextProduct>
                </WrapperPriceProduct>

                <WrapperAddressProduct>
                    <span>Giao điến</span>
                    <span className='address'> {user?.address} </span>
                    <span className='change-address'> -Đổi địa chỉ</span>
                </WrapperAddressProduct>
               
                  
                    <div style={{margin: '10px 0 20px', borderTop: '1px solid #ccc' , borderBottom: '1px solid #ccc', padding: '10px 0'}}>
                        <div style={{marginBottom: '6px'}}> Số lượng </div>
                        <WrapperQualityProduct>

                            <button style={{border: 'none', background: 'transparent', cursor: 'pointer' }}  onClick={() => handleChangeCount('decrease')}>
                            <MinusOutlined style = {{color: '#000', fontSize:'20px'}} />
                            </button>
                            
                            <WrapperInputNumber min={1} max={10} defaultValue={1} onChange={onChange} value={numOfProduct} size="small" />              
                            
                            <button style={{border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')} >
                            <PlusOutlined  style = {{color: '#000', fontSize:'20px'}} />
                            </button>
                        
                        </WrapperQualityProduct> 
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <ButtonComponent 
                            size = {40} 
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            textButton = {'Mua trả trước'}
                            styleTextButton ={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
                        >

                        </ButtonComponent>

                        <ButtonComponent 
                            size = {40} 
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 169)',
                                borderRadius: '4px'
                            }}
                            textButton = {'Mua trả sau'}
                            styleTextButton ={{color: 'rgb(13, 92, 169)', fontSize: '15px'}}
                        >

                        </ButtonComponent>
                    </div>
            </Col>
        </Row>
    </Loading>
  )
}

export default ProductDetailsComponent
