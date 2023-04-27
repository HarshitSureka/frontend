import React, { useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import Toast from 'react-bootstrap/Toast'
import {Row, Form, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import GeneralNavbar from '../components/GeneralNavbar';

////Register page of our website
//// registerUsername is the entered username by the user
//// registerPassword is the entered password by the user

//// authMsg is the flash message which may be show if 
//// user enters a used username or empty username or empty password

const Register = (props) => {
    const [registerUsername, setRegisterUsername] = useState("");
  	const [registerPassword, setRegisterPassword] = useState("");
  	const [registerEmail, setRegisterEmail] = useState("");

  	const [authMsg, setAuthMsg] = useState("");
  	const [showAuthMsg, setShowAuthMsg] = useState(false);
	const [showPassword, setShowPassword]=useState(false);
	const navigate = useNavigate();

	const handleShowPassword = () =>{
		setShowPassword(!showPassword);
	}

	////function to register user from the server after he has entered the information
    //// if all the information is valid redirect him to login page else display the flash message
  	const register = () => {
	    Axios({
			method: "POST",
			data: {
			username: registerUsername,
			email: registerEmail,
			password: registerPassword,
			role: "basic"
			},
			withCredentials: true,
			url: "/server/register",
      	}).then(function (response) {
        	setAuthMsg(response.data.message);
        	setShowAuthMsg(true);
        	if (response.data.redirect == '/') {
            	navigate(`/`);
        	} 
			else if(response.data.redirect == '/login') {
				navigate(`/auth/login`);
			}
     	});
  	};
   
  	////when a user requests for the register , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the register page to let him register
  	useEffect ( () => {
    	Axios({
      		method: "GET",
      		withCredentials: true,
      		url: "/server/register",
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
	<Helmet><title>Register</title></Helmet>
	<GeneralNavbar/>
    <Row style={{ marginLeft: "0px",marginRight: "0px"}}>
        <Col >
        	<div>
				<br/>
				<br/>
				<br/>
				<Form style={{width:"50%", marginLeft:"25%", marginTop:"3%"}}>
            		<h1>Register</h1>
            		<Toast onClose={() => setShowAuthMsg(false)} show={showAuthMsg} delay={2000} autohide>
          
              			<Toast.Body>{authMsg}</Toast.Body>
            		</Toast>
                	<Form.Group >
                    	<Form.Label>Enter a unique username</Form.Label>
                    	<Form.Control type="username" placeholder="Type your username here ..." 
						onChange={(e) => setRegisterUsername(e.target.value)} />
                	</Form.Group>
					<Form.Group >
                    	<Form.Label>Enter your email</Form.Label>
                    	<Form.Control type="email" placeholder="Type your username here ..." 
						onChange={(e) => setRegisterEmail(e.target.value)} />
                	</Form.Group>
                	<Form.Group >
	                    <Form.Label>Enter your password</Form.Label>
                    	<Form.Control type={showPassword?"text":"password"} placeholder="Enter your password"  
						onChange={(e) => setRegisterPassword(e.target.value)}/>
                	</Form.Group>
					<Form.Group controlId="formBasicCheckbox">
	 					<Form.Check type="checkbox" label="Show Password" onClick={handleShowPassword} />
  					</Form.Group>
                	<Button  onClick={register}>Submit</Button>
                	<br />
                	<br />
                	<div>Already have an account? Login Now...</div>
                	<br />
                	<Link to="/auth/login"><Button >Login</Button></Link>
            	</Form>
        	</div>
        </Col>
    </Row>
    </>
  );
}
 
export default Register;