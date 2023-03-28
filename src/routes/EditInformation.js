import React, { useRef, useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import {Row, Form, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';

const EditInformation = (props) => {
    const {skill, category, subcategory, id} = useParams();
    const [information, setInformation] = useState("");
    const [heading, setHeading]= useState("");
    const role = useRef('');

    const navigate = useNavigate();

    const getInformation = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/informationById/${id}`,
		}).then((res) => {
            // console.log('info rec',res.data.data);
            setInformation(res.data.data.information);
            setHeading(res.data.data.heading);
		});
	};

    const submit = () => {
        Axios({
            method: "POST",
            data: {
                heading: heading,
                information: information,
            },
            withCredentials: true,
            url: `/server/editinformation/${id}`,
        }).then(function (response) {
            console.log('Success'); 
            window.location.reload();
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
                role.current = response.data.user.role;
                getInformation();
            } 
		}); 
	}, []);

    return ( 
        <>
        <Helmet><title>Edit Information</title></Helmet>
        <Navbar proprole={role} />
        <Row style={{ marginLeft: "0px",marginRight: "0px"}}>
            <Col >
                <div>
                    <Form style={{width:"80%", marginLeft:"10%", marginTop:"3%"}}>
                        <h1>Edit Information</h1>
                        <Form.Group >
                            <Form.Label>Edit Heading</Form.Label>
                            <Form.Control type="string" defaultValue = {heading}
                            onChange={(e) => setHeading(e.target.value)} />
                        </Form.Group>
                        <br></br>

                        {<Form.Group >
                            <Form.Label>Edit Information</Form.Label>
                            <Form.Control as="textarea"  defaultValue = {information}
                            onChange={(e) => setInformation(e.target.value)} />
                        </Form.Group>}
                        <br></br>

                        <Button  onClick={submit}>Submit</Button>
                        <br />
                        <br />
                    </Form>
                </div>
            </Col>
        
        </Row>
        
        </>
     );
}

export default EditInformation;