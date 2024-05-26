import React, { useState } from 'react';
import { WrapperContainer, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };

    const handleResetPassword = async () => {
        try {
            const response = await UserService.resetPassword(email);
            if (response.status === 'OK') {
                setMessage('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    const handleNavigateSignIn = () => {
        navigate('/sign-in');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', height: '100vh' }}>
            <div style={{ width: '400px', borderRadius: '6px', background: '#fff', padding: '20px' }}>
                <h1>Quên Mật Khẩu</h1>
                <p>Nhập email của bạn để đặt lại mật khẩu</p>
                <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnChangeEmail} />
                {message && <span style={{ color: 'red' }}>{message}</span>}
                <ButtonComponent
                    disabled={!email.length}
                    onClick={handleResetPassword}
                    size={40}
                    styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 10px'
                    }}
                    textButton={'Đặt lại mật khẩu'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                />
                <p><WrapperTextLight onClick={handleNavigateSignIn}>Quay lại trang đăng nhập</WrapperTextLight></p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage
