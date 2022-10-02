import { Outlet, Navigate } from "react-router";
import { AccountContext } from "./components/AccountContext";
import { useContext } from "react";

const useAuth = () => {
    const {user} = useContext(AccountContext);
    return user && user.loggedIn;
}

const PrivateRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes;