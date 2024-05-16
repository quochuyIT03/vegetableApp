import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/logo-login.jpg'
import { Image } from 'antd'
import {
    EyeFilled, EyeInvisibleFilled
   
  } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
// import Loading from '../../components/LoadingCoponent/LoadingCoponent'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email, setEmail] = useState('');
    const location = useLocation()
    const [password, setPassword] = useState('');
    const disPatch = useDispatch();
    const navigate = useNavigate()

    const mutation = useMutationHooks(
     data => UserService.loginUser(data)
    )
    const { data, isSuccess } = mutation
    // const { data, isLoading } = mutation

    // useEffect(() => {
    //   console.log('location', location)
    //   const handleSuccessfulLogin = async () => {
    //     if (isSuccess) {
    //       localStorage.setItem('access_token', JSON.stringify(data?.access_token));
    //       if (data?.access_token) {
    //         const decoded = jwtDecode(data?.access_token);
    //         console.log('decode', decoded);
    //         if (decoded?.id) {
    //           handleGetDetailsUser(decoded?.id, data?.access_token);
    //           navigate('/');
    //         }
    //       }
    //     }
    //   };
    
    //   handleSuccessfulLogin();
    // }, [isSuccess]);

    useEffect(() => {
      if(isSuccess) {
        if(location?.state) {
          navigate(location?.state)
        }else{
          navigate('/')
        }
        localStorage.setItem('access_token', JSON.stringify(data?.access_token))
        if(data?.access_token){
          const decoded = jwtDecode(data?.access_token)
          console.log('decode', decoded )
          if(decoded?.id){
            handleGetDetailsUser(decoded?.id, data?.access_token)
            
          }
        }
      }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])
////////////////////////////////////////////////////////////////////////////////////////
    const handleGetDetailsUser = async (id, token) => {
      const res = await UserService.getDetailsUser(id, token)
      disPatch(updateUser({...res?.data, access_token: token}))
    }

    console.log('mutation', mutation)

    const handleNavigateSignUp = () => {
      navigate('/sign-up')
    }

    const handleOnChangeEmail = (value) => {
      setEmail(value)
  }

  const handleOnChangePassword = (value) => {
      setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email, password
    })
  }

  return (
    <div style={{display:'flex',
                alignItems: 'center', 
                justifyContent:'center',
                background: '#eee',
                height:'100vh'}}>
        <div style={{width: '800px', height:'445px', borderRadius:'6px', background: '#fff', display:'flex'}} >
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập vào tài khoản</p>
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
                    <EyeInvisibleFilled />
                )
            }
            </span>
            <InputForm placeholder ="password" type={isShowPassword ? "text" : "password"} value={password} onChange ={handleOnChangePassword}/>
        </div>
        
        {data?.status === 'ERR' && <span style={{color: 'red' }}>{data?.message}</span>}
        {/* <Loading isLoading={isLoading}> */}
          <ButtonComponent 
            disabled={!email.length || !password.length}
            onClick={handleSignIn}
            size = {40} 
            styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
                }}
                textButton = {'Đăng nhập'}
                styleTextButton ={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
        > </ButtonComponent>
        {/* </Loading> */}
                        <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                        <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản </WrapperTextLight></p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imagelogo} preview={false} alt="image logo" height="203px" width="203px" />
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignInPage
