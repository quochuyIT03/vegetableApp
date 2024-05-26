import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
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
import * as message from '../Message/Message'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'

const AdminOrder = () => {
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
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryOrder.refetch()
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
            address: '',
            isAdmin: false,
            avatar: '',
        })
        form.resetFields()
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setstateUserDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: false,
            avatar: '',
        })
        form.resetFields()
    };
    ////////////////////onFinish//////////////////
    const onFinish = () => {
        mutation.mutate(stateUser)
        console.log('finish', stateUser, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }
    /////////////////stateUser, setstateUser//////////////
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''

    })
    /////////////////////////////////////////////////////
    const [stateUserDetails, setstateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    })
    //////////////handleOnChangeAvatar////////////
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            avatar: file.preview
        })
    }
    ////////////////////handleOnChangeAvatarDetails///////////////
    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setstateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
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
    /////////////////////////////////////////////////////
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const {
                token,
                ...ids
            } = data
            const res = UserService.deleteManyUser(
                ids,
                token
            )
            return res
        },
    )
    ///////////////////////////////////////////////////////
    // const handleDeleteManyUsers = (ids) => {
    //     mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
    //         onSettled: () => {
    //             queryUser.refetch()
    //         }
    //     })
    // }
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
    // console.log('user', user)
    // const onUpdateUser = () => {
    //     mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
    //         onSettled: () => {
    //             queryUser.refetch()
    //         }
    //     })
    // }
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
                email,
                isAdmin,
                phone,
                address,
                avatar
            } = data
            const res = UserService.signupUser({
                name,
                email,
                isAdmin,
                phone,
                address,
                avatar
            })
            return res
        }
    )
    ////////////////////////////////////////////////////////
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
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
                    address: res.data.address,
                    avatar: res.data.avatar,

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
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }

    }, [rowSelected, isOpenDrawer])

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
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany
    console.log('dataUpdated', dataUpdated)
    ///////////////////////////////////////////////////////////
    // const {isLoading: isLoadingProducts, data: products} = useQuery({queryKey: ['products'], queryFn:getAllProducts})
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder
    ////////////////////////////////////////////////////////

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
            record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });
    ///////////////////////////////////////////////////////////

    //   const dataTable =users?.data?.length && users?.data?.map((user) => {
    //     return {...user, key: user._id, isAdmin: user.isAdmin ? 'Admin' : 'User'}
    //   })

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order, key: order._id, userName: order?.shippingAddress?.fullName,
            phone: order?.shippingAddress?.phone,
            address: order?.shippingAddress?.address,
            city: order?.shippingAddress?.city,
            paymentMethod: order?.paymentMethod,
            totalPrice: order?.totalPrice,
        };
    });
    console.log('users', orders)
    ////////////////////////////////////////////////////////
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            ...getColumnSearchProps('userName')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone')

        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address')

        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            ...getColumnSearchProps('city')

        },
        {
            title: 'paymentMethod',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            ...getColumnSearchProps('paymentMethod')

        },
        {
            title: 'totalPrice',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            ...getColumnSearchProps('totalPrice')

        },

    ];


    /////////////////////////////////////////////////////

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])
    ////////////////////////////////////////////////////
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])
    //////////////////////////////////////////////////////
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])
    ///////////////////////////////////////////////////
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    //////////////////////////////////////////////////////////////////////////////////////////////////   
    return (
        <div>
            <WrapperHeader> Quản lí đơn hàng </WrapperHeader>
            <div style={{ marginTop: '10px' }} >

            </div>
            <div style={{ marginTop: '20px' }} >
                {/* <TableComponent products ={products?.data} isLoading={isLoadingProducts} /> */}
                <TableComponent pagination={{ pageSize: 5 }} columns={columns} isLoading={isLoadingOrders} data={dataTable} />
            </div>
        </div>
    )
}

export default AdminOrder
