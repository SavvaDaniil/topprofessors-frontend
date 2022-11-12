import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/main.css";
import "./assets/css/main_mobile.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import UserContext from './store/UserContext';
import UserMiddleWare from "./components/middlewares/UserMiddleWare.js";
import LoginLayout from './components/layouts/LoginLayout/LoginLayout';
//import MainLayout from './components/layouts/MainLayout/MainLayout';
import PrivateRouting from './components/routing/PrivateRouting/PrivateRouting';
import {LoginPageWithRouter} from './views/Login/LoginPage';
import IndexPage from './views/Index/IndexPage';
import CoursePage from './views/Course/CoursePage';
import DisciplinePage from './views/Discipline/DisciplinePage';
import TestPage from './views/Test/TestPage';
import OnlineAuditoriumPage from './views/OnlineAuditorium/OnlineAuditoriumPage';
//import IsAuthStatusContext from "./store/IsAuthStatusContext";
import {UserProvider} from './store/UserContext';//UserContext
import { SystemLoadingPage } from './views/SystemLoading/SystemLoadingPage';
import { SystemErrorPage } from './views/SystemError/SystemErrorPage';
//import { UserService } from './services/UserService';
//import AuthContext, {AuthProvider} from './store/AuthContext';

//const AuthStatusContext = React.createContext(0);
import constant from "./utils/GlobalValues";

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLauched : false,
      isError : false,
      user : {
        isAuthed : false
      }
    }
    this.checkAuthStatus = this.checkAuthStatus.bind(this);
  }

  async componentDidMount(){
    //var isAuth = 
    await this.checkAuthStatus();
  }

  async checkAuthStatus(){
    //console.log("checkAuthStatus");
    //this.setState({isLauched: true, isError : false});return;
    const userMiddleWare = new UserMiddleWare();
    const jwt = userMiddleWare.getJWTFromCookie();
    //console.log(jwt);
    if(jwt === null){
      this.setState({isLauched: true, isError : false});
      return;
    }

    fetch(constant.url + "/api", 
      {
        method : "GET",
        headers : {
          "Authorization" : "Bearer " + jwt
        }
      }
    )
    .then((response) => {
        //console.log("response.status: " + response.status);
        //if (!response.ok) throw new Error(response.error);
        if(response.status === 403){
          this.setState({isLauched: true, isError : false});
          return;
        }
        return response.json();
    })
    .then((result) => {
          //console.log("result:" + result);
          if(result.status === "success"){
            //console.log("Успех");
            this.setState({isLauched: true, isError : false, user : {isAuthed: true}});
          } else {
            //console.log("Провал");
            this.setState({isLauched: true, isError : false});
          }
        },
        (error) => {
          //console.log(error);
          this.setState({isLauched: true, isError : true});
        }
    );
    
  }
  
  render(){

    //const user = {isAuthed : true}

    if(!this.state.isLauched){
      return (
        <SystemLoadingPage />
      )
    }
    if(this.state.isError){
      return (
        <SystemErrorPage />
      )
    }
    //console.log("this.state.user.isAuthed: " + this.state.user.isAuthed);
    return (
      <UserProvider valueUser={this.state.user}>
        <BrowserRouter>
          <Routes>
              <Route path = "/" element={<PrivateRouting/>}>
                <Route path ="/" exact element={<IndexPage/>}></Route>
                <Route path ="/course/:id" exact element={<CoursePage />} />
                <Route path ="/course/:courseId/discipline/:disciplineId/lesson/:numberOfLesson" exact element={<DisciplinePage />} />
                <Route path ="/course/:courseId/discipline/:disciplineId/test/:testId/" exact element={<TestPage />} />
                <Route path="/auditorium" exact element={<OnlineAuditoriumPage/>} />
              </Route>

              <Route path="/login" element={<LoginLayout/>}>
                <Route path="/login" element={<LoginPageWithRouter/>}/>
              </Route>

          </Routes>
        </BrowserRouter>
      </UserProvider>
    );
  }
}


