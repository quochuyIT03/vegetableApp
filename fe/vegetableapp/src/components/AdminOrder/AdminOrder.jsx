/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import * as message from '../Message/Message'
import * as OrderService from '../../services/OrderService'

const AdminOrder = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteOrder = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }
    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data;
            return OrderService.deleteOrder(id, token);
        },
    );
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const {
                token,
                ...ids
            } = data
            const res = OrderService.deleteManyOrders(
                ids,
                token
            )
            return res
        },
    )
    // const getAllOrder = async () => {
    //     return OrderService.getAllOrder(user?.access_token);

    // };
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder()
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleDeleteManyOrder = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order,
            key: order._id,
            userName: order?.shippingAddress?.fullName,
            phone: order?.shippingAddress?.phone,
            address: order?.shippingAddress?.address,
            city: order?.shippingAddress?.city,
            paymentMethod: order?.paymentMethod,
            totalPrice: order?.totalPrice,
            isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
            isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
        };
    });

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [dataDeletedMany?.status, isErrorDeletedMany, isSuccessDeletedMany])
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'rgb(168 15 15 / 83%)', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => {
                        setIsModalOpenDelete(true);
                    }}
                />
            </div>
        );
    };

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
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            ...getColumnSearchProps('paymentMethod')
        },
        {
            title: 'isDelivered',
            dataIndex: 'isDelivered',
            key: 'isDelivered',
            ...getColumnSearchProps('isDelivered')
        },
        {
            title: 'isPaid',
            dataIndex: 'isPaid',
            key: 'isPaid',
            ...getColumnSearchProps('isPaid')
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            ...getColumnSearchProps('totalPrice')
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_, record) => renderAction(record),
        },
    ];

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Order deleted successfully');
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error('Failed to delete order');
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted?.status]);

    return (
        <div>
            <WrapperHeader> Quản lí đơn hàng </WrapperHeader>

            <div style={{ marginTop: '20px' }}>
                <TableComponent pagination={{ pageSize: 5 }} handleDeleteMany={handleDeleteManyOrder} columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id)
                        } // click row
                    };
                }} />
            </div>
            <ModalComponent title="Xóa đơn hàng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder} >
                <div>Bạn có muốn xóa đơn hàng này không?</div>
            </ModalComponent>
        </div>
    );
}

export default AdminOrder;