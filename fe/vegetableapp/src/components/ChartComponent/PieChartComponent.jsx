/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService';

const PieChartComponent = (props) => {
  const user = useSelector((state) => state?.user);
  const [userCities, setUserCities] = useState([]); // Danh sách các city của user

  // Hàm lấy dữ liệu từ API hoặc Redux store
  const getAllOrder = async () => {
    try {
      const res = await OrderService.getAllOrder();
      if (res?.data) {
        const orders = res.data;
        // Trích xuất thông tin city từ mỗi user và lưu vào mảng userCities
        const cities = orders.map(order => order?.shippingAddress?.city);
        setUserCities(cities);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  // Tính toán số lượng user cho mỗi city
  const cityCounts = userCities.reduce((acc, city) => {
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Tạo dữ liệu cho biểu đồ tròn
  const data = Object.keys(cityCounts).map(city => ({
    name: city,
    value: cityCounts[city],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ height: 200, width: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
