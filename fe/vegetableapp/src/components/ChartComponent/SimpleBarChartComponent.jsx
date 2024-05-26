/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as OrderService from '../../services/OrderService'
const SimpleBarChartComponent = () => {
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
    const data = [
        {
            name: 'Tháng 2',
            totalPrice: 202220,
            totalOrder: 100000,
        },
        {
            name: 'Tháng 3',
            totalPrice: 62200,
            totalOrder: 7020,
        },
        {
            name: 'Tháng 4',
            totalPrice: 155220,
            totalOrder: 90000,
        },
        {
            name: 'Tháng 5',
            totalPrice: totalRevenue,
            totalOrder: orderCount,
        },

    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalPrice" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                <Bar dataKey="totalOrder" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
        </ResponsiveContainer>
    );
}


export default SimpleBarChartComponent
