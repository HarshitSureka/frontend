import React, { useState , useEffect, useRef} from "react";
import Axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import Toast from 'react-bootstrap/Toast'
import {Row, Form, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import GeneralNavbar from '../components/GeneralNavbar';
import Navbar from '../components/Navbar';

////Register page of our website
//// registerUsername is the entered username by the user
//// registerPassword is the entered password by the user

//// authMsg is the flash message which may be show if 
//// user enters a used username or empty username or empty password

const ContactUs = (props) => {
    const [name, setName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [emailMessage, setEmailMessage] = useState("");
  	const [authMsg, setAuthMsg] = useState("");
  	const [showAuthMsg, setShowAuthMsg] = useState(false);
	const [emailTooltipMessage, setEmailTooltipMessage] = useState("Email can't be empty");
	const [nameTooltipMessage, setNameTooltipMessage] = useState("Name can't be empty");
	const [concernTooltipMessage, setConcernTooltipMessage] = useState("Concern can't be empty");
	const [validEmail, setValidEmail] = useState(false);
	const [validName, setValidName] = useState(false);
	const [validConcern, setValidConcern] = useState(false);
	
    const role = useRef('');

	const navigate = useNavigate();

	const contactus = () => {
	    Axios({
			method: "POST",
			data: {
			name: name,
			emailMessage: emailMessage,
            emailAddress: emailAddress
			},
			withCredentials: true,
			url: "/server/contactus",
      	}).then(function (response) {
        	setAuthMsg(response.data.message);
        	setShowAuthMsg(true);
     	});
  	};
    
    const handleEmailChange = (e) => {
		setEmailAddress(e.target.value)
		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if(e.target.value === ''){
			setEmailTooltipMessage("Email can't be empty");
			setValidEmail(false);
		}
		else if(emailRegex.test(e.target.value)){
			setEmailTooltipMessage('Email valid');
			setValidEmail(true);
		}else{
			setEmailTooltipMessage('Email invalid');
			setValidEmail(false);
		}
	}

    const handleNameChange = (e) => {
		setName(e.target.value);
		if(e.target.value === ''){
			setNameTooltipMessage("Name can't be empty");
			setValidName(false);
		}
		else{
			setNameTooltipMessage('');
			setValidName(true);
		}
	}
    
    const handleConcernChange = (e) => {
		setEmailMessage(e.target.value);
		if(e.target.value === ''){
			setConcernTooltipMessage("Name can't be empty");
			setValidConcern(false);
		}
		else{
			setConcernTooltipMessage('');
			setValidConcern(true);
		}
	}

  	useEffect ( () => {
    	Axios({
      		method: "GET",
      		withCredentials: true,
      		url: "/server/login",
      	}).then(function (response) {
			if (response.data.redirect == '/home') {
                role.current = response.data.user.role;
        	}else{
                role.current = 'unknown';
            }
     	}); 

  	}, []);

	return (
    <>
	<Helmet><title>Contact Us</title></Helmet>
    {role === 'unknown'? <GeneralNavbar/> : <Navbar  proprole={role}/>}
    <Row style={{ marginLeft: "0px",marginRight: "0px"}}>
        <Col >
        	<div>
				<Form style={{width:"50%", marginLeft:"25%", marginTop:"3%"}}>
            		<h1>Please fill this form</h1>
            		<Toast onClose={() => setShowAuthMsg(false)} show={showAuthMsg} delay={2000} autohide>
          
              			<Toast.Body>{authMsg}</Toast.Body>
            		</Toast>
					
					<Form.Group >
						<Form.Label>Enter your name</Form.Label>
                        <Form.Text style={{ color: validName? 'green':'red' }}>
							{nameTooltipMessage}
						</Form.Text>
						<Form.Control type="name" placeholder="Type your name here ..." 
						onChange={handleNameChange} />
					</Form.Group>
					<br/>
					<Form.Group >
                    	<Form.Label>Enter your email</Form.Label>
						<Form.Text style={{ color: validEmail? 'green':'red' }}>
							{emailTooltipMessage}
						</Form.Text>
                    	<Form.Control type="email" placeholder="Type your email here ..." 
						onChange={handleEmailChange} />
                	</Form.Group>
					<br/>
                	<Form.Group >
                        <Form.Label>Enter your concern</Form.Label>
                        <Form.Text style={{ color: validConcern? 'green':'red' }}>
							{concernTooltipMessage}
						</Form.Text>
                        <Form.Control as="textarea" placeholder="Type your concern here ..." 
                        onChange={handleConcernChange} />
                    </Form.Group>
                    <br/>
                	<Button variant={(validEmail && validName && validConcern)? 'success':'danger'} disabled = {!(validEmail && validName && validConcern)} onClick={contactus}>Submit</Button>
            	</Form>
        	</div>
        </Col>
    </Row>
    </>
  );
}
 
export default ContactUs;