import { Component, createRef } from "react";

import { clearSpecialSymbols } from "../../services/SpecialSymbolCleaner";
import UserMiddleWare from "../middlewares/UserMiddleWare";
import constant from "../../utils/GlobalValues";


export default class HomeworkModalContent extends Component {

    constructor(props){
        super(props);
        this.state = {
            isShowHandleModal: false,
            homeworkLiteForUserViewModel : props.homeworkLiteForUserViewModel,
            warningUserFile : ""
        }
        this.uploadUserFileRef = createRef();
        this.handleModal = this.handleModal.bind(this);

        this.userFileUpload = this.userFileUpload.bind(this);
        this.userFileUploadChange = this.userFileUploadChange.bind(this);
        this.clearUserFileUploadStatus = this.clearUserFileUploadStatus.bind(this);
    }
    handleModal(value){
        this.setState({
            isShowHandleModal : value
        });
    }

    userFileUpload(){
        if(this.state.isLoading)return;
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = new FormData();
        data.append("courseId", this.props.courseId);
        data.append("disciplineId", this.props.disciplineId);
        data.append("homeworkId", this.props.homeworkLiteForUserViewModel.id);
        data.append("uploadedFile", this.uploadUserFileRef.current.files[0]);
        this.setState({
            isLoading : true,
            warningUserFile : "Идет загрузка..."
        });
        fetch(constant.url + "/api/homework_user/user/add", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt
                },
                body : data
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            this.setState({isLoading : false});
            if(result.status === "success"){
                this.setState({
                    warningUserFile : "Успешно отправлено",
                });
            } else {
                this.setState({
                    warningUserFile : "Неизвестная ошибка",
                });
            }
            setTimeout(() => {this.clearUserFileUploadStatus();}, 3000);
            },
            (error) => {
                this.setState({isLoading : false, warningUserFile : "Неизвестная ошибка"});
                setTimeout(() =>{this.clearUserFileUploadStatus();}, 3000);
            }
        )
    }
    clearUserFileUploadStatus(){
        this.setState({
            warningUserFile : ""
        });
    }
    userFileUploadChange(){
        this.uploadUserFileRef.current.click();
    }

    render(){
        if(this.props.homeworkLiteForUserViewModel === null){
            return (
                <>
                </>
            )
        }

        var homerowkUserStatus = "";
        var isHomeworkDone = false;
        if(this.props.homeworkLiteForUserViewModel.homeworkUserLiteViewModel === null){
            homerowkUserStatus = <div className="alert alert-danger" role="alert">
                Не сдано<br />
            </div>
        } else {
            const homeworkUserLiteViewModel = this.props.homeworkLiteForUserViewModel.homeworkUserLiteViewModel;
            if(homeworkUserLiteViewModel.isAccepted === 1){
                isHomeworkDone = true;
                homerowkUserStatus = <div className="alert alert-success" role="alert">
                    Сдано
                </div>
            } else if(homeworkUserLiteViewModel.isDenied === 1){
                homerowkUserStatus = <div className="alert alert-danger" role="alert">
                    Отклонено
                </div>
            } else if(homeworkUserLiteViewModel.isViewed === 1){
                homerowkUserStatus = <div className="alert alert-warning" role="alert">
                    Рассматривается
                </div>
            } else {
                homerowkUserStatus = <div className="alert alert-warning" role="alert">
                    Не просмотрено
                </div>
            }
        }

        var divFormForUpload = "";
        if(!isHomeworkDone){
            divFormForUpload = <div className="col-12">
                <div className="homework-user-file-form">
                    <div className="form-group">
                        <input type="file" name="uploadedFile" ref={this.uploadUserFileRef} className="form-control hide" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={this.userFileUpload} />

                        <button className="btn" onClick={this.userFileUploadChange}>Загрузить и отправить файл</button>
                        <p className="status">{this.state.warningUserFile}</p>
                    </div>
                </div>
            </div>
        }
        
        return (
            <div className="row">
                <div className="col-12">
                    <p className="text-center" dangerouslySetInnerHTML={{__html:clearSpecialSymbols(this.props.homeworkLiteForUserViewModel.name)}}></p>
                </div>

                <div className="col-12" dangerouslySetInnerHTML={{__html:clearSpecialSymbols(this.props.homeworkLiteForUserViewModel.description)}} />

                <div className="col-12">
                    {homerowkUserStatus}
                </div>

                {divFormForUpload}
                

            </div>
        )
    }
}