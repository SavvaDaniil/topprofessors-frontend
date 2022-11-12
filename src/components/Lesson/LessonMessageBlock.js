import { Component } from "react";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";

import constant from "../../utils/GlobalValues";

export default class LessonMessageBlock extends Component {

    constructor(props){
        super(props);
        this.state = {
            warning : "",
            messageText : "",
            isFetching : false,
            isMessageSuccessfullSended : false
        }
        this.handleMessageText = this.handleMessageText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(){
        console.log("this.props.courseId: " + this.props.courseId);
        if(this.state.isFetching)return;
        if(this.state.messageText === ""){
            this.setState({
                warning : "Введите пожалуйста текст сообщения"
            });
            return;
        }

        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        this.setState({isFetching : true});
        const data = {
            courseId : this.props.courseId,
            disciplineId : this.props.disciplineId,
            lessonId : this.props.lessonId,
            messageText : this.state.messageText
        }

        fetch(constant.url + "/api/message/user/start_chat", 
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
            //this.setState({isLoading : false});
            console.log(result);
            if(result.status === "success"){
                this.setState({
                    isMessageSuccessfullSended : true,
                    isFetching : false
                });
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false
                });
            }
            },
            (error) => {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false
                });
            }
        )
    }

    handleMessageText(e){
        this.setState({
            warning : "", 
            messageText: e.target.value
        })
    }

    render(){

        if(this.state.isMessageSuccessfullSended){
            return(
                <div className="message-block">
                    <p>Сообщение преподавателю</p>
                    <p className="successfull-sended">Ваше сообщение успешно отправлено</p>
                </div>
            )
        }

        if(this.props.countOfUnreadedMessagesFromUser > 2){
            return(
                <div className="message-block">
                    <p>Сообщение преподавателю</p>
                    <p className="error-limit">Вами уже отправлено 3 вопроса, дождитесь пожалуйста ответа преподавателя</p>
                </div>
            )
        }

        return(
            <div className="message-block">
                <p>Сообщение преподавателю</p>
                <textarea className="form-group" rows="6" maxLength="50000" placeholder="Введите текст сообщения"
                onChange={this.handleMessageText}>
                    
                </textarea>
                <button type="button" className="btn btn-sm" onClick={this.sendMessage}>Отправить</button>
                <p className="warning">
                    {this.state.warning}
                </p>
            </div>
        )
    }
}