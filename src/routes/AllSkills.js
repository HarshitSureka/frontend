import React, { useRef, useState , useEffect} from "react";
import {useParams} from 'react-router-dom';
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import {Modal, Badge, Card, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';

const AllSkills = () => {
    const navigate = useNavigate();
	const role = useRef('');
    const [skills, setSkills] = useState([]);
	const [skillToDelete, setSkillToDelete] = useState(null);

	const [showWarning, setShowWarning] = useState(false);
	const handleCloseWarning = () => setShowWarning(false);
	const handleShowWarning = () => setShowWarning(true);

	const handleSelect = (selectSkill) => {
		navigate(`/allcategories/${selectSkill.skill}`);
        // console.log('selected skill', selectSkill)
    };

    const handleEdit = (editSkill) => {
        // console.log('edited skill', editSkill);
		navigate(`/editskill/${editSkill.skill}/`);
    };

	const handleDeleteWarning = (deleteSkill) =>{
		handleShowWarning();
		setSkillToDelete(deleteSkill);
	};

    const handleDelete = (deleteSkill) => {
        // console.log('deleted skill', deleteSkill);
		Axios({
			method: "POST",
			withCredentials: true,
			url: `/server/deleteskill/${deleteSkill.skill}`,
		}).then((res) => {
			var updatedSkills = skills.filter((skillElement) => skillElement.skill !== deleteSkill.skill);
            setSkills(updatedSkills);
		});
    };

	const editOrdering = (editedSkill, index) => {
        Axios({
            method: "POST",
            data: {
                skill: editedSkill,
				order: index,
            },
            withCredentials: true,
            url: `/server/editskillordering/${editedSkill}/`,
        }).then(function (response) {
            // console.log('Success');     
        });
    };

	const handleMovingUp = (index) => {
		if(index){
			editOrdering(skills[index].skill, index);
			editOrdering(skills[index-1].skill, index+1);
		}
		else{
			var len = skills.length;
			editOrdering(skills[index].skill, len);
			editOrdering(skills[len-1].skill, index+1);
		}
		window.location.reload();
    };

	const handleMovingDown = (index) => {
		var len = skills.length;
		if(index != len-1){
			editOrdering(skills[index].skill, index+2);
			editOrdering(skills[index+1].skill, index+1);
		}
		else{
			editOrdering(skills[index].skill, 1);
			editOrdering(skills[0].skill, len);
		}
		window.location.reload();
    };

    const getAllSkills = () => {
        Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/skills",
		}).then((res) => {
            setSkills(res.data.data);
		});
    };

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
            else if(response.data.user.role === 'basic'){
                navigate(`/accessdenied`);
            }
			else{
				// console.log("Already logged in");
				getAllSkills();
				role.current = response.data.user.role;
			}
		}); 
		
	}, []);

    return ( 
        <>
		<Helmet><title>All Skills</title></Helmet>
		<Navbar  proprole={role}/>
        <div className="skill-page">
			<br/>
			<h2 className="text-center"><Badge pill bg="light">Edit/Delete Skill</Badge></h2>
			
			{(skills)? ((skills).map((skill, i) =>
            <>
			<br/>
			<div key={i}>
			<Card >
				<Card.Header as="h5">{skill.skill.split("_").join(" ")}</Card.Header>
				<Card.Body>
					{/* <Card.Title>{category}</Card.Title> */}
					<Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text>
					<Button onClick={() => handleSelect(skill)}>Select</Button>{' '} 
					<Button variant="warning" onClick={() => handleEdit(skill)}>Edit</Button>{' '} 
					<Button variant="danger" onClick={() => handleDeleteWarning(skill)}>Delete</Button>{' '}
					<Button variant="light" onClick={() => handleMovingUp(i)}>Move Up</Button>{' '} 
					<Button variant="dark" onClick={() => handleMovingDown(i)}>Move Down</Button> 
				</Card.Body>
			</Card>
			</div>
			{skillToDelete!=null && <Modal show={showWarning} onHide={handleCloseWarning}>
				<Modal.Header closeButton>
				<Modal.Title>Confirm Deleting {skillToDelete.skill.split("_").join(" ")}</Modal.Title>
				</Modal.Header>
				<Modal.Body>You sure, you want to delete?</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={() =>{ setSkillToDelete(null); handleCloseWarning(); }}>
					Cancel
				</Button>
				<Button variant="danger" onClick={() => {handleDelete(skillToDelete); setSkillToDelete(null); handleCloseWarning(); }}>
					Delete
				</Button>
				</Modal.Footer>
			</Modal>}
			</>
            )):null}
           
		   <br></br>
        </div>
		
        </>
     );
}
 
export default AllSkills;