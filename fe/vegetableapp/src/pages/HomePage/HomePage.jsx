import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1  from '../../assets/images/primary_image.jpg'
import slider2  from '../../assets/images/banner_1.jpg'
import slider3  from '../../assets/images/banner_2.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'


const HomePage = () => {
  const arr = ['Rau', 'Qua', 'rau thom']
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }
  const { isLoading, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    config: { retry: 3, retryDelay: 1000 }
  });
  
  console.log('data', products);
  
  return (
    <>
    <div style={{ width: '1270px', margin: '0 auto' }}>
      <WrapperTypeProduct>
        {arr.map((item) => {
          return (
            <TypeProduct name ={item} key={item} />
          )
        })}
      </WrapperTypeProduct>
      </div>
      <div className='body' style={{width: '100%', backgroundColor: '#efefef'}} >
        <div id ="container" style={{backgroundColor: '#efefef', padding:'0 120px', height: '1000px', margin: '0 auto'}}>
        <SliderComponent arrImages = {[slider1, slider2, slider3]}/>
        <WrapperProduct>
          {products?.data?.map((product) => {
              return(
                <CardComponent 
                key={product._id} 
                countInStock={product.countInStock} 
                description={product.description} 
                image={product.image} 
                name={product.name} 
                price={product.price} 
                rating={product.rating}
                type={product.type}
                discount={product.discount}
                sale={product.sale}
                />
              )
          })}
        </WrapperProduct>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
          <WrapperButtonMore textButton="Xem thêm" type ="outline" styleButton={{
            border: '1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)', 
            width: '240px', height: '38px', borderRadius: '4px'
          }} styleTextButton={{fontWeight:500}} />
          </div>
        </div>
      </div>
   
    </>
  )
}

export default HomePage
