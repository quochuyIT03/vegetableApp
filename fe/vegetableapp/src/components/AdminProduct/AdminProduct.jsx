/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import {
  PlusCircleFilled, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined

} from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64, renderOptions } from '../../utils';
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import Loading from '../LoadingCoponent/LoadingCoponent'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';


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
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  ////////////////////////////////////////////////
  const user = useSelector((state) => state?.user)
  //////////////////////////////////////////////////////
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const initial = () => ({
    name: '',
    description: '',
    type: '',
    price: '',
    rating: '',
    countInStock: '',
    discount: '',
    // sale: '',
    image: '',
    newType: ''
  })
  ////////////////////////////////////////////////////
  const handleOk = () => {
    onFinish()
  };

  /////////////////////////////////////////////////
  const [form] = Form.useForm();
  ////////////////////////////////////////////////////
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  /////////////////////////////////////////////////
  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
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
      image: '',
      discount: '',
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
      image: '',
      discount: '',
    })
    form.resetFields()
  };
  ////////////////////onFinish//////////////////
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      description: stateProduct.description,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      price: stateProduct.price,
      rating: stateProduct.rating,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
      // sale: '',
      image: stateProduct.image,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  /////////////////stateProduct, setStateProduct//////////////
  const [stateProduct, setStateProduct] = useState(initial())
  /////////////////////////////////////////////////////
  const [stateProductDetails, setStateProductDetails] = useState(initial())
  //////////////handleOnChangeAvatar////////////
  const handleOnChangeAvatar = async ({ fileList }) => {
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
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
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
  ///////////////////////////////////////////////////////
  const mutationDeleted = useMutationHooks(
    (data) => {
      console.log('data', data)
      const {
        id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token
      )
      return res
    },
  )
  ////////////////////////////////////////////////////////
  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const {
        token,
        ...ids
      } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token
      )
      return res
    },
  )
  /////////////////////////////////////////////////////
  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
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
        discount,
      } = data
      const res = ProductService.createProduct({
        name,
        description,
        type,
        price,
        rating,
        countInStock,
        image,
        discount,
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
          discount: res.data.discount
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
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails)
    } else {
      form.setFieldsValue(initial())
    }

  }, [form, stateProductDetails, isModalOpen])
  console.log('state', stateProductDetails, stateProduct)
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }

  }, [rowSelected, isOpenDrawer])


  /////////////////////////////////////////////////////
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
    console.log('rowSelected', rowSelected)
  }
  /////////////////////////////////////////////////////////
  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  /////////////////////////////////////////////////////////////////////////
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  //////////////////////////////////////////////////////

  const { data, isLoading, isSuccess, isError } = mutation
  ///////////////////////////////////////////////////////
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany
  console.log('dataUpdated', dataUpdated)
  ///////////////////////////////////////////////////////////
  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const { isLoading: isLoadingProducts, data: products } = queryProduct
  ////////////////////////////////////////////////////////
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'rgb(168 15 15 / 83%)', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'rgb(4 122 110 / 83%)', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  //////////////////////////////HandleSearch///////////////////////////////////////////
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  ////////////////////////////////////////////////////////////////////////////
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  //////////////////////ColumnSearchProps//////////////////////////////////////
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  ////////////////////////////////////////////////////////
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
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
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: 'Lớn hơn hoặc bằng 30000',
          value: '>=',
        },
        {
          text: 'Nhỏ hơn hoặc bằng 30000',
          value: '<=',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 30000;
        } else if (value === '<=') {
          return record.price <= 30000;
        }
      },
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
      title: 'Discount (%)',
      dataIndex: 'discount',
      key: 'discount',
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img src={record.image} alt="Avatar" style={{
          height: '60px',
          width: '60px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginLeft: '10px'
        }} />
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: 'Rating >= 4',
          value: '>=4',
        },
        {
          text: 'Rating >= 3',
          value: '>=3',
        },
      ],
      onFilter: (value, record) => {
        const rating = record.rating;
        if (value === '>=4') {
          return rating >= 4;
        } else if (value === '>=3') {
          return rating >= 3;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      render: renderAction,
    },
  ];

  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })
  console.log('products', products)
  /////////////////////////////////////////////////////

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])
  ////////////////////////////////////////////////////
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])
  ///////////////////////////////////////////////////
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }

  console.log('vluedsa', stateProduct)
  return (
    <div>
      <WrapperHeader> Quản lí sản phẩm </WrapperHeader>
      <div style={{ marginTop: '10px' }} >
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)} >
          <PlusCircleFilled style={{ fontSize: '60px' }} /> </Button>
      </div>
      <div style={{ marginTop: '20px' }} >
        <TableComponent pagination={{ pageSize: 5 }} handleDeleteMany={handleDeleteManyProducts} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            } // click row
          };
        }} />
      </div>
      {/* -----------------------------------TẠO SẢN PHẨM------------------------------------------------------- */}
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} onOk={handleOk} okButtonProps={{ display: 'none' }} footer={null} >
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

            <Select
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />

          </Form.Item>
          {stateProduct.type === 'add_type' && (
            <Form.Item
              label='New type'
              name="newType"
              rules={[{ required: true, message: 'Please input your Product Type!' }]}
            >
              <InputComponent value={stateProduct.newType} onChange={handleOnChange} name="newType" />


            </Form.Item>
          )}



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

          <Form.Item
            label="Product Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your Product Discount!' }]}
          >
            <InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount" />
          </Form.Item>

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
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />} >Select File</Button>
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
      </ModalComponent>
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

            <Form.Item
              label="Product Discount"
              name="discount"
              rules={[{ required: true, message: 'Please input your Product Discount!' }]}
            >
              <InputComponent value={stateProductDetails.discount} onChange={handleOnChangeDetails} name="discount" />
            </Form.Item>

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
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button icon={<UploadOutlined />} >Select File</Button>
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

      {/* ===========================================Phần xóa sản phẩm============================================================== */}
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
        {/* <Loading isLoading={isLoadingDeleted}> */}
        <div>
          Bạn có muốn xóa sản phẩm này không?
        </div>
        {/* </Loading> */}
      </ModalComponent>
    </div>
  )
}

export default AdminProduct
