
import { Component } from 'react';

//import Collapse from 'react-bootstrap/Collapse';
//import { Link } from "react-router-dom";
import DisciplineResultOfUser from '../Discipline/DisciplineResultOfUser';



export default class CourseResultOfUserLite extends Component{

    constructor(props){
        super(props);
        this.state = {
            isCollapsed: false,
            isShowModalMoreInfo : false,

            courseId : props.courseResultOfUserLiteViewModel.id,
            courseName : props.courseResultOfUserLiteViewModel.name,
            courseStatus : props.courseResultOfUserLiteViewModel.status,

            disciplineResultOfUserLiteViewModels : props.courseResultOfUserLiteViewModel.disciplineResultOfUserLiteViewModels,
        }
        this.changeCollapsed = this.changeCollapsed.bind(this);
        this.handleModalMoreInfo = this.handleModalMoreInfo.bind(this);
        this.handleGetMoreInfoAboutTestDelegate = this.handleGetMoreInfoAboutTestDelegate.bind(this);
    }

    changeCollapsed(){
        this.setState({isCollapsed : !this.state.isCollapsed});
    }
    handleModalMoreInfo(value){
        this.setState({isShowModalMoreInfo : value});
    }

    handleGetMoreInfoAboutTestDelegate(testId){
        //console.log("CourseResultOfUserLite handleGetMoreInfoAboutTestDelegate testId: " + testId);
        this.props.handleGetMoreInfoAboutTestDelegate(testId);
    }

    render(){

        var divAlertResult = "";
        switch(this.state.courseStatus){
            case "CLOSED":
                divAlertResult = <div className="alert alert-danger" role="alert">
                    Курс не доступен
                </div>
                break;
            case "OPENED":
                divAlertResult = <div className="alert alert-warning" role="alert">
                    Курс не сдан
                </div>
                break;
            case "DONE":
                divAlertResult = <div className="alert alert-success" role="alert">
                Курс сдан
            </div>
                break;
            default:
                break;
        }

        var disciplineResultOfUsers = "";
        if(this.state.disciplineResultOfUserLiteViewModels !== null){
            disciplineResultOfUsers = this.state.disciplineResultOfUserLiteViewModels.map(disciplineResultOfUserLiteViewModel => {
                return <DisciplineResultOfUser
                    key={disciplineResultOfUserLiteViewModel.id}
                    courseId={this.state.courseId}
                    id={disciplineResultOfUserLiteViewModel.id}
                    name={disciplineResultOfUserLiteViewModel.name}
                    isWithoutTest = {disciplineResultOfUserLiteViewModel.isWithoutTest}
                    testResultOfUserLiteViewModel={disciplineResultOfUserLiteViewModel.testResultOfUserLiteViewModel}
                    handleMoreInfoDelegate = {this.handleGetMoreInfoAboutTestDelegate}

                    isWithoutHomework = {disciplineResultOfUserLiteViewModel.isWithoutHomework}
                    homeworkUserResultLiteViewModel = {disciplineResultOfUserLiteViewModel.homeworkUserResultLiteViewModel}
                />
            });
        }

        return(
            <div className='col-12 row'>
                <div className="col-1 d-none d-md-block"></div>
                <div className="col-12 col-lg-10 col-md-10 col-sm-12 row">
                    <div className="course-result-preview col-12 row">
                        <div className="col-8">
                            <p>
                            {this.state.courseName}
                            </p>
                        </div>
                        <div className="col-4">
                            {divAlertResult}
                        </div>
                        <div className="col-12 div-for-collapse-btn">
                            <button onClick={this.changeCollapsed}  className="btn btn-sm">развернуть</button>
                        </div>
    
                        <div className={!this.state.isCollapsed ? "hide" : "row col-12"}>
                            {disciplineResultOfUsers}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


/*
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
*/