import { Component } from "react";
import constant from "../../utils/GlobalValues";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";
import OnlineAuditoriumChat from "./OnlineAuditoriumChat";
import OnlineAuditoriumUserFileUploader from "./OnlineAuditoriumUserFileUploader";


export default class OnlineAuditoriumPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            isAlreadyLauched : false,
            isLoading : false,
            isError : false,

            youtubeVideoId : null,
            isOpen : false,
            getLiteInterval : null,


        }


        this.getLiteInterval = null;
        this.getLite = this.getLite.bind(this);
    }


    getLite(){
        //console.log("getLite");
        if(!this.state.isAlreadyLauched){
            this.setState({
                isLoading : true, 
                isError : false
            });
        }
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/online_auditorium/user/get_lite", 
            {
                method : "POST",
                //credentials:"include",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            //console.log(result);
            if(!this.state.isAlreadyLauched){
                this.setState({
                    isAlreadyLauched : true,
                    isLoading : false, 
                    isError : false
                });
            }
            if(result.status === "success" && result.onlineAuditoriumLiteViewModel !== null){
                
                if(this.state.youtubeVideoId !== result.onlineAuditoriumLiteViewModel.youtubeVideoId)console.log("youtube not matched");
                if(this.state.isOpen !== result.onlineAuditoriumLiteViewModel.isOpen)console.log("isOpen not matched");
                

                if(this.state.youtubeVideoId !== result.onlineAuditoriumLiteViewModel.youtubeVideoId
                    || this.state.isOpen !== result.onlineAuditoriumLiteViewModel.isOpen){
                    this.setState({
                        youtubeVideoId : result.onlineAuditoriumLiteViewModel.youtubeVideoId,
                        isOpen : result.onlineAuditoriumLiteViewModel.isOpen
                    });
                }
                //if(this.getLiteInterval === null)console.log("this.getLiteInterval is NULL");
            } else {
                if(!this.state.isAlreadyLauched){
                    this.setState({
                        isError : true
                    });
                }
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }

    componentDidMount(){
        if(this.alreadyLaunched)return;
        this.alreadyLaunched = true;
        this.getLite();
        if(this.getLiteInterval === null){
            
            //console.log("Установка getLiteInterval setInterval");
            this.getLiteInterval = setInterval(() => {
                this.getLite();
            }, 5000)
            this.setState({
                getLiteInterval : this.getLiteInterval
            });
            
        }
    }

    componentWillUnmount(){
        //console.log("OnlineAuditoriumPage componentWillUnmount");
        //if(this.getLiteInterval !== null){
            //console.log("clearInterval getLiteInterval");
            clearInterval(this.state.getLiteInterval);
        //}
    }


    render(){

        if(this.state.isError){
            return(
                <div className="row">
                    <PanelTemplateError tryAgainDelegate={() => this.getLite()} />
                </div>
            )
        }

        if(this.state.isLoading || (!this.state.isError && this.state.courseInfoViewModel === null)){
            return(
                <div className="row">
                    <PanelTemplateLoading />
                </div>
            )
        }

        if(!this.state.isOpen){
            return(
                <div className="container">
                    <div className="row page auditorium">

                        <IndexPanelTitle title="Онлайн аудитория" />
                        
                        <div className="col-12">
                            <p className="text-center">
                                Извините, в данный момент онлайн аудитория закрыта
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        var youtubeContent = "";
        if(this.state.youtubeVideoId !== null && this.state.youtubeVideoId !== ""){
            youtubeContent = <iframe src={'https://www.youtube.com/embed/' + this.state.youtubeVideoId}
                frameBorder='0'
                width="100%"
                height="420px"
                allow='encrypted-media'
                allowFullScreen
                title="Онлайн аудитория"
            />
        } else {
            youtubeContent = <p className="text-center">Трансляция не установлена</p>
        }

        return(
            <div className="container">
                <div className="row page auditorium">
                    
                    <IndexPanelTitle title="Онлайн аудитория" />

                    <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                        <div className="videoplayer">
                            {youtubeContent}
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-4 col-sm-12">

                        <OnlineAuditoriumChat />

                    </div>
                    
                    <OnlineAuditoriumUserFileUploader />

                </div>
            </div>
        )
    }

}