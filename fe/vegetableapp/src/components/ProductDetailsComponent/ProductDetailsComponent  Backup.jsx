import { Col, Image, Rate, Row, message } from 'antd'
import React, { useEffect, useState } from 'react'
import {
    WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct,
    WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleSmallImage, WrapperStyleTextSell
} from './style'
import {
    PlusOutlined, MinusOutlined

} from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingCoponent/LoadingCoponent'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide';


const ProductDetailsComponent = ({ idProduct }) => {
    const [numOfProduct, setNumOfProduct] = useState(1)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const product = useSelector((state) => state.product)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const onChange = (e) => {
        setNumOfProduct(Number(e))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id);
            return res.data
        }
    }
    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numOfProduct) <= orderRedux?.countInStock || !orderRedux) {
            setErrorLimitOrder(false)
        } else {
            setErrorLimitOrder(true)
        }
    }, [numOfProduct])

    useEffect(() => {
        if (order.isSuccessOrder) {
            message.success('Sản phẩm đã được thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSuccessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                // if (numOfProduct < 10) {
                setNumOfProduct(numOfProduct + 1);
                // }
            }

        } else {
            if (!limited) {
                // if (numOfProduct > 1) {
                setNumOfProduct(numOfProduct - 1);
                // }
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['products-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        fetchGetDetailsProduct: { enabled: !!idProduct }

    });
    console.log('productDetails', productDetails)

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numOfProduct) <= orderRedux?.countInStock) {
                dispatch(addOrderProduct({
                    orderItems: {
                        name: productDetails?.name,
                        amount: numOfProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInStock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }

        }
    }



    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '2px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image product" preview={true} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={productDetails?.image} alt="image product small" preview={false} />
                        </WrapperStyleColImage>

                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '6px' }} >
                    <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Số lượng trong kho: {productDetails?.countInStock} </WrapperStyleTextSell>
                        <WrapperStyleTextSell> | Đã bán: {productDetails?.sale} </WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>
                            {productDetails?.discount > 0 ? (
                                <>

                                    {(productDetails?.price * (1 - productDetails?.discount / 100)).toLocaleString('vi', { style: 'currency', currency: 'VND' })}

                                    <del style={{ marginLeft: '10px', color: '#cc5454', fontSize: '18px' }}>{productDetails?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</del>


                                </>
                            ) : (
                                productDetails?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })
                            )}
                        </WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct style={{ marginBottom: '30px' }}>
                        <span >Mô tả: {productDetails?.description}</span>
                    </WrapperAddressProduct>
                    <WrapperAddressProduct>
                        <span>Giao điến</span>
                        <span className='address'> {user?.address} </span>
                        <span className='change-address'> -Đổi địa chỉ</span>
                    </WrapperAddressProduct>


                    <div style={{ margin: '10px 0 20px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <div style={{ marginBottom: '6px' }}> Số lượng </div>
                        <WrapperQualityProduct>

                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numOfProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>

                            <WrapperInputNumber min={1} max={productDetails?.countInStock} defaultValue={1} onChange={onChange} value={numOfProduct} size="small" />

                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numOfProduct === productDetails?.countInStock)} >
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>

                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>


                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}

                                onClick={handleAddOrderProduct}
                                textButton={'Mua trả trước'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            >

                            </ButtonComponent>
                            {/* {errorLimitOrder && <div style={{ color: 'red' }}> Sản phẩm đã hết hàng </div>} */}
                        </div>


                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 169)',
                                borderRadius: '4px'
                            }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 169)', fontSize: '15px' }}
                        >

                        </ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading>
    )
}

export default ProductDetailsComponent
