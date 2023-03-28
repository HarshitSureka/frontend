import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'

import './App.css';
import Home from "./routes/Home";
import AddQuestions from "./routes/AddQuestions";
import AddChapters from "./routes/AddChapters";
import AddInformation from "./routes/AddInformation";
import SkillPage from "./routes/SkillPage";
import SkillCategoryPage from "./routes/SkillCategoryPage";
import InformationPage from "./routes/InformationPage";
import NotFound from './routes/NotFound';
import Login from './routes/Login';
import Register from './routes/Register';
import Quiz from './routes/Quiz';
import StartPage from "./routes/StartPage";
import ScorePage from "./routes/ScorePage";
import AccessDenied from "./routes/AccessDenied";
import ProfilePage from "./routes/ProfilePage";
import AllSkills from "./routes/AllSkills";
import AllCategories from "./routes/AllCategories";
import AllSubCategories from "./routes/AllSubCategories";
import AllInformation from './routes/AllInformation';
import AllQuestions from './routes/AllQuestions';
import EditQuestion from './routes/EditQuestion';
import EditInformation from './routes/EditInformation';
import EditSubCategory from './routes/EditSubCategory';
import EditCategory from './routes/EditCategory';
import EditSkill from './routes/EditSkill';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route exact path="/home" element={<Home/>}/>
          <Route exact path="/auth/login" element={<Login/>}/>
          <Route exact path="/auth/register" element={<Register/>}/>
          <Route exact path="/skills/:skillName" element={<SkillPage/>}/>
          <Route exact path="/skills/:skillName/:categoryName" element={<SkillCategoryPage/>}/>
          <Route exact path="/skills/:skillName/:category/:subcategory/information/:page" element={<InformationPage/>}/>
          <Route exact path="/addquestions" element={<AddQuestions/>}/>
          <Route exact path="/addinformation" element={<AddInformation/>}/>
          <Route exact path="/addchapters" element={<AddChapters/>}/>
          <Route exact path="/skills/:skillName/:category/:subcategory/quiz" element={<Quiz/>}/>
          <Route exact path="/skills/:skillName/:category/:subcategory/score" element={<ScorePage/>}/>
          <Route exact path="/accessdenied" element={<AccessDenied/>}/>
          <Route exact path="/profilepage" element={<ProfilePage/>}/>
          <Route exact path="/allskills" element={<AllSkills/>}/>
          <Route exact path="/allcategories/:skill" element={<AllCategories/>}/>
          <Route exact path="/allsubcategories/:skill/:category" element={<AllSubCategories/>}/>
          <Route exact path="/allinformation/:skill/:category/:subcategory" element={<AllInformation/>}/>
          <Route exact path="/allquestions/:skill/:category/:subcategory" element={<AllQuestions/>}/>
          <Route exact path="/editquestion/:skill/:category/:subcategory/:id" element={<EditQuestion/>}/>
          <Route exact path="/editinformation/:skill/:category/:subcategory/:id" element={<EditInformation/>}/>
          <Route exact path="/editsubcategory/:skill/:category/:subcategory" element={<EditSubCategory/>}/>
          <Route exact path="/editcategory/:skill/:category" element={<EditCategory/>}/>
          <Route exact path="/editskill/:skill" element={<EditSkill/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
    </Router>
  );
}

export default App;

/**
 * UseEffect Cleanup
 * Error Handling
 */