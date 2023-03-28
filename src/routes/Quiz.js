import React, { useState , useEffect, useRef} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import Axios from "axios";
import {Form, Badge, Button, Card, ListGroup} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';
import Modal from 'react-bootstrap/Modal';

const Quiz = () => {
    const {skillName, subcategory, category} = useParams();
    const navigate = useNavigate();

	const skillDetails = useRef({});
	const questionSet = useRef([]);
	const currentQuestionIndex = useRef(0);
	const maxQuestions = useRef(0);
	const correctAnswers = useRef([]);
	const score = useRef([]);
	const points = useRef(0);
	const role = useRef('');

	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [currentExplaination, setCurrentExplaination] = useState(null);
	const [optionSet, setOptionSet] = useState([]);
	const [answersList, setAnswersList] = useState([]); 
	const [currentIsCorrect, setCurrentIsCorrect] = useState(false);

	const [showExplaination, setShowExplaination] = useState(false);

	const check = () => {
		if(JSON.stringify(answersList) === JSON.stringify(correctAnswers.current)){
			score.current[currentQuestionIndex.current] = 1;
			points.current = (points.current)+1;
			setCurrentIsCorrect(true);
		}
		else{
			setCurrentIsCorrect(false);
		}
		setAnswersList([]);
		setShowExplaination(true);
    };

	const next = () => {
		var newQuestionIndex = Math.min((currentQuestionIndex.current)+1,(maxQuestions.current)-1);
		currentQuestionIndex.current = newQuestionIndex;
        setCurrentQuestion(questionSet.current[newQuestionIndex].question);
        setCurrentExplaination(questionSet.current[newQuestionIndex].explaination);
		setOptionSet(questionSet.current[newQuestionIndex].options);
		correctAnswers.current = questionSet.current[newQuestionIndex].correct_answers;
		setShowExplaination(false);
	}

	// TODO: 
	const saveScore = () => {
		Axios({
            method: "POST",
            data: {
				skill: skillName, 
				category: category,
				sub_category: subcategory,
				points:points.current,
			},
            withCredentials: true,
            url: "/server/savescore",
        }).then(function (response) {
            console.log('Success'); 
			navigate(`/skills/${skillName}/${category}/${subcategory}/score`, {state:{data:{score:score, points:points}}})
        });
	};

	const handleAnswer= i=>{
        var tempAnswersList = answersList;
        if(answersList.includes(i)) tempAnswersList = (tempAnswersList.filter( j => j!=i));
        else                        tempAnswersList = (tempAnswersList.concat(i));
		tempAnswersList = tempAnswersList.sort();
		setAnswersList(tempAnswersList);
    }

    const getAllQuestions = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/questions/${skillName}/${category}/${subcategory}`,
		}).then((res) => {
			questionSet.current = res.data.data;
			maxQuestions.current = res.data.data.length;
            setCurrentQuestion(res.data.data[0].question);
			setCurrentExplaination(res.data.data[0].explaination);
			setOptionSet(res.data.data[0].options);
			correctAnswers.current = res.data.data[0].correct_answers;
			var tempScore = [];
			for(var i = 0; i < (res.data.data.length); i++) {
				tempScore.push(0);
			}
			score.current = tempScore;
		});
	};

	const getSkillBySkillName = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/skills/${skillName}`,
		}).then((res) => {
			skillDetails.current = res.data.data;
		});
	};

    ////to authenticate user before allowing him to enter the home page
	////if he is not redirect him to login page
	useEffect ( () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/login",
		}).then(function (response) {
			if (response.data.redirect == '/login') {
				navigate(`/auth/login`);
			} 
			else{
				getSkillBySkillName();
				getAllQuestions();
				role.current = response.data.user.role;
			}
		}); 
		
	}, []);

    return ( 
        <>
		<Helmet><title>Quiz</title></Helmet>
		<Navbar  proprole={role}/>
		<br/>
		<h2 className="text-center"><Badge pill bg="light">{skillName.split("_").join(" ")} {'->'} {category.split("_").join(" ")} {'->'} {subcategory.split("_").join(" ")}</Badge></h2>

		<Card className="d-flex flex-column" style={{width: "80%", margin: "0 auto", borderRadius: '15px'}}>

			{/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
			<Card.Body>
				<Card.Title>Question {(currentQuestionIndex.current) + 1}</Card.Title>
				<Card.Text>{currentQuestion}</Card.Text>
			</Card.Body>
			<ListGroup className="list-group-flush">
			{optionSet.map((option, i) =>
            <ListGroup.Item key={i}> 
				<Form.Check type="checkbox" onClick={()=> handleAnswer(i)} checked={answersList.includes(i)} label={option}/>
			</ListGroup.Item>
            )}
			</ListGroup>
			<Card.Body>

				<Button variant="primary" onClick={check}>Submit</Button>

				<Modal show={showExplaination}>
					<Modal.Header>
					<Modal.Title><>{currentIsCorrect? 'Correct Answer':'Oops, That is Incorrect'}</></Modal.Title>
					</Modal.Header>
					<Modal.Body>{currentExplaination}</Modal.Body>
					<Modal.Footer>
					{((currentQuestionIndex.current) + 1 === (maxQuestions.current)) &&
					<><Button  onClick={()=> { next(); saveScore();}}>End Quiz</Button>{' '}</>}
					{((currentQuestionIndex.current) + 1 < (maxQuestions.current)) &&
					<><Button  onClick={next}>Next</Button>{' '}</>}
					</Modal.Footer>
				</Modal>
			</Card.Body>
    	</Card>
        </>
     );
}
 
export default Quiz;

///TODO: change hard coded value 5