import { Component } from "react";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import constant from "../../utils/GlobalValues";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MessageParentPreview from "../../components/Message/MessageParentPreview";
import MessageChat from "../../components/Message/MessageChat";

export default class MessagesTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false, 
            isError : false,
            isShowHandleModalChat : false,

            messageParentPreviewViewModels : [],
            disciplineLiteViewModel : null,
            messageParentViewModel : null,
            messageViewModels : [],
        }
        this.handleModalChat = this.handleModalChat.bind(this);
        this.listAllParentPreviews = this.listAllParentPreviews.bind(this);
        this.loadChat = this.loadChat.bind(this);
    }

    handleModalChat(value){
        this.setState({isShowHandleModalChat : value});
    }

    
    listAllParentPreviews(){
        this.setState({
            isLoading : true, 
            isError : false
        });
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/message/user/list_all_parent_preview", 
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
            if(result.status === "success" && result.panelListOfMessageParentPreviews !== null){
                if(result.panelListOfMessageParentPreviews.messageParentPreviewViewModels !== null){
                    this.setState({
                        messageParentPreviewViewModels : result.panelListOfMessageParentPreviews.messageParentPreviewViewModels
                    });
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

    loadChat(parentMessageId){
        //console.log("loadChat parentMessageId: " + parentMessageId);
        this.setState({
            isLoading : true, 
            isError : false
        });
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            parentMessageId : parseInt(parentMessageId, 10)
        }
        fetch(constant.url + "/api/message/user/get_chat", 
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
                isLoading : false, 
                isError : false
            });
            console.log(result);
            if(result.status === "success" && result.messageChatViewModel !== null){
                this.setState({
                    disciplineLiteViewModel : result.messageChatViewModel.disciplineLiteViewModel,
                    messageParentViewModel : result.messageChatViewModel.messageParentViewModel,
                    messageViewModels : result.messageChatViewModel.messageViewModels
                });
                this.handleModalChat(true);
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
                <PanelTemplateError tryAgainDelegate={this.listAllCourseResultLites} />
            )
        }

        if(this.state.isLoading){
            return(
                <PanelTemplateLoading />
            )
        }
        
        var messageParentPreviews = <p className="text-center">- сообщений не найдено -</p>;
        if(this.state.messageParentPreviewViewModels !== null){
            messageParentPreviews = this.state.messageParentPreviewViewModels.map(messageParentPreviewViewModel => {
                return <MessageParentPreview
                key={messageParentPreviewViewModel.id}
                messageParentPreviewViewModel={messageParentPreviewViewModel}

                handleLoadChatDelegate = {this.loadChat}
                />
            });
        }

        return(
            <>
                <IndexPanelTitle title="Мои сообщения" />

                {messageParentPreviews}



                <Modal show={this.state.isShowHandleModalChat} onHide={() => this.handleModalChat(false)} size="lg" className="modal-message-chat">
                    <Modal.Header closeButton>
                        <Modal.Title>Данные переписки</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <MessageChat
                                disciplineLiteViewModel = {this.state.disciplineLiteViewModel}
                                messageParentViewModel={this.state.messageParentViewModel}
                                messageViewModels={this.state.messageViewModels}
                                handleLoadChatDelegate = {this.loadChat}
                            />
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleModalChat(false)}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

/*

<div className="message-preview" onClick={() => this.handleModalChat(true)}>
    <p className="heading">16.07.2022</p>
    <p className="where">Дисциплина: Наименование</p>
    <p className="content">Сообщение: Содержание сообщения</p>
</div>

*/