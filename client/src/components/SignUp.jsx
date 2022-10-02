import {useState} from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Heading, Input, VStack, FormControl, FormLabel, Button, FormErrorMessage, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { AccountContext } from './AccountContext';
import { useContext } from 'react';
import Title from './Title';

const SignUp = () => {
    const {setUser} = useContext(AccountContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const loginSchema = Yup.object({
        username: Yup.string().required("Username Required").min(5, "Too Short").max(30, "Too Long"),
        password: Yup.string().required("Password Required").min(5, "Too Short").max(30, "Too Long"),
    });

    const formik = useFormik({
        initialValues: {username: "", password: ""},
        validationSchema: loginSchema,
        onSubmit: (values, actions) => {
            const data = {...values};
            actions.resetForm();
            fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).catch(error => {
                return;
            }).then(response => {
                if (!response || !response.ok || response.status >= 400) {
                    return;
                }
                return response.json();
            }).then(res => {
                if (!res) return;
                setUser({...res});
                if (res.status) {
                    setError(res.status);
                } else if (res.loggedIn) {
                    navigate("/home");
                }
            });
        }
    });

  return (
    <VStack as="form" w={{base: "90%", md: "400px"}} m="auto" justify="center" h="80vh" spacing="1rem" onSubmit={formik.handleSubmit}>
        <Title />
        <Heading>SIGN UP</Heading>
        <FormControl isInvalid={formik.errors.username && formik.touched.username}>
            <FormLabel>Username</FormLabel>
            <Input name="username" placeholder="Enter username" autoComplete="off" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={formik.errors.password && formik.touched.password} paddingBottom={5}>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" placeholder="Enter password" autoComplete="off" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>
        <Text as="p" color="red">{error}</Text>
        <Button colorScheme="teal" type="submit" rightIcon={<ArrowForwardIcon />} variant="outline">CREATE ACCOUNT</Button>
        <Button colorScheme="orange" onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />} variant="outline">GO BACK</Button>
    </VStack>
  )
}

export default SignUp;