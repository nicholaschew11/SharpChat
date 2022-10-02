import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

export const AccountContext = createContext();

const UserContext = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({loggedIn: null});
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
            credentials: "include",
        }).catch(error => {
            setUser({loggedIn: false});
            return;
        }).then(res => {
            if (!res || !res.ok || res.status >= 400) {
                setUser({loggedIn: false});
            }
            return res.json();
        }).then(data => {
            if (!data) {
                setUser({loggedIn: false});
                return;
            }
            setUser({...data});
            navigate("/home");
        });
    }, []);
    return (
        <AccountContext.Provider value={{user, setUser}}>
            {children}
        </AccountContext.Provider>
    )

}

export default UserContext;