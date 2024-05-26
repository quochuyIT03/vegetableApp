import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PieChartComponent from '../ChartComponent/PieChartComponent';
import SimpleBarChartComponent from '../ChartComponent/SimpleBarChartComponent';
import './style'; // Import file CSS riêng để style
import { AdminName, AdminStatisticsContainer, CardText, ChartContainer, ChartWrapper, UserInfo, UserInfo1, UserInfo2 } from './style';
import * as OrderService from '../../services/OrderService'
import { fomatall } from '../../fomatall';
import { Image } from 'antd';
const AdminStatistics = () => {
  const user = useSelector((state) => state?.user);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const adminAvatar = user?.avatar;
  const getAllOrder = async () => {
    try {
      const res = await OrderService.getAllOrder();
      if (res?.data) {
        const orders = res.data;
        setOrderCount(orders.length);

        // Tính tổng số tiền từ tất cả các đơn hàng
        const total = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
        setTotalRevenue(total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);
  return (
    <AdminStatisticsContainer>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
        <UserInfo>
          <h4 className="font-weight-normal mb-3">Tên Admin <i className="mdi mdi-chart-line mdi-24px float-right"></i></h4>
          <AdminName>{user?.name}</AdminName>
          <Image src={adminAvatar} alt="Admin Avatar" style={{ height: '50px', width: '50px', borderRadius: '50%', marginRight: '10px' }} />
          <CardText>{user?.address}</CardText>
        </UserInfo>

        <UserInfo1>
          <h4 className="font-weight-normal mb-3">Số lượng đơn đặt hàng <i className="mdi mdi-chart-line mdi-24px float-right"></i></h4>
          <AdminName> {orderCount}</AdminName>
          <CardText>{Math.round(((90 - orderCount) / 90) * 100) < 0 ? 'Increased' : 'Decreased'} by {Math.round(((90 - orderCount) / 90) * 100)}%</CardText>
        </UserInfo1>

        <UserInfo2>
          <h4 className="font-weight-normal mb-3">Số tiền kiếm được <i className="mdi mdi-chart-line mdi-24px float-right"></i></h4>
          <AdminName>{fomatall(totalRevenue)}</AdminName>
          <CardText>{Math.round((totalRevenue / 155200)) > 0 ? 'Increased' : 'Decreased'} by {Math.round((totalRevenue / 155200))}  to the previous month</CardText>
        </UserInfo2>
      </div>

      <ChartContainer>
        <ChartWrapper>
          <PieChartComponent />
        </ChartWrapper>
        <ChartWrapper>
          <SimpleBarChartComponent />
        </ChartWrapper>
      </ChartContainer>

      <ChartContainer style={{ display: 'flex' }}>
        <div>Biểu đồ các đặt hàng từ các tỉnh</div>
        <div>Biểu đồ tổng tiền và tổng đơn hàng</div>
      </ChartContainer>

    </AdminStatisticsContainer>

  );
};
export default AdminStatistics;
