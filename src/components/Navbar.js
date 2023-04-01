import React, { useState ,useRef, useEffect} from "react";
import Axios from "axios";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import {Link, useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';


const Navbar = ({proprole}) => {
    const [showBasic, setShowBasic] = useState(false);
	const [searchValue, setSearchValue] = useState("");
  const skills = useRef([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [role, setRole] = useState('');

	const navigate = useNavigate();

  const handleLogOut = () =>{
		// console.log('logging Out!!');
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/logout",
		}).then((res) => {
			// console.log("Redirect back to Home");
			navigate(`/`);
		});
	}

    const onChangeSearchValue = (event) => {
		setSearchValue(event.target.value);
    setFilteredSkills((skills.current)
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

    useEffect (() => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/skills",
		}).then((res) => {
      skills.current = res.data.data;
      setRole(proprole.current);
		});
	},[]);

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand onClick ={() => navigate(`/home`)}>Skillingo</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
            <MDBNavbarLink onClick = {handleLogOut}>Logout</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink onClick = {()=> navigate(`/profilepage`)}>View Profile</MDBNavbarLink>
            </MDBNavbarItem>

            {role === 'admin'?
            <MDBNavbarItem>
            
              <MDBNavbarLink onClick = {()=> navigate(`/addchapters`)}>Add Chapters</MDBNavbarLink>
              </MDBNavbarItem> 
              : null
            }

            {role === 'admin'?
            <MDBNavbarItem>
            
              <MDBNavbarLink onClick = {()=> navigate(`/addinformation`)}>Add Information</MDBNavbarLink>
              </MDBNavbarItem> 
              : null
            }

            {role === 'admin'?
            <MDBNavbarItem>
            
              <MDBNavbarLink onClick = {()=> navigate(`/addquestions`)}>Add Questions</MDBNavbarLink>
              </MDBNavbarItem> 
              : null
            }

            {role === 'admin'?
            <MDBNavbarItem>
            
              <MDBNavbarLink onClick = {()=> navigate(`/allskills`)}>Edit/Delete</MDBNavbarLink>
              </MDBNavbarItem> 
              : null
            }

          </MDBNavbarNav>
          <div className="search-container">
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

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}; 

export default Navbar;