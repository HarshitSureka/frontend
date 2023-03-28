import React, { useRef, useState , useEffect} from "react";
import {useParams} from 'react-router-dom';
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import {Badge, Card, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';

const SkillPage = () => {
    const {skillName} = useParams();
    const navigate = useNavigate();
	const role = useRef('');
	// const categories = useRef([]);
	const [categories, setCategories] = useState([]);

	const getSkillBySkillName = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/skills/${skillName}`,
		}).then((res) => {
			// console.log("skill name", skillName);
			// console.log("skill is ", res.data.data[0]);
			// categories.current = res.data.data[0].categories;
			// console.log("categories - ", categories.current);
			setCategories(res.data.data[0].categories);
		});
	};

	const handleCategorySelection=(category)=>{ 
        // console.log("handleCategorySelection",category);
		navigate(`/skills/${skillName}/${category}`);
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
				getSkillBySkillName();
				role.current = response.data.user.role;
			}
		}); 
		
	}, []);

    return ( 
        <>
		<Helmet><title>{skillName.split("_").join(" ")}</title></Helmet>
		<Navbar  proprole={role}/>
        <div className="skill-page">
			<br/>
			<h2 className="text-center"><Badge pill bg="light">{skillName.split("_").join(" ")}</Badge></h2>
			
			{(categories)? ((categories).map((category, i) =>
            <>
			<br/>
			<div key={i}>
			<Card >
				<Card.Header as="h5">{category.split("_").join(" ")}</Card.Header>
				<Card.Body>
					{/* <Card.Title>{category}</Card.Title> */}
					<Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text>
					<Button onClick={() => handleCategorySelection(category)}>Let's Go</Button> 
				</Card.Body>
			</Card>
			</div>
			</>
            )):null}
           
		   <br></br>
        </div>
		
        </>
     );
}
 
export default SkillPage;