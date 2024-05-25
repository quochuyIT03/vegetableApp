import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1  from '../../assets/images/primary_image.jpg'
import slider2  from '../../assets/images/banner_1.jpg'
import slider3  from '../../assets/images/banner_2.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingCoponent/LoadingCoponent'
import { useDebounce } from '../../hooks/useDebounce'


const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 1000)
  // const refSearch = useRef()
  const [limit, setLimit] = useState(10)
  // const [limit, setLimit] = useState(5)
  const [loading, setLoading] = useState(false)
  const [typeProducts, setTypeProducts] = useState([])
  const arr = ['Rau Cải', 'Trái Cây', 'Rau Thơm']
  // const [stateProducts, setStateProducts] = useState([])

  // const fetchProductAll = async (search) => {
  //   // if(search.length > 0){}
  //   const res = await ProductService.getAllProduct(search)
  //   if(search?.length > 0 || refSearch.current){
  //     setStateProducts(res?.data)
  //     return []
  //   }else{
  //     return res
  //   }
  // }

  const fetchProductAll = async (context) => {
    // if(search.length > 0){}
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    // if(search?.length > 0 || refSearch.current){
    //   setStateProducts(res?.data)
    //   return []
    // }else{
      return res
    // }
  }

  // useEffect(() => {
  //   if(refSearch.current) {
  //       setLoading(true)
  //       fetchProductAll(searchDebounce)
  //   }
  //   refSearch.current = true
  //   setLoading(false)
  // }, [searchDebounce])

  const { isLoading, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    fetchProductAll: { retry: 3, retryDelay: 1000, keepPreviousData: true }
  });
  
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProducts(res?.data)
    }
    
    return res
  }
  // useEffect(() => {
  //   if(products && products?.data?.length > 0) {
  //     setStateProducts(products?.data) 
  //   }
  // }, [products])

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])
  
  return (
    <Loading isLoading={isLoading || loading} >
    <div style={{ width: '1270px', margin: '0 auto' }}>
      <WrapperTypeProduct>
        {typeProducts.map((item) => {
          return (
            <TypeProduct name ={item} key={item} />
          )
        })}
      </WrapperTypeProduct>
      </div>
      <div className='body' style={{width: '100%', backgroundColor: '#efefef' }} >
        <div id ="container" style={{backgroundColor: '#efefef', padding:'0 120px', height: '1200px', margin: '0 auto'}}>
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
                id={product._id}
                />
              )
          })}
        </WrapperProduct>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
          <WrapperButtonMore textButton={ isPreviousData ? 'More'  : "Xem thêm"} type ="outline" styleButton={{
            border: '2px solid #195f07', color: `${ products?.total === products?.data?.length ? '#ccc' : '#195f07'}`, 
            width: '240px', height: '38px', borderRadius: '4px'
          }} disabled={ products?.total === products?.data?.length || products?.totalPage === 1 } styleTextButton={{fontWeight:500, color: products?.total === products?.data?.length && '#fff'}} onClick={() => setLimit((prev) => prev + 8)}  />
          </div>
        </div>
      </div>
   
    </Loading>
  );
}

export default HomePage
