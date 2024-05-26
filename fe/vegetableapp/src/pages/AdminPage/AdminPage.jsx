import React, { useState } from 'react';
import { AppstoreOutlined, UserOutlined, ShoppingOutlined, LineChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { getItem } from '../../utils';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminStatistics from '../../components/AdminStatistics/AdminStatistics';


const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingOutlined />),
        getItem('Thống kê', 'statistics', <LineChartOutlined />),
    ];


    const [keySelected, setKeySelected] = useState('')

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            case 'order':
                return (
                    <AdminOrder />
                )
            case 'statistics':
                return <AdminStatistics />;

            default:
                return <></>
        }
    }

    const handleOnClick = ({ key }) => {
        console.log('click', { key })
        setKeySelected(key)
    }
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddencart />
            <div style={{ display: 'flex', }}>
                <Menu
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh'
                    }}
                    mode="inline"
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '15px', background: '#f2edf378' }} >
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    );
}
export default AdminPage
