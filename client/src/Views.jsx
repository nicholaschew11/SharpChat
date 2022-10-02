import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PrivateRoutes from './PrivateRoutes';
import { AccountContext } from './components/AccountContext';
import Home from './components/Chat/Home';

const Views = () => {
  const {user} = useContext(AccountContext);
  return user.loggedIn === null ? ( 
    //blank loading page
    <></>
  ) : (
    <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<SignUp />}/>
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />}/>
        </Route>
        <Route path="*" element={<Login />}/>
    </Routes>
  );
};

export default Views