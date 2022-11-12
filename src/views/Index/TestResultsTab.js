import { Component } from "react";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";
import constant from "../../utils/GlobalValues";

import CourseResultOfUserLite from "../../components/Course/CourseResultOfUserLite";

//import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TestUserResult from "../../components/TestUser/TestUserResult";
//import { Link } from "react-router-dom";


export default class TestResultsTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false, 
            isError : false,

            isCollapsed: false,
            isShowModalMoreInfo : false,

            courseResultOfUserLiteViewModels : [],
            testLiteViewModel: null,
            testUserResultOfUserViewModel : null,
        }
        this.changeCollapsed = this.changeCollapsed.bind(this);
        this.handleModalMoreInfo = this.handleModalMoreInfo.bind(this);

        this.listAllCourseResultLites = this.listAllCourseResultLites.bind(this);
        //this.handleGetMoreInfoAboutTestDelegate = this.handleGetMoreInfoAboutTestDelegate.bind(this);
        this.getMoreInfoAboutTestUser = this.getMoreInfoAboutTestUser.bind(this);
    }

    listAllCourseResultLites(){
        this.setState({
            isLoading : true, 
            isError : false
        });
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/course/user/list_all_result_lites", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({
                isLoading : false, 
                isError : false
            });
            console.log(result);
            if(result.status === "success" && result.coursesResultOfUserLitesViewModel !== null){
                this.setState({
                    courseResultOfUserLiteViewModels : result.coursesResultOfUserLitesViewModel.courseResultOfUserLiteViewModels
                });
            } else {
                this.setState({isError : true});
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }
    
    getMoreInfoAboutTestUser(testId){
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            testId : parseInt(testId, 10)
        }
        fetch(constant.url + "/api/test_user/user/get_result", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success" && result.testLiteViewModel !== null 
                && result.testUserResultOfUserViewModel !== null){
                this.setState({
                    testLiteViewModel : result.testLiteViewModel,
                    testUserResultOfUserViewModel : result.testUserResultOfUserViewModel
                });
                this.handleModalMoreInfo(true);
            } else {
                this.setState({isError : true});
            }
            },
            (error) => {
                this.setState({isError : true});
            }
        )
    }


    changeCollapsed(){
        this.setState({isCollapsed : !this.state.isCollapsed});
    }
    handleModalMoreInfo(value){
        this.setState({isShowModalMoreInfo : value});
    }

    render(){

        if(this.state.isError){
            return(
                <PanelTemplateError tryAgainDelegate={this.listAllCourseResultLites} />
            )
        }

        if(this.state.isLoading){
            return(
                <PanelTemplateLoading />
            )
        }

        var courseResultOfUserLiteViewModels = "";
        if(this.state.courseResultOfUserLiteViewModels !== null){
            courseResultOfUserLiteViewModels = this.state.courseResultOfUserLiteViewModels.map(courseResultOfUserLiteViewModel => {
                return <CourseResultOfUserLite
                    key={courseResultOfUserLiteViewModel.id}
                    courseResultOfUserLiteViewModel = {courseResultOfUserLiteViewModel}
                    handleGetMoreInfoAboutTestDelegate = {this.getMoreInfoAboutTestUser}
                />
            });
        }

        return(
            <>
                <IndexPanelTitle title="Результаты тестирования" />

                {courseResultOfUserLiteViewModels}



                <Modal show={this.state.isShowModalMoreInfo} onHide={() => this.handleModalMoreInfo(false)} size="lg"
                className="modalTestUserResult">
                    <Modal.Header closeButton>
                        <Modal.Title>Подробнее о сдаче теста</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <TestUserResult
                            testLiteViewModel={this.state.testLiteViewModel}
                            testUserResultOfUserViewModel={this.state.testUserResultOfUserViewModel}
                            />
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleModalMoreInfo(false)}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

/*

<div className="col-1 d-none d-md-block"></div>
<div className="col-12 col-lg-10 col-md-10 col-sm-12 row">
    <div className="course-result-preview col-12 row">
        <div className="col-8">
            <p>
            Построение профессиональной траектории преподавателя вуза в соответствии со стратегическими целями развития сферы науки и образования
            </p>
        </div>
        <div className="col-4">
            <div className="alert alert-success" role="alert">
                Курс сдан
            </div>
        </div>
        <div className="col-12 div-for-collapse-btn">
            <button onClick={this.changeCollapsed}  className="btn btn-sm">развернуть</button>
        </div>
        <Collapse in={this.state.isCollapsed}>
            <div className="row col-12">
                <div className="test-preview row col-12">
                    <div className="col-8">
                        <Link to="/discipline/0"><p>Современное состояние системы образования</p></Link>
                    </div>
                    <div className="col-4">
                        <div className="alert alert-danger" role="alert" onClick={() => this.handleModalMoreInfo(true)}>
                            Не сдан или не пройден 75%<br />
                            <span>подробнее</span>
                        </div>
                    </div>
                </div>

            </div>
        </Collapse>
    </div>
</div>
*/