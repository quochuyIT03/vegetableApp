import { Col, Image, Row } from 'antd'
import React from 'react'
import image_prod from '../../assets/images/bok_choy.jpg'
import image_prod_small from '../../assets/images/small_img.png'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, 
    WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleSmallImage, WrapperStyleTextSell } from './style'
import {
    StarFilled, PlusOutlined, MinusOutlined
   
  } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'


const ProductDetailsComponent = () => {
    const onChange = () => {}
  return (
        <Row style={{padding: '16px', borderRadius:'4px'}}>
            <Col span={10} style={{ borderRight: '2px solid #e5e5e5', paddingRight: '8px' }}> 
                <Image src = {image_prod} alt="image product" preview={false} />
                <Row style={{paddingTop: '10px', justifyContent:'space-between'}}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={image_prod_small} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={image_prod_small} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={image_prod_small} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={image_prod_small} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleSmallImage src={image_prod_small} alt="image product small" preview ={false} />
                    </WrapperStyleColImage>

                


                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '6px' }} > 
                <WrapperStyleNameProduct> Cải thìa, rất tốt cho sức khỏe </WrapperStyleNameProduct>
                <div>
                    <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>
                    <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>
                    <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>
                    <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct> 20.000 VND </WrapperPriceTextProduct>
                </WrapperPriceProduct>

                <WrapperAddressProduct>
                    <span>Giao điến</span>
                    <span className='address'> 361 Võ Thị Sáu</span>
                    <span className='change-address'> -Đổi địa chỉ</span>
                </WrapperAddressProduct>
               
                  
                    <div style={{margin: '10px 0 20px', borderTop: '1px solid #ccc' , borderBottom: '1px solid #ccc', padding: '10px 0'}}>
                        <div style={{marginBottom: '6px'}}> Số lượng </div>
                        <WrapperQualityProduct>

                            <button style={{border: 'none', background: 'transparent'}}>
                            <MinusOutlined style = {{color: '#000', fontSize:'20px'}}  />
                            </button>
                            
                            <WrapperInputNumber min={1} max={10} defaultValue={3} onChange={onChange} size="small" />              
                            
                            <button style={{border: 'none', background: 'transparent'}}>
                            <PlusOutlined  style = {{color: '#000', fontSize:'20px'}}  />
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
  )
}

export default ProductDetailsComponent
