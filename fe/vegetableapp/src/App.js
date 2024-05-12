import React, { Fragment, useEffect, useState } from 'react'
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode' 
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updatelUser } from './redux/slides/userSlide'
import Loading from './components/LoadingCoponent/LoadingCoponent'


function App() {
  const disPatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
    
  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    // Delay 1 giây trước khi tắt loading

  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
         decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if(decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}` 
    }

    // Do something before request is sent
    return config;
  },  (error) => {
    // Do something with request error
    return Promise.reject(error);
  });

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    disPatch(updatelUser({ ...res?.data, access_token: token}))
    setIsLoading(false)
  }

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return(
                <Route key={route.path} path={isCheckAuth ? route.path : '*'} element={
                <Layout>
                  <Page/> 
                </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}
export default App