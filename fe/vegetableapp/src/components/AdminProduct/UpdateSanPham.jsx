import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import {
    PlusCircleFilled, UploadOutlined, DeleteOutlined, EditOutlined
   
  } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64 } from '../../utils';
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import Loading from '../LoadingCoponent/LoadingCoponent'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';


const AdminProduct = () => {
    ////////////isModelOpen///////////////////////
    const [isModalOpen, setIsModalOpen] = useState(false);
    ////////////////////////////////////////////////////
    const [rowSelected, setRowSelected] = useState('')
    ////////////////////////////////////////////////////
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    ////////////////////////////////////////////////////
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    ///////////////////////////////////////////////////////
    const user = useSelector((state) => state?.user)
    ////////////////////////////////////////////////////
    const handleOk = () => {
        onFinish()
      };

    /////////////////////////////////////////////////
    const [form] = Form.useForm();
    ////////////////////////////////////////////////////
      const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            description: '',
            type: '',
            price: '',
            rating: '',
            countInStock: '',
            image: ''
            // discount: '',
            // sale: '',
            })
            form.resetFields()
      };

      const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            description: '',
            type: '',
            price: '',
            rating: '',
            countInStock: '',
            image: ''
            // discount: '',
            // sale: '',
            })
            form.resetFields()
      };
    ////////////////////onFinish//////////////////
    const onFinish = () => {
        mutation.mutate(stateProduct)
        console.log('finish', stateProduct)
    }  
    /////////////////stateProduct, setStateProduct//////////////
    const [stateProduct, setStateProduct] = useState({
        name: '',
        description: '',
        type: '',
        price: '',
        rating: '',
        countInStock: '',
        // discount: '',
        // sale: '',
        image: ''
    })
    /////////////////////////////////////////////////////
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        description: '',
        type: '',
        price: '',
        rating: '',
        countInStock: '',
        // discount: '',
        // sale: '',
        image: ''
    })
    //////////////handleOnChangeAvatar////////////
    const handleOnChangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    ////////////////////handleOnChangeAvatarDetails///////////////
    const handleOnChangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }
    const mutationUpdate = useMutationHooks(
        (data) => {
            console.log('data', data)
        const { 
            id, 
            token, 
            ...rests 
        } = data
            const res = ProductService.updateProduct(
            id, 
            token, 
            { ...rests }
            )
            return res
        },
    )
    /////////////////////////////////////////////////////
    console.log('user',user)
    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    ////////////handleOnChange/////////////////////////////
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    //////////////////////////handleOnChangeDetails//////////////////////////////
    const handleOnChangeDetails = (e) => {
        console.log('check', e.target.name, e.target.value)
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    ///////////MUTATION//////////////////////
    const mutation = useMutationHooks(
        (data) => {
        const { 
            name,
            description,
            type,
            price,
            rating,
            image, 
            countInStock,
            // discount, 
            // sale
        } = data
            const res = ProductService.createProduct({
            name,
            description,
            type,
            price,
            rating,
            countInStock,
            image,
            // discount, 
            // sale
            })
            return res
        }
    )
    ////////////////////////////////////////////////////////
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    ///////////////////////////////////////////////////////
    const fetchGetDetailsProduct = async (rowSelected) => {
        try {
            const res = await ProductService.getDetailsProduct(rowSelected);
            if (res && res.data) {
                setStateProductDetails({
                    name: res.data.name,
                    description: res.data.description,
                    type: res.data.type,
                    price: res.data.price,
                    rating: res.data.rating,
                    countInStock: res.data.countInStock,
                    image: res.data.image,
                });
            }
        } catch (error) {
            // Xử lý lỗi ở đây nếu cần thiết
            console.error('Error fetching product details:', error);
        }
        setIsLoadingUpdate(false)
    }
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        if(rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
        
    }, [rowSelected])

    console.log('stateProductDetails', stateProductDetails)
    /////////////////////////////////////////////////////
    const handleDetailsProduct = () => {
        if(rowSelected) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct()
            
        }
        setIsOpenDrawer(true)
        console.log('rowSelected', rowSelected)
    }
    //////////////////////////////////////////////////////

    const { data, isLoading, isSuccess, isError } = mutation
    ///////////////////////////////////////////////////////
    const { data: dataUpdated , isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    console.log('dataUpdated', dataUpdated)
    ///////////////////////////////////////////////////////////
    // const {isLoading: isLoadingProducts, data: products} = useQuery({queryKey: ['products'], queryFn:getAllProducts})
    const queryProduct = useQuery({queryKey: ['products'], queryFn:getAllProducts})
    const {isLoading: isLoadingProducts, data: products} = queryProduct
    ////////////////////////////////////////////////////////
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'rgb(168 15 15 / 83%)', fontSize: '30px', cursor: 'pointer' }}/>
                <EditOutlined style={{ color: 'rgb(4 122 110 / 83%)', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct}/>
            </div>
        )
    }
    ////////////////////////////////////////////////////////
    const columns = [
        {
          title: 'Product Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: 'CountInStock',
          dataIndex: 'countInStock',
          key: 'countInStock',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
          key: 'rating',
        },
        {
          title: 'Action',
          dataIndex: 'Action',
          render: renderAction,
        },
      ];

      const dataTable =products?.data?.length && products?.data?.map((product) => {
        return {...product, key: product._id}
      })
    console.log('products', products)
    /////////////////////////////////////////////////////
     
    useEffect(() => {
        if(isSuccess && data?.status === 'OK'){
            message.success()
            handleCancel()
        }else if(isError){
            message.error()
        }
    }, [isSuccess])

    ///////////////////////////////////////////////////
    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK'){
            message.success()
            handleCloseDrawer()
        }else if(isErrorUpdated){
            message.error()
        }
    }, [isSuccessUpdated])
  return (
    <div>
      <WrapperHeader> Quản lí người dùng </WrapperHeader>
      <div style={{ marginTop: '10px' }} >
      <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true) } >
         <PlusCircleFilled style={{ fontSize: '60px' }} /> </Button>
      </div>
        <div style={{ marginTop: '20px' }} >
        <TableComponent products ={products?.data} isLoading={isLoadingProducts} />
        <TableComponent columns ={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
            return {
                onClick: (event) => {
                    setRowSelected(record._id)
                } // click row
            };
        }}/> 
        </div>
        {/* -----------------------------------TẠO SẢN PHẨM------------------------------------------------------- */}
    <Modal title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} onOk ={handleOk} okButtonProps={{ display: 'none' }} footer={null} >
        {/* <Loading isLoading={isLoading}> */}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onFinish}
                autoComplete="off">
                <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please input your product name!' }]}
                >
                <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                </Form.Item>

                <Form.Item
                label="Product Type"
                name="type"
                rules={[{ required: true, message: 'Please input your Product Type!' }]}
                >
                <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                </Form.Item>

                <Form.Item
                label="Product Price"
                name="price"
                rules={[{ required: true, message: 'Please input your Product Price!' }]}
                >
                <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                </Form.Item>

                <Form.Item
                label="Product CountInStock"
                name="countInStock"
                rules={[{ required: true, message: 'Please input your Product CountInStock!' }]}
                >
                <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                </Form.Item>

                <Form.Item
                label="Product Description"
                name="description"
                rules={[{ required: true, message: 'Please input your Product Description!' }]}
                >
                <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
                </Form.Item>

                {/* <Form.Item
                label="Product Discount"
                name="discount"
                rules={[{ required: true, message: 'Please input your Product Discount!' }]}
                >
                <InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount" />
                </Form.Item>

                <Form.Item
                label="Product Sale"
                name="sale"
                rules={[{ required: true, message: 'Please input your Product Sale!' }]}
                >
                <InputComponent value={stateProduct.sale} onChange={handleOnChange} name="sale" />
                </Form.Item> */}

                <Form.Item
                label="Product Rating"
                name="rating"
                rules={[{ required: true, message: 'Please input your Product Rating!' }]}
                >
                <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                </Form.Item>

                <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your Image!' }]}>
                <WrapperUploadFile onChange ={handleOnChangeAvatar} maxCount={1}>
                    <Button icon={ <UploadOutlined/>} >Select File</Button>
                    {stateProduct?.image && (
                    <img src={stateProduct?.image} style={{
                        height: '60px', 
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                    }} alt="avatar" />
                )}
                </WrapperUploadFile>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Create Product
                </Button>
                </Form.Item>

            </Form>
        {/* </Loading> */}
    </Modal>
    {/* ========================================Phần chi tiết sản phẩm============================================ */}
    <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="75%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdate}>
        <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 22 }}
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onUpdateProduct}
                autoComplete="on">
                <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please input your product name!' }]}
                >
                <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name" />
                </Form.Item>

                <Form.Item
                label="Product Type"
                name="type"
                rules={[{ required: true, message: 'Please input your Product Type!' }]}
                >
                <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type" />
                </Form.Item>

                <Form.Item
                label="Product Price"
                name="price"
                rules={[{ required: true, message: 'Please input your Product Price!' }]}
                >
                <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />
                </Form.Item>

                <Form.Item
                label="Product CountInStock"
                name="countInStock"
                rules={[{ required: true, message: 'Please input your Product CountInStock!' }]}
                >
                <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock" />
                </Form.Item>

                <Form.Item
                label="Product Description"
                name="description"
                rules={[{ required: true, message: 'Please input your Product Description!' }]}
                >
                <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name="description" />
                </Form.Item>

                {/* <Form.Item
                label="Product Discount"
                name="discount"
                rules={[{ required: true, message: 'Please input your Product Discount!' }]}
                >
                <InputComponent value={stateProductDetails.discount} onChange={handleOnChangeDetails} name="discount" />
                </Form.Item>

                <Form.Item
                label="Product Sale"
                name="sale"
                rules={[{ required: true, message: 'Please input your Product Sale!' }]}
                >
                <InputComponent value={stateProductDetails.sale} onChange={handleOnChangeDetails} name="sale" />
                </Form.Item> */}

                <Form.Item
                label="Product Rating"
                name="rating"
                rules={[{ required: true, message: 'Please input your Product Rating!' }]}
                >
                <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating" />
                </Form.Item>

                <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your Image!' }]}>
                <WrapperUploadFile onChange ={handleOnChangeAvatarDetails} maxCount={1}>
                    <Button icon={ <UploadOutlined/>} >Select File</Button>
                    {stateProductDetails?.image && (
                    <img src={stateProductDetails?.image} style={{
                        height: '60px', 
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                    }} alt="avatar" />
                )}
                </WrapperUploadFile>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Modify
                </Button>
                </Form.Item>

            </Form>
        </Loading>
    </DrawerComponent>    

    </div>
  )
}

export default AdminProduct
