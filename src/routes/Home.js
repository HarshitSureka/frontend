import React, { useRef, useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button'
import {Row,  Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Card from 'react-bootstrap/Card';

////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents username of the logged in username
////join room is the invitation link to which user must be redirected to
const Home = (props) => {
	const [userName, setUserName] = useState(null);
	const [skills, setSkills] = useState([]);
	const role = useRef('');

	const navigate = useNavigate();

	////to get username of logged in user from the server
	const getUser = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/user",
		}).then((res) => {
			// console.log('res.data user', res.data);
			setUserName(res.data);
		});
	};

	const getSkills = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/skills",
		}).then((res) => {
			console.log('res.data skills', res.data.data);
      		setSkills(res.data.data);
		});
	}

	////to authenticate user before allowing him to enter the home page
	////if he is not redirect him to login page
	useEffect ( () => {
		// console.log("in use effect");
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/login",
		}).then(function (response) {
			if (response.data.redirect == '/login') {
				// console.log("Please log in");
				navigate(`/auth/login`);
			} 
			else{
				// console.log("Already logged in");
				role.current = response.data.user.role;
				getUser();
				getSkills();
			}
		}); 
		
	}, []);
		
	return (
		<>
		<Helmet><title>Home</title></Helmet>
		<Navbar  proprole={role}/>
		<Row style={{ marginLeft: "0px",marginRight: "0px"}}>
			<Col >
				<div>
					<br/>
					<br/>
					<br/>
					{userName ? <h1>Welcome Back {userName.username}</h1> : <h1>Welcome Back</h1>}
					<br />
					{(skills)? ((skills).map((skill, i) =>
					<>
						<br/>
						<div key={i}>
						<Card >
							<Card.Header as="h5">{skill.skill.split("_").join(" ")}</Card.Header>
							<Card.Body>
								{/* <Card.Title>{category}</Card.Title> */}
								<Card.Text>
								Lets learn about {((skill.categories)?(skill.categories).map((category, i) =><>{category.split("_").join(" ")}, </>):null)}
								</Card.Text>
								<Button onClick={() => navigate(`/skills/${skill.skill}`)}>Explore</Button>{' '} 
							</Card.Body>
						</Card>
						</div>
					</>
					)):null}
				</div>
			</Col>
		</Row>
		</>
	);
};

export default Home; 
/*
TODO: Scrollable drop down
*/