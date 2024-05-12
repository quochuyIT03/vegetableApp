import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { Image } from 'antd'
import imagelogo from '../../assets/images/logo-login.jpg'
import {
    EyeFilled, EyeInvisibleFilled
   
  } from '@ant-design/icons';

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  return (
    <div style={{display:'flex', alignItems: 'center', justifyContent:'center', background: '#ccc', height:'100vh'}}>
        <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display:'flex'}} >
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập vào tài khoản</p>
        <InputForm style={{marginBottom: '10px'}} placeholder ="abc@gmail.com" />
        <div style={{position: 'relative'}}>
            <span
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
                    <EyeInvisibleFilled/>
                )
            }

            </span>
            <InputForm placeholder ="password" style={{marginBottom: '10px'}}/>
        </div>

            <div style={{position: 'relative'}}>
            <span
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
                    <EyeInvisibleFilled />
                )
            }
            </span>
            <InputForm placeholder ="confirm password" />
            </div>

      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imagelogo} preview={false} alt="image logo" height="203px" width="203px" />
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignUpPage
