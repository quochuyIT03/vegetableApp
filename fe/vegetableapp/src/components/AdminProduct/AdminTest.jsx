import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, Space } from 'antd'
import {
    PlusCircleFilled, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined
   
  } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingCoponent/LoadingCoponent';
import InputComponent from '../InputComponent/InputComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useSelector } from 'react-redux';
import { getBase64 } from '../../utils';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import * as message from '../../components/Message/Message'
import * as UserService from '../../services/UserService'

const AdminUser = () => {
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
const handleDeleteUser = () => {
    mutationDeleted.mutate({id: rowSelected, token: user?.access_token} , {
        onSettled: () => {
            queryUser.refetch()
        }
    })
}
////////////////////////////////////////////////////
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateUser({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        })
        form.resetFields()
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setstateUserDetails({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        })
        form.resetFields()
  };
////////////////////onFinish//////////////////
const onFinish = () => {
    mutation.mutate(stateUser)
    console.log('finish', stateUser, {
        onSettled: () => {
            queryUser.refetch()
        }
    })
}  
/////////////////stateUser, setstateUser//////////////
const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,

})
/////////////////////////////////////////////////////
const [stateUserDetails, setstateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
})
//////////////handleOnChangeAvatar////////////
const handleOnChangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateUser({
        ...stateUser,
        image: file.preview
    })
}
////////////////////handleOnChangeAvatarDetails///////////////
const handleOnChangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setstateUserDetails({
        ...stateUserDetails,
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
        const res = UserService.updateUser(
        id, 
        { ...rests },
        token,
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
        const res = UserService.deleteUser(
        id, 
        token
        )
        return res
    },
)
/////////////////////////////////////////////////////
console.log('user',user)
const onUpdateUser = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails}, {
        onSettled: () => {
            queryUser.refetch()
        }
    })
}
////////////handleOnChange/////////////////////////////
const handleOnChange = (e) => {
    setStateUser({
        ...stateUser,
        [e.target.name]: e.target.value
    })
}
//////////////////////////handleOnChangeDetails//////////////////////////////
const handleOnChangeDetails = (e) => {
    console.log('check', e.target.name, e.target.value)
    setstateUserDetails({
        ...stateUserDetails,
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
        const res = UserService.signupUser({
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
const getAllUsers = async () => {
    const res = await UserService.getAllUser()
    return res
}
///////////////////////////////////////////////////////
const fetchGetDetailsUser = async (rowSelected) => {
    try {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res && res.data) {
            setstateUserDetails({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                isAdmin: res.data.isAdmin,
            });
        }
    } catch (error) {
        // Xử lý lỗi ở đây nếu cần thiết
        console.error('Error fetching user details:', error);
    }
    setIsLoadingUpdate(false)
}
////////////////////////////////////////////////////////////////
useEffect(() => {
    form.setFieldsValue(stateUserDetails)
}, [form, stateUserDetails])
////////////////////////////////////////////////////////////////
useEffect(() => {
    if(rowSelected) {
        setIsLoadingUpdate(true)
        fetchGetDetailsUser(rowSelected)
    }
    
}, [rowSelected])

console.log('stateUserDetails', stateUserDetails)
/////////////////////////////////////////////////////
const handleDetailsUser = () => {
    // if(rowSelected) {
    //     setIsLoadingUpdate(true)
    //     // fetchGetDetailsUser()
        
    // }
    setIsOpenDrawer(true)
    console.log('rowSelected', rowSelected)
}
//////////////////////////////////////////////////////

const { data, isLoading, isSuccess, isError } = mutation
///////////////////////////////////////////////////////
const { data: dataUpdated , isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
const { data: dataDeleted , isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
console.log('dataUpdated', dataUpdated)
///////////////////////////////////////////////////////////
// const {isLoading: isLoadingProducts, data: products} = useQuery({queryKey: ['products'], queryFn:getAllProducts})
const queryUser = useQuery({queryKey: ['user'], queryFn:getAllUsers})
const {isLoading: isLoadingUser, data: users} = queryUser
////////////////////////////////////////////////////////
const renderAction = () => {
    return (
        <div>
            <DeleteOutlined style={{ color: 'rgb(168 15 15 / 83%)', fontSize: '30px', cursor: 'pointer' }} onClick={ () => setIsModalOpenDelete(true)}/>
            <EditOutlined style={{ color: 'rgb(4 122 110 / 83%)', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser}/>
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
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        },
      ],
    },
    
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      ...getColumnSearchProps('phone')
      
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      render: renderAction,
    },
  ];

  const dataTable =users?.data?.length && users?.data?.map((user) => {
    return {...user, key: user._id, isAdmin: user.isAdmin ? 'Admin' : 'User'}
  })
console.log('users', users)
/////////////////////////////////////////////////////
 
useEffect(() => {
    if(isSuccess && data?.status === 'OK'){
        message.success()
        handleCancel()
    }else if(isError){
        message.error()
    }
}, [isSuccess])
////////////////////////////////////////////////////
useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
        message.success()
        handleCancelDelete()
    }else if(isErrorDeleted){
        message.error()
    }
}, [isSuccessDeleted])
///////////////////////////////////////////////////
useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
        message.success()
        handleCloseDrawer()
    }else if(isErrorUpdated){
        message.error()
    }
}, [isSuccessUpdated])

 //////////////////////////////////////////////////////////////////////////////////////////////////   
  return (
    <div>
      <WrapperHeader> Quản lí người dùng </WrapperHeader>
      <div style={{ marginTop: '10px' }} >
      <Button onClick={() => setIsModalOpen(true) } style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} > <PlusCircleFilled style={{ fontSize: '60px' }}  /> </Button>
      </div>
      <div style={{ marginTop: '20px' }} >
        {/* <TableComponent products ={products?.data} isLoading={isLoadingProducts} /> */}
        <TableComponent columns ={columns} isLoading={isLoadingUser} data={dataTable} onRow={(record, rowIndex) => {
            return {
                onClick: (event) => {
                    setRowSelected(record._id)
                } // click row
            };
        }}/> 
        </div>
        {/* -----------------------------------TẠO NGƯỜI DÙNG------------------------------------------------------- */}
    <ModalComponent forceRender title="Tạo người dùng mới" open={isModalOpen} onCancel={handleCancel} onOk ={handleOk} okButtonProps={{ display: 'none' }} footer={null} >
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
                label="User Name"
                name="name"
                rules={[{ required: true, message: 'Please input your user name!' }]}
                >
                <InputComponent value={stateUser.name} onChange={handleOnChange} name="name" />
                </Form.Item>

                <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
                >
                <InputComponent value={stateUser.email} onChange={handleOnChange} name="email" />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password value={stateUser.password} onChange={handleOnChange} name="password" />
                </Form.Item>

                <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                <InputComponent value={stateUser.phone} onChange={handleOnChange} name="phone" />
                </Form.Item>

                <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your Image!' }]}>
                <WrapperUploadFile onChange ={handleOnChangeAvatar} maxCount={1}>
                    <Button icon={ <UploadOutlined/>} >Select File</Button>
                    {stateUser?.image && (
                    <img src={stateUser?.image} style={{
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
                    Create User
                </Button>
                </Form.Item>

            </Form>
        {/* </Loading> */}
    </ModalComponent>
    {/* ========================================Phần chi tiết User============================================ */}
    <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="75%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdate}>
        <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 22 }}
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onUpdateUser}
                autoComplete="on">
                <Form.Item
                label="User Name"
                name="name"
                rules={[{ required: true, message: 'Please input your user name!' }]}
                >
                <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                </Form.Item>

                <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
                >
                <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
                </Form.Item>

                <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                </Form.Item>

                <Form.Item
                label="IsAdmin"
                name="isAdmin"
                rules={[{ required: true, message: 'Please input your isAdmin!' }]}
                >
                <InputComponent value={stateUserDetails.isAdmin} onChange={handleOnChangeDetails} name="isAdmin" />
                </Form.Item>

        
                <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your Image!' }]}>
                <WrapperUploadFile onChange ={handleOnChangeAvatarDetails} maxCount={1}>
                    <Button icon={ <UploadOutlined/>} >Select File</Button>
                    {stateUserDetails?.image && (
                    <img src={stateUserDetails?.image} style={{
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

    {/* ===========================================Phần xóa người dùng============================================================== */}
    <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
        {/* <Loading isLoading={isLoadingDeleted}> */}
            <div>
                Bạn có muốn xóa người dùng này không?
            </div>
        {/* </Loading> */}
    </ModalComponent>
    </div>
  )
}

export default AdminUser
