import React, { useState } from 'react';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { getItem } from '../../utils';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';


const AdminPage = () => {
    const items= [
        getItem('Người dùng', 'user', <UserOutlined/>),
        getItem('Sản phẩm', 'product', <AppstoreOutlined/>)
      ];


    const [keySelected, setKeySelected] = useState('')
    
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                <AdminUser/>
                )
            case 'product':
                return (
                <AdminProduct/>
                )    
        
            default:
                return<></>
        }
    }

    const handleOnClick = ({ key }) => {
        console.log('click',{ key } )
        setKeySelected(key)
    }
    return (
        <>
        <HeaderComponent isHiddenSearch isHiddencart />
        <div style={{ display: 'flex', }}>
            <Menu
        //   openKeys={openKeys}
        //   onOpenChange={onOpenChange}
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh'
           }}
          mode="inline"
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: '15px' }} >
            {renderPage(keySelected)}
        </div>
        </div>
        </>
      );
}
export default AdminPage
