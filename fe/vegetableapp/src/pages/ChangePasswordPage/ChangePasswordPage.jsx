import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import * as UserService from '../../services/UserService';
import { useSelector } from 'react-redux';

const ChangePasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        if (userEmail) {
            form.setFieldsValue({ email: userEmail });
        }
    }, [userEmail, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { email, newPassword, confirmPassword } = values;

            // Kiểm tra xác nhận mật khẩu mới
            if (newPassword !== confirmPassword) {
                message.error('Mật khẩu mới không khớp');
                setLoading(false);
                return;
            }

            // Gọi API đổi mật khẩu
            const response = await UserService.changePassword(email, newPassword);

            if (response.status === 'OK') {
                message.success(response.message);
                // Cập nhật giao diện hoặc chuyển hướng đến trang khác sau khi đổi mật khẩu thành công
            } else {
                message.error(response.message);
                // Xử lý khi có lỗi trả về từ API
            }
        } catch (error) {
            console.error('Đổi mật khẩu thất bại:', error);
            message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
            <h1>Đổi mật khẩu</h1>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ' },
                    ]}
                    hasFeedback
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Mật khẩu mới không khớp');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePasswordPage