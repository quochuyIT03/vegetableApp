import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { Image } from 'antd'
import imagelogo from '../../assets/images/logo-login.jpg'
import {
    EyeFilled, EyeInvisibleFilled
   
  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
// import Loading from '../../components/LoadingCoponent/LoadingCoponent'


const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

    const [email, setEmail] = useState('');
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const [password, setPassword] = useState('');
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const [confirmPassword, setConfirmpassword] = useState('');
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmpassword(value)
    }


    const navigate = useNavigate()
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )
    const {data, isSuccess, isError} = mutation
    // const {data, isLoading} = mutation

    useEffect(() => {
    if (isSuccess) {
        message.success();
        handleNavigateSignIn();
    } else if (isError) {
        message.error();
    }
}, [isSuccess, isError, handleNavigateSignIn]);

const isValidEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
    const handleSignUp = () => {
        if (!email || !password || !confirmPassword) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        // Kiểm tra định dạng email hợp lệ
        if (!isValidEmail(email)) {
            message.error('Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }
        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
            message.error('Mật khẩu xác nhận không trùng khớp');
            return;
        }
        mutation.mutate({ email, password, confirmPassword })
        console.log('sign-up',email, password, confirmPassword )
    }

  return (
    <div style={{display:'flex', alignItems: 'center', justifyContent:'center', background: '#ccc', height:'100vh'}}>
        <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display:'flex'}} >
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng ký tài khoản mới</p>
        <InputForm style={{marginBottom: '10px'}} placeholder ="abc@gmail.com" value={email} onChange ={handleOnChangeEmail}/>
        <div style={{position: 'relative'}}>
            <span
            onClick={() => setIsShowPassword(!isShowPassword)}
                style={{
                    zIndex: 10,
                    position: 'absolute',
                    top: '4px',
                    right: '8px'
                }}
            >{
                isShowPassword ?(
                    <EyeFilled />
                ) : (
                    <EyeInvisibleFilled/>
                )
            }

            </span>
            <InputForm placeholder ="password" style={{marginBottom: '10px' }} type={isShowPassword ? "text" : "password"} 
            value={password} onChange={handleOnChangePassword}/>
        </div>

        <div style={{position: 'relative'}}>
            <span
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                style={{
                    zIndex: 10,
                    position: 'absolute',
                    top: '4px',
                    right: '8px'
                }}
            >{
                isShowConfirmPassword ?(
                    <EyeFilled />
                ) : (
                    <EyeInvisibleFilled />
                )
            }
            </span>
            <InputForm placeholder ="Confirm password" type={isShowConfirmPassword ? "text" : "password"} 
            value={confirmPassword} onChange ={handleOnChangeConfirmPassword}/>
        </div>
        {data?.status === 'ERR' && <span style={{color: 'red' }}>{data?.message}</span>}
        {/* <Loading isLoading={isLoading}>     */}
            <ButtonComponent 
            disabled={!email.length || !password.length || !confirmPassword.length}
            onClick={handleSignUp}
            size = {40} 
            styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
                }}
                textButton = {'Đăng ký'}
                styleTextButton ={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
            ></ButtonComponent>
        {/* </Loading> */}
                        <p>Bạn đã có tài khoản?<WrapperTextLight onClick={handleNavigateSignIn} >Đăng nhập</WrapperTextLight></p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imagelogo} preview={false} alt="image logo" height="203px" width="203px" />
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignUpPage