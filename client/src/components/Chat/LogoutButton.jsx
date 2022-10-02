import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router';

const LogoutButton = () => {
    const navigate = useNavigate();
    const logoutUser = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).catch(error => {
            return;
        }).then(response => {
            if (!response || !response.ok || response.status >= 400) {
                return;
            }
            return response.json();
        }).then(res => {
            if (!res) return;
            navigate("/");
        });
        }
  return (
    <Button w="100%" onClick={() => logoutUser()}>Logout</Button>
  )
}

export default LogoutButton