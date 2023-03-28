import React, { useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {Row,  Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import GeneralNavbar from '../components/GeneralNavbar';

////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents username of the logged in username
////join room is the invitation link to which user must be redirected to
const StartPage = (props) => {
	const navigate = useNavigate();

	////to authenticate user before allowing him to enter the home page
	////if he is not redirect him to login page
	useEffect ( () => {
		// console.log("in use effect");
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/login",
		}).then(function (response) {
			if (response.data.redirect != '/login') {
				// console.log("Already logged in");
                navigate(`/home`);
			}
			else	{
				navigate('/auth/login');
			}
		}); 
	}, []);

	return (
		<>
		<Helmet><title>Quiz</title></Helmet>
		<GeneralNavbar/>
		<Row style={{ marginLeft: "10px",marginRight: "10px", marginTop:"10px"}}>
			<Col >
			
				<img style={{ width: window.innerWidth*0.95, height: window.innerHeight*0.9 }} src="https://blog.ipleaders.in/wp-content/uploads/2021/07/Top-12-Pioneers-in-Education-scaled.jpg" alt="React Logo" />
			</Col>
		</Row>
		</>
	);
};

export default StartPage; 