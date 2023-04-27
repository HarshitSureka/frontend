import React, { useState, useEffect } from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast'
import {Row, Form, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import GeneralNavbar from '../components/GeneralNavbar';

/////Login page of our website
//// loginUsername is the entered username by the user
//// loginPassword is the entered password by the user

//// authMsg is the flash message which may be show if 
//// user enters wrong user name or password



const Login = (props) => {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [authMsg, setAuthMsg] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [showPassword, setShowPassword]=useState(false);
    const navigate = useNavigate();

	const handleShowPassword = () =>{
		setShowPassword(!showPassword);
	}

    ////function to authenticate user from the server after he has entered the credentials,
    //// if he is authorized redirect him to home page , otherwise dsiplay the flash message
    const login = () => {
        // console.log('hist ', props);
        Axios({
            method: "POST",
            data: {
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == '/home') {
                navigate(`/home`);
            } 
        });
    };

    const forgotPassword = () => {
        Axios({
            method: "POST",
            data: {
                username: loginUsername,
            },
            withCredentials: true,
            url: "/server/forgotpasswordform",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == '/forgotpasswordmailsent') {
                navigate(`/forgotpasswordmailsent`);
            } 
        });
    };

    ////when a user requests for the login , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the login page to enter credentials
    
    useEffect ( () => {
        // console.log('hist ', props.history);
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == '/home') {
                navigate(`/home`);
            } 
        }); 

    }, []);

    return ( 
        <>
        <Helmet><title>Login</title></Helmet>
        <GeneralNavbar/>
        <Row style={{ marginLeft: "0px",marginRight: "0px"}}>
            <Col >
                <div>
                    <br/>
                    <br/>
                    <br/>
                    <Form style={{width:"50%", marginLeft:"25%", marginTop:"3%"}}>
                        <h1>Login</h1>
                        <Toast onClose={() => setShowAuthMsg(false)} show={showAuthMsg} delay={2000} autohide>
                            <Toast.Body>{authMsg}</Toast.Body>
                        </Toast>
                        <Form.Group >
                            <Form.Label>Enter your username</Form.Label>
                            <Form.Control type="username" placeholder="Type your username here ..." 
                            onChange={(e) => setLoginUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Enter your password</Form.Label>
                            <Form.Control type={showPassword?"text":"password"} placeholder="Enter your password"  
                            onChange={(e) => setLoginPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
 					        <Form.Check type="checkbox" label="Show Password" onClick={handleShowPassword} />
  				        </Form.Group>
                        
                        <Button  onClick={login}>Submit</Button>{' '}<Button variant="danger" onClick={forgotPassword}>Forgot Password</Button>
                        <br />
                        <br />
                        <div>Dont have an account? Register Now...</div>
                        <br />
                        <Link to="/auth/register"><Button >Register</Button></Link>
                    </Form>
                </div>
            </Col>
        </Row>
        
        </>
     );
}

export default Login;
