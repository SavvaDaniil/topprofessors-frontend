import { Component } from "react";
import { useParams } from "react-router-dom";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import TestQuestionView from "../../components/Test/TestQuestion/TestQuestionView";

import constant from "../../utils/GlobalValues";
import {clearSpecialSymbols} from "../../services/SpecialSymbolCleaner";

class TestPageClass extends Component {

    alreadyLaunched = false;

    constructor(props){
        super(props);
        this.state = {
            isMounted : false,
            courseId : parseInt(props.params.courseId, 10),
            disciplineId : parseInt(props.params.disciplineId, 10),
            testId : parseInt(props.params.testId, 10),

            isLoading : false,
            isError : false,
            isFetching : false,

            testIndexViewModel : null,
            testStartViewModel : null,

            stateIndex : true,
            isIndexAlreadyFetched : false,

            stateStart : false,
            testQuestionLiteViewModels : [],
            testQuestionLiteViewModelCurrent : null,
            numberOfQuestionCurrent : 0
        }

        this.getIndex = this.getIndex.bind(this);
        this.getStart = this.getStart.bind(this);
        this.tryAgain = this.tryAgain.bind(this);
        this.sendTestQuestionAnswers = this.sendTestQuestionAnswers.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
    }

    getIndex(testId){
        //if(this.state.isIndexAlreadyFetched)return;
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/test/user/"+testId+"/index", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success" && result.testIndexViewModel !== null){
                this.setState({
                    testIndexViewModel : result.testIndexViewModel
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

    getStart(isContinue){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const urlDynamic = (isContinue ? "continue" : "start");
        fetch(constant.url + "/api/test/user/"+this.state.testId+"/"+urlDynamic, 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success" && result.testStartViewModel !== null){

                var testQuestionLiteViewModels = result.testStartViewModel.testQuestionLiteViewModels;
                testQuestionLiteViewModels = testQuestionLiteViewModels.sort((a, b) => a.numberOfQuestion > b.numberOfQuestion ? 1 : -1);

                //нужна проверка на какие вопросы уже отвечали
                var testQuestionLiteViewModelCurrent = null;
                var numberOfQuestionCurrent = 0;
                for(var i = 0; i < testQuestionLiteViewModels.length; i++){
                    if(testQuestionLiteViewModels[i].testQuestionAnswerIdsFilledByUserSet !== null && i !== (testQuestionLiteViewModels.length - 1)){
                        //console.log("Переход к неотвеченному вопросу");
                        continue;
                    }
                    console.log("Установка вопроса по i: " + i);
                    //console.log(testQuestionLiteViewModels[i]);
                    testQuestionLiteViewModelCurrent = testQuestionLiteViewModels[i];
                    numberOfQuestionCurrent = testQuestionLiteViewModelCurrent.numberOfQuestion;
                    break;
                }
                
                this.setState({
                    stateIndex : false,
                    stateStart : true,
                    testStartViewModel : result.testStartViewModel,
                    testQuestionLiteViewModels : testQuestionLiteViewModels,
                    testQuestionLiteViewModelCurrent : testQuestionLiteViewModelCurrent,
                    numberOfQuestionCurrent : numberOfQuestionCurrent
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

    tryAgain(){
        if(this.state.stateIndex){
            //this.setState({isIndexAlreadyFetched : false});
            this.getIndex(this.state.testId);
        }
    }

    componentDidMount(){
        if(!this.alreadyLaunched){
            //console.log("TestPageClass componentDidMount");
            this.alreadyLaunched = true;
            this.getIndex(this.state.testId);
        }
    }

    sendTestQuestionAnswers(testQuestionId, testQuestionAnswersSet){
        //console.log("TestPage sendTestQuestionAnswers testQuestionId: " + testQuestionId + " | testQuestionAnswersSet: " + testQuestionAnswersSet);
        
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            testId : parseInt(this.props.params.testId, 10),
            testQuestionId : parseInt(testQuestionId, 10),
            testQuestionAnswersSet : Array.from(testQuestionAnswersSet)
        }

        fetch(constant.url + "/api/test_user/user/update", 
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
            if(result.status === "success"){
                //console.log("Переход к следующему действию");
                /*
                var testQuestionLiteViewModels = this.state.testQuestionLiteViewModels;
                for(var i = 0; i < testQuestionLiteViewModels.length; i++){
                    if(testQuestionLiteViewModels[i] !== testQuestionId)continue;
                    testQuestionLiteViewModels[i].testQuestionAnswerIdsFilledByUserSet = testQuestionAnswersSet;
                    break;
                }
                this.setState({
                    testQuestionLiteViewModels : testQuestionLiteViewModels
                });
                this.nextQuestion();
                */
                if(this.state.testQuestionLiteViewModelCurrent.numberOfQuestion < this.state.testQuestionLiteViewModels.length){
                    this.getQuestion(this.state.testQuestionLiteViewModelCurrent.numberOfQuestion + 1);
                } else {
                    console.log("Нужно к итогам теста");
                    this.initResult();
                }
            } else {
                this.setState({isError : true});
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }

    getQuestion(numberOfQuestion){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            testId : parseInt(this.props.params.testId, 10),
            numberOfQuestion : parseInt(numberOfQuestion, 10)
        }

        fetch(constant.url + "/api/test_user/user/question/get", 
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
            if(result.status === "success" && result.testQuestionLiteViewModel !== null){
                this.setState({
                    testQuestionLiteViewModelCurrent : result.testQuestionLiteViewModel
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

    prevQuestion(){
        if(this.state.testQuestionLiteViewModelCurrent.numberOfQuestion === 1)return;
        this.getQuestion(this.state.testQuestionLiteViewModelCurrent.numberOfQuestion - 1);
    }


    initResult(){
        this.setState({isLoading : true, isError : false, stateIndex : true, stateStart: false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            testId : parseInt(this.props.params.testId, 10)
        }

        fetch(constant.url + "/api/test_user/user/finish", 
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
            if(result.status === "success"){
                this.getIndex(parseInt(this.props.params.testId, 10));
            } else {
                this.setState({isError : true});
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }


    render(){

        if(this.state.isError){
            return(
                <div className="row">
                    <PanelTemplateError tryAgainDelegate={() => this.tryAgain()} />
                </div>
            )
        }

        if(this.state.isLoading || (!this.state.isError && this.state.testIndexViewModel === null)){
            return(
                <div className="row">
                    <PanelTemplateLoading />
                </div>
            )
        }

        var testDescriptionContent = "";
        if(this.state.testIndexViewModel.testUserLiteViewModel.isFinished === 2 && this.state.testIndexViewModel.testUserLiteViewModel.statusOfDone === 0){
            testDescriptionContent = <div className="description">
                <p>Уважаемый слушатель, к сожалению, вы не смогли ответить верно на нужное количество вопросов для получения зачета.<br />
                Для получения зачета необходимо набрать минимум {this.state.testIndexViewModel.neededPoints} баллов из {this.state.testIndexViewModel.maxSeenQuestions} вопросов.</p>
	
	            <p>Вы набрали {this.state.testIndexViewModel.testUserLiteViewModel.points} баллов из {this.state.testIndexViewModel.maxSeenQuestions} вопросов.<br /><br />Внимательно просмотрите лекции и пройдите тестирование снова.</p>
            </div>
        } else if(this.state.testIndexViewModel.testUserLiteViewModel.isFinished === 2 && this.state.testIndexViewModel.testUserLiteViewModel.statusOfDone === 1){
            testDescriptionContent = <div className="description text-center">
                <h5 className="winner">Поздравляем, вы успешно завершили данный тест</h5>
                <p>Вы набрали {this.state.testIndexViewModel.testUserLiteViewModel.points} балла из {this.state.testIndexViewModel.maxSeenQuestions} вопросов</p>
            </div>
        } else {
            testDescriptionContent = <div className="description" dangerouslySetInnerHTML={{__html:clearSpecialSymbols(this.state.testIndexViewModel.description)}} />
        }

        var testQuestionContent = "";
        if(this.state.stateStart && this.state.testQuestionLiteViewModelCurrent !== null){
            testQuestionContent = <TestQuestionView 
            testId = {parseInt(this.props.params.testId, 10)}
            testQuestionLiteViewModel={this.state.testQuestionLiteViewModelCurrent} 
            numberOfQuestions={this.state.testQuestionLiteViewModels.length}
            prevQuestionDelegate={this.prevQuestion}
            sendTestQuestionAnswersDelegate = {this.sendTestQuestionAnswers}
            />
        }
        

        return (
            <div className="container">
                <div className="row page-test">
                    <div className="col-12">
                        <h2 className="name">Тест: {this.state.testIndexViewModel.name}</h2>
                    </div>

                    <div className={this.state.stateIndex ? "col-12" : "hide"}>
                        
                        {testDescriptionContent}

                        <div className={this.state.testIndexViewModel.testUserLiteViewModel.statusOfDone !== 1 ? "text-center" : "hide"}>
                            <button type="button" className="btn" onClick={() => this.getStart(false)}>
                                {this.state.testIndexViewModel.isAvailableForContinue ? "Начать сначала" : "Начать тест"}
                            </button>
                            <button type="button" className={this.state.testIndexViewModel.isAvailableForContinue ? "btn right" : "btn hide"} onClick={() => this.getStart(true)}>Продолжить</button>
                        </div>
                    </div>

                    {testQuestionContent}
                </div>
            </div>
        )
    }
}


export default function TestPage(props) {
    return <TestPageClass {...props} params={useParams()} />
}