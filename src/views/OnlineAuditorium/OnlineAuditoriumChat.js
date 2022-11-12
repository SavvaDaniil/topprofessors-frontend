import { Component } from "react";
import constant from "../../utils/GlobalValues";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import OnlineAuditoriumChatMessage from "../../components/OnlineAuditoriumChat/OnlineAuditoriumChatMessage";
import { createRef } from "react";


export default class OnlineAuditoriumChat extends Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading : false, 
            isError : false,

            //isAnyNew : false,
            isAnyNewInterval : null,
            lastDateOfChat : 0,
            onlineAuditoriumMessageLiteViewModels : [],

            isSending : false,
            messageText : ""
        }
        this.isAnyNew = this.isAnyNew.bind(this);
        this.newMessageTextListener = this.newMessageTextListener.bind(this);
        this.keyMessageTextListener = this.keyMessageTextListener.bind(this);
        this.send = this.send.bind(this);

        this.messagesRef = createRef();
    }

    isAnyNew(){
        const data = {
            lastDateOfChat : this.state.lastDateOfChat
        }
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/online_auditorium_message/user/is_any_new", 
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
            //console.log(result);
            if(result.status === "success" && result.onlineAuditoriumMessageLitesViewModel !== null){
                
                if(result.onlineAuditoriumMessageLitesViewModel.isAnyNew === true){
                    //console.log("Refresh chat");
                    var newOnlineAuditoriumMessageLiteViewModels = result.onlineAuditoriumMessageLitesViewModel.onlineAuditoriumMessageLiteViewModels;
                    /*
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    newOnlineAuditoriumMessageLiteViewModels.push(newOnlineAuditoriumMessageLiteViewModels[0]);
                    */
                    //console.log("newOnlineAuditoriumMessageLiteViewModels.length: " + newOnlineAuditoriumMessageLiteViewModels.length);
                    this.setState({
                        lastDateOfChat : result.onlineAuditoriumMessageLitesViewModel.lastDateOfChat,
                        onlineAuditoriumMessageLiteViewModels : newOnlineAuditoriumMessageLiteViewModels
                    });


                } else {
                    //console.log("No new messages");
                }
                //if(this.getLiteInterval === null)console.log("this.getLiteInterval is NULL");
            } else {
                this.setState({
                    isError : true
                });
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }

    newMessageTextListener(e){
        this.setState({
            messageText : e.target.value
        });
        if (e.key === 'Enter') {
            console.log('do validate');
        }
    }
    keyMessageTextListener(e){
        if (e.key === 'Enter') {
            this.send();
        }
    }

    send(){
        if(this.state.isSending)return;
        if(this.state.messageText === null || this.state.messageText === "")return;

        this.setState({
            isSending : true
        });

        const data = {
            messageText : this.state.messageText
        }
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/online_auditorium_message/user/add", 
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
            //console.log(result);
            this.setState({
                isSending : false
            });
            if(result.status === "success"){
                //console.log("need clear message");
                this.setState({
                    messageText : ""
                });
                this.isAnyNew();
            } else {
                this.setState({
                    isError : true
                });
            }
            },
            (error) => {
                this.setState({isSending : false, isError : true});
            }
        )
    }

    componentDidMount(){
        if(this.alreadyLaunched)return;
        this.alreadyLaunched = true;
        this.isAnyNew();
        
        var isAnyNewInterval = setInterval(() => {
            this.isAnyNew();
        }, 5000)
        this.setState({
            isAnyNewInterval : isAnyNewInterval
        });
    }
    componentWillUnmount(){
        clearInterval(this.state.isAnyNewInterval);
    }

    componentDidUpdate(){
        
        //console.log("this.messagesRef.current.scrollTop: " + this.messagesRef.current.scrollTop);
        //console.log("this.messagesRef.current.clientHeight: " + this.messagesRef.current.clientHeight);
        //console.log("this.messagesRef.current.scrollHeight: " + this.messagesRef.current.scrollHeight);
        if(this.messagesRef.current.scrollTop === 0 || (this.messagesRef.current.scrollTop + this.messagesRef.current.clientHeight) >= this.messagesRef.current.clientHeight){
            this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
        }
    }

    render(){

        var onlineAuditoriumChatMessages = "";
        //var key = 0;
        if(this.state.onlineAuditoriumMessageLiteViewModels !== null){
            onlineAuditoriumChatMessages = this.state.onlineAuditoriumMessageLiteViewModels.map(onlineAuditoriumMessageLiteViewModel => {
                //console.log(onlineAuditoriumMessageLiteViewModel);
                //key += 1;
                return <OnlineAuditoriumChatMessage
                key={onlineAuditoriumMessageLiteViewModel.id}
                onlineAuditoriumMessageLiteViewModel={onlineAuditoriumMessageLiteViewModel}
                />
            });
        }

        return (
            <div className="chat">
                <div className="messages" ref={this.messagesRef}>

                    {onlineAuditoriumChatMessages}

                </div>

                <div className="control-panel row">
                    <div className="col-12 col-lg-8 col-md-8 col-sm-8">
                        <input type="text" className="form-control" maxLength={5000} 
                        onKeyDown={this.keyMessageTextListener}
                        onChange={this.newMessageTextListener} 
                        value={this.state.messageText} />
                    </div>
                    <div className="col-12 col-lg-4 col-md-4 col-sm-4">
                        <button type="button" className="btn" onClick={this.send}>Отправить</button>
                    </div>
                </div>

            </div>
        )
    }
}

/*
<div className="message">
    <div className="block from-other">
        <p className="author-and-date">Name 12:01 06.06.2018</p>
        <p className="message-content">Text of message</p>
    </div>
</div>

<div className="message">
    <div className="block from-user">
        <p className="author-and-date">Name 12:01 06.06.2018</p>
        <p className="message-content">Text of message</p>
    </div>
</div>

*/