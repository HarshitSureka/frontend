import React, { useRef, useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button'
import {Row,  Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import {MDBBtn} from 'mdb-react-ui-kit';

////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents username of the logged in username
////join room is the invitation link to which user must be redirected to
const Home = (props) => {
	const [searchValue, setSearchValue] = useState("");
	const [userName, setUserName] = useState(null);
	const [skills, setSkills] = useState([]);
	const [selectedSkill, setSelectedSkill] = useState(null);
	const [categories, setCategories] = useState([]);
	const role = useRef('');
	const [filteredSkills, setFilteredSkills] = useState([]);
	const [user, setUser] = useState(null);
	const [lastPlayed, setLastPlayed] = useState(null);
	const [continueHeader, setContinueHeader] = useState('');
	const [continueButtonHeader, setContinueButtonHeader] = useState('');
	const [navigateTo, setNavigateTo] = useState(null);
	const navigate = useNavigate();

	const onChangeSearchValue = (event) => {
		setSearchValue(event.target.value);
    setFilteredSkills((skills)
      .filter((item) => {
      const searchTerm = (event.target.value).toLowerCase();
      const fullName = item.skill.toLowerCase();

      return (
        searchTerm &&
        fullName.includes(searchTerm)
      );
      })
      .slice(0, 10));
	};

    const onSearch = (searchTerm) => {
		setSearchValue(searchTerm);
		// our api to fetch the search result
		// console.log("search ", searchTerm);
		navigate(`/skills/${searchTerm}`);	
    window.location.reload();
	};


	const getSkills = (last_played) => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/skills",
		}).then((res) => {
			// console.log('res.data skills', res.data.data);
      		setSkills(res.data.data);
			setSelectedSkill(res.data.data[0]);
			// console.log('last_played', last_played);
			if(Object.entries(last_played).length > 0) {
				if(last_played.skill === null){
					// console.log('skill is null');
					setContinueHeader('Explore new Skills');
				}
				else{
					var tempSkills = res.data.data;
					var ind;
					for(var i=0; i<tempSkills.length; i++){
						if(tempSkills[i].skill === last_played.skill)	ind = i;
					}
					// console.log('last_played', last_played);
					// console.log("ind", ind);
					var lastPlayedSkill = tempSkills[ind];
					var subCategories = [];
					lastPlayedSkill.sub_categories.forEach(function(subCategory) {
						if(subCategory.category === last_played.category){
							subCategories = subCategories.concat(subCategory.sub_category);
						}
					})
					var categories = lastPlayedSkill.categories;
					// console.log('categories', categories);
					// console.log('subCategories', subCategories);
					
					var subCategoryIndex = subCategories.indexOf(last_played.sub_category);
					var categoryIndex = categories.indexOf(last_played.category);

					if(subCategoryIndex+1 < subCategories.length){
						// console.log('continue with subCategoryIndex', subCategories[subCategoryIndex+1]);
						setContinueHeader('In Progress: ' + last_played.skill + ' -> ' + last_played.category );
						setContinueButtonHeader(subCategories[subCategoryIndex+1]);
						setNavigateTo(`/skills/${last_played.skill}/${last_played.category}/${subCategories[subCategoryIndex+1]}/information/${0}`)
					}
					else if(categoryIndex +1 < categories.length){
						// console.log('continue with categoryIndex', categories[categoryIndex+1]);
						setContinueHeader('In Progress: ' + last_played.skill);
						setContinueButtonHeader(categories[categoryIndex+1]);
						setNavigateTo(`/skills/${last_played.skill}/${categories[categoryIndex+1]}`);
					}
					else{
						// console.log('explore new skill');
						setContinueHeader('Explore new Skills');
					}
				}
			}
			else{
				// console.log('last played not set');
				setContinueHeader('Explore new Skills');
			}
		});
	}

	const getCategories = (forSkill) => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/categories/${forSkill}`
        }).then((res) => {
            // console.log('categories', res.data);
            setCategories(res.data.data);
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
				// console.log("Already logged in");
				role.current = response.data.user.role;
				setUser(response.data.user);
				setUserName(response.data.user.username);
				setLastPlayed(response.data.user.last_played);
				getSkills(response.data.user.last_played);
				// console.log("user is", response.data.user);
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
					{userName ? <h1>Welcome Back {userName}</h1> : <h1>Welcome Back</h1>}
					
					<br />
					<Card className="d-flex flex-column" style={{width: "80%", margin: "0 auto", borderRadius: '15px'}}>

			<Card.Header>{continueHeader}</Card.Header>
			<Card.Body>
				{/* <Card.Title>{information.heading}</Card.Title> */}
				
				<Card.Text>
					{continueHeader !== 'Explore new Skills'? <>Continue with <Button onClick={() => navigate(navigateTo)}>{continueButtonHeader}</Button> </>:null} 
				</Card.Text>
	
			</Card.Body>
			</Card>
					<br />
					<h3>Search</h3><hr style ={{
        height: '0.01px',
        backgroundColor: '#000000'}}></hr>

					
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
					<div className="search-container" style = {{width: "80%",}}>
						<form className='d-flex input-group w-auto'>
							<input type='search' value={searchValue} onChange={onChangeSearchValue} className='form-control' placeholder='Type query' aria-label='Search' />
							<MDBBtn color='primary' onClick={() => onSearch(searchValue)}>Search</MDBBtn>
							
							<Dropdown.Menu show={searchValue!=""}>
							{filteredSkills.map((item) => (						
							<Dropdown.Item key={item._id} onClick={() => onSearch(item.skill)}>{item.skill.split("_").join(" ")}</Dropdown.Item>
										))}
							</Dropdown.Menu>
						</form>
					</div>
					</div>
					<br/>
					<h3>Explore</h3><hr style ={{
        height: '0.01px',
        backgroundColor: '#000000'}}></hr>

					{/* <ToggleButtonGroup type="radio" name="radio">
					{(skills)? skills.map((skill, idx) => (
					<ToggleButton
						key={idx}
						id={`radio-${idx}`}
						variant={selectedSkill === skill.skill? 'success':'outline-success'}
						type="radio"
						value={skill.skill}
						checked={selectedSkill === skill.skill}
						onChange={(e) => {setSelectedSkill(e.target.value); getCategories(e.target.value); console.log(e.target.value);}}
					>
						{skill.skill.split("_").join(" ")}
					</ToggleButton>
					)):null}
					
				</ToggleButtonGroup> */}

				{(skills)? skills.map((skill, idx) => (
					<>
					<Button
						key={idx}
						id={`radio-${idx}`}
						variant={selectedSkill === skill.skill? 'success':'light'}
						value={skill.skill}
						onClick={(e) => {setSelectedSkill(e.target.value); getCategories(e.target.value); }}
						style = {{ borderRadius: '8px', margin:'2px 0px 2px 0px' }}
					>
						{skill.skill.split("_").join(" ")}
					</Button>{'  '}</>
					)):null}

				<br/>	
				<br/>	
					{(categories)? categories.map((category, idx) => (
					<>
						<Button
						variant='light'
						onClick={() => navigate(`/skills/${selectedSkill}/${category}`)}
						style = {{ borderColor: 'black', borderRadius: '8px', margin:'2px 0px 2px 0px' }}
						>
							{category.split("_").join(" ")}
						</Button>
						<br></br>
					</>
					)):null}
				</div>
				<br/>
			</Col>
		</Row>
		</>
	);
};

export default Home; 
/*
TODO: Scrollable drop down

{(skills)? ((skills).map((skill, i) =>
					<>
						<br/>
						<div key={i}>
						<Card >
							<Card.Header as="h5">{skill.skill.split("_").join(" ")}</Card.Header>
							<Card.Body>
								<Card.Text>
								Lets learn about {((skill.categories)?(skill.categories).map((category, i) =><>{category.split("_").join(" ")}, </>):null)}
								</Card.Text>
								<Button onClick={() => navigate(`/skills/${skill.skill}`)}>Explore</Button>{' '} 
							</Card.Body>
						</Card>
						</div>
					</>
					)):null}
*/