import { Component } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import LessonPage from "../LessonPage.js/LessonPage";

import constant from "../../utils/GlobalValues";
import {clearSpecialSymbols} from "../../services/SpecialSymbolCleaner";
import HomeworkModalContent from "../../components/Discipline/HomeworkModalContent";

class DisciplinePageClass extends Component {

    constructor(props){
        super(props);
        this.state = {
            courseId : parseInt(props.params.courseId, 10),
            disciplineId : parseInt(props.params.disciplineId, 10),
            numberOfLesson : parseInt(props.params.numberOfLesson, 10),

            isLoading : false,
            isError : false,
            isFetching : false,

            disciplineInfoViewModel : null,
            isShowHandleHomeworkModal: false,
        }
        //console.log("props.courseId: " + props.params.id);
        this.getDisciplineInfo = this.getDisciplineInfo.bind(this);
        this.changeNumberOfLesson = this.changeNumberOfLesson.bind(this);
        this.handleModalHomework = this.handleModalHomework.bind(this);
    }

    handleModalHomework(value){
        this.setState({
            isShowHandleHomeworkModal : value
        });
    }

    getDisciplineInfo(courseId, disciplineId, numberOfLesson){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            courseId : parseInt(courseId, 10),
            disciplineId : parseInt(disciplineId, 10),
            numberOfLesson : parseInt(numberOfLesson, 10)
        }
        fetch(constant.url + "/api/discipline/user/get", 
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
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success" && result.disciplineInfoViewModel !== null){
                this.setState({
                    warning : "",
                    disciplineInfoViewModel : result.disciplineInfoViewModel
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

    componentDidMount(){
        this.getDisciplineInfo(this.state.courseId, this.state.disciplineId, this.state.numberOfLesson);
    }

    changeNumberOfLesson(numberOfLesson){
        this.setState({
            numberOfLesson : numberOfLesson
        });
        this.getDisciplineInfo(this.state.courseId, this.state.disciplineId, numberOfLesson);
    }

    render(){

        if(this.state.isError){
            return(
                <div className="row">
                    <PanelTemplateError tryAgainDelegate={() => this.getDisciplineInfo(this.props.params.courseId, this.props.params.disciplineId, this.props.params.numberOfLesson)} />
                </div>
            )
        }

        if(this.state.isLoading || (!this.state.isError && this.state.disciplineInfoViewModel === null)){
            return(
                <div className="row">
                    <PanelTemplateLoading />
                </div>
            )
        }

        var listLinkToLessons = ""
        if(this.state.disciplineInfoViewModel.lessonLiteViewModels !== null){
            listLinkToLessons = this.state.disciplineInfoViewModel.lessonLiteViewModels.map(lessonLiteViewModel => {
                return <li key={lessonLiteViewModel.id} 
                className={this.state.numberOfLesson === lessonLiteViewModel.numberOfLesson ? "active" : ""}>
                    <Link to={"/course/"+this.state.courseId+"/discipline/" + this.state.disciplineId + "/lesson/" + lessonLiteViewModel.numberOfLesson} onClick={() => this.changeNumberOfLesson(lessonLiteViewModel.numberOfLesson)}>Занятие {lessonLiteViewModel.numberOfLesson}</Link>
                </li>
            });
        }

        var lessonContent = "";
        if(this.state.disciplineInfoViewModel.lessonViewModel !== null){
            lessonContent = <LessonPage
            //lessonId={this.state.disciplineInfoViewModel.lessonLiteViewModels[this.state.numberOfLesson - 1].id}
            courseId={this.state.courseId}
            disciplineId={this.state.disciplineId}
            numberOfLesson={this.state.numberOfLesson}
            lessonViewModel = {this.state.disciplineInfoViewModel.lessonViewModel}
            countOfUnreadedMessagesFromUser = {this.state.disciplineInfoViewModel.countOfUnreadedMessagesFromUser}
            />
        }

        var contentHomework = "";
        var homeworkModalContent = "";
        if(this.state.disciplineInfoViewModel.isWithoutHomework === 1){
            contentHomework = <button className="btn" type="button" disabled>Домашнее задание не предусмотрено</button>
        } else if(this.state.disciplineInfoViewModel.homeworkLiteForUserViewModel !== null){
            contentHomework = <button className="btn" type="button" onClick={() => this.handleModalHomework(true)}>
                {this.state.disciplineInfoViewModel.homeworkLiteForUserViewModel.homeworkUserLiteViewModel !== null ? this.state.disciplineInfoViewModel.homeworkLiteForUserViewModel.homeworkUserLiteViewModel.isAccepted === 1 ? "Домашнее задание успешно сдано" : "Домашнее задание" : "Домашнее задание"}
            </button>

            homeworkModalContent = <HomeworkModalContent 
                courseId={this.state.courseId}
                disciplineId={this.state.disciplineId}
                homeworkLiteForUserViewModel = {this.state.disciplineInfoViewModel.homeworkLiteForUserViewModel}
            />
        }

        var contentToTest = "";
        if(this.state.disciplineInfoViewModel.isWithoutTest === 1){
            contentToTest = <p>Тест не предусмотрен</p>
        } else if(this.state.disciplineInfoViewModel.testLiteViewModel !== null){
            contentToTest = <Link to={"/course/" + this.state.courseId + "/discipline/" + this.state.disciplineId + "/test/" + this.state.disciplineInfoViewModel.testLiteViewModel.id}>
                <button className="btn" type="button">
                    {this.state.disciplineInfoViewModel.testUserLiteViewModel !== null ? this.state.disciplineInfoViewModel.testUserLiteViewModel.statusOfDone === 1 ? "Тест успешно сдан" : "Пройти тестирование" : "Пройти тестирование"}
                </button>
            </Link>
        } else {
            contentToTest = <button className="btn" type="button">Тест не установлен</button>
        }

        return(
            <div className="container">
                <div className="row page-discipline">
                    <div className="col-12">
                        <h2 className="name">Дисциплина: {this.state.disciplineInfoViewModel.name}</h2>

                        <div style={{whiteSpace: "pre-wrap"}} className="description" dangerouslySetInnerHTML={{__html:clearSpecialSymbols(this.state.disciplineInfoViewModel.description)}}></div>
                    </div>

                    <div className="col-12 div-to-test">
                        {contentHomework}
                        {contentToTest}
                    </div>

                    <div className="col-12">

                        <ul className="nav nav-tabs nav-lessons">
                            {listLinkToLessons}
                        </ul>
                    </div>


                    <div className="col-12 row content-lesson">
                        {lessonContent}
                    </div>

                </div>
                
                
                <Modal show={this.state.isShowHandleHomeworkModal} onHide={() => this.handleModalHomework(false)} size="lg" className="modal-fullscreen">
                    <Modal.Header closeButton>
                        <Modal.Title>Практическое задание</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            {homeworkModalContent}
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleModalHomework(false)}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}


export default function DisciplinePage(props){
    return <DisciplinePageClass {...props} params={useParams()} />
}