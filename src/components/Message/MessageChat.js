import { Component } from "react";

import UserMiddleWare from "../middlewares/UserMiddleWare";
import constant from "../../utils/GlobalValues";
import MessageChatBlock from "./MessageChatBlock";

export default class MessageChat extends Component {

    constructor(props){
        super(props)
        this.state = {
            disciplineLiteViewModel : props.disciplineLiteViewModel,
            messageViewModels : props.messageViewModels,
            messageParentViewModel : props.messageParentViewModel,

            warning : "",
            newMessageTextContent: ""
        }
        this.formMessageListener = this.formMessageListener.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
        this.newMessageForChat = this.newMessageForChat.bind(this);
    }

    clearWarning(){
        if(this.state.warning === "")return;
        this.setState({
            warning : ""
        });
    }
    formMessageListener(e){
        this.clearWarning();
        this.setState({
            newMessageTextContent : e.target.value.trim()
        });
    }

    newMessageForChat(){
        if(this.state.newMessageTextContent === "" || this.state.newMessageTextContent === null){
            this.setState({warning : "Введите пожалуйста текст сообщения"});
            return;
        }
        if(this.state.isLoading)return;
        this.setState({
            isLoading : true
        });
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            parentMessageId : parseInt(this.state.messageParentViewModel.id, 10),
            messageContent : this.state.newMessageTextContent
        }
        fetch(constant.url + "/api/message/user/chat/add", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({
                isLoading : false
            });
            console.log(result);
            if(result.status === "success"){
                this.props.handleLoadChatDelegate(this.state.messageParentViewModel.id);
            } else {
                this.setState({warning : "Ошибка отправки сообщения"});
            }
            },
            (error) => {
                this.setState({isLoading : false, warning : "Ошибка отправки сообщения"});
            }
        )
    }

    render(){
        
        if(this.state.messageParentViewModel === null || this.state.messageViewModels === null){
            return(
                <>
                    Данные не получены
                </>
            )
        }

        var messageBlocks = "";
        if(this.state.messageViewModels !== null){
            messageBlocks = this.state.messageViewModels.map(messageViewModel => {
                //console.log("messageViewModel.id: " + messageViewModel.id);
                return <MessageChatBlock
                    key={messageViewModel.id}
                    messageViewModel={messageViewModel}
                />
            });
        }

        var modalFooter = "";
        if(this.state.messageParentViewModel !== null){
            if(this.state.messageParentViewModel.isClosedByUser){
                modalFooter = <div className="col-12 form-group row">
                    <p className="status-closed">Закрыто пользователем</p>
                </div>
            } else if(this.state.messageParentViewModel.isClosedByAdminForce){
                modalFooter = <div className="col-12 form-group row">
                    <p className="status-closed">Закрыто администратором</p>
                </div>
            }else if(this.state.messageParentViewModel.isOutOfLimitUnreadMessagesFromUser){
                modalFooter = <div className="col-12 form-group row">
                    <p className="status-closed">Подождите пожалуйста ответа администратора</p>
                </div>
            } else {
                modalFooter = <div className="col-12 form-group row">
                    <div className="col-12">
                        <textarea className="form-control" onChange={this.formMessageListener} />
                    </div>
                    <div className="col-12">
                        <button type="button" className="btn" onClick={this.newMessageForChat}>Отправить</button>
                        <p className="warning">{this.state.warning}</p>
                    </div>
                </div>
            }
        }

        return(
            <div className="row">

                {messageBlocks}

                <div className="col-12"><hr /></div>

                {modalFooter}

            </div>
        )
    }
}

/*

<div className="col-12">
    <div className="message-block">
        <p className="date">01.01.2022 15:45</p>
        <p className="content">Текст сообщения от пользователя</p>
    </div>
</div>
*/