import React, { useRef, useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import {Card, Row,  Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';

const ProfilePage = (props) => {
	const [userName, setUserName] = useState(null);
	const navigate = useNavigate();
	const role = useRef('');
	const [score, setScore] = useState([]);

	const getScore = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/allScoresForUser",
		}).then((res) => {
			// console.log('score data',res.data);
			setScore(res.data);
		});
	};

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
                setUserName(response.data.user.username);
				role.current = response.data.user.role;
				getScore();
			}
		}); 
		
	}, []);
		
	return (
		<>
		<Helmet><title>Profile Page</title></Helmet>
		<Navbar  proprole={role}/>
		<Row style={{ marginLeft: "0px",marginRight: "0px"}}>
			<Col >
				<div>
					<br/>
					{userName ? <h1>Welcome Back {userName}</h1> : <h1>Welcome Back</h1>}
					<br/>
					<Link to="/updateemail"><Button variant="warning">Update Email</Button></Link>
					<br/>
					{score? (score).map((score, i) =>
					<>
					<br/>
					<Card key={i}>
						<Card.Header as="h5">{score.skill.split("_").join(" ")}</Card.Header>
						<Card.Body>
							<Card.Title>{score.category.split("_").join(" ")}</Card.Title>
							<Card.Text>You scored {score.points} points in {score.sub_category.split("_").join(" ")}</Card.Text>
						</Card.Body>
					</Card>
					</>
					):null}
				</div>
			</Col>
		</Row>
		</>
	);
};

export default ProfilePage; 
