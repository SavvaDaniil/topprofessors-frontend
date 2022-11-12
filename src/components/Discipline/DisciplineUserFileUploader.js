import { Component, createRef } from "react";
import constant from "../../utils/GlobalValues";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";



export default class DisciplineUserFileUploader extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            warningUserFile : "",
        }
        this.uploadUserFileRef = createRef();

        this.userFileUpload = this.userFileUpload.bind(this);
        this.userFileUploadChange = this.userFileUploadChange.bind(this);
        this.clearUserFileUploadStatus = this.clearUserFileUploadStatus.bind(this);
    }

    userFileUpload(){
        if(this.state.isLoading)return;
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = new FormData();
        data.append("courseId", this.props.courseId);
        data.append("disciplineId", this.props.disciplineId);
        data.append("lessonId", this.props.lessonId);
        data.append("uploadedFile", this.uploadUserFileRef.current.files[0]);
        this.setState({
            isLoading : true,
            warningUserFile : "Идет загрузка..."
        });
        fetch(constant.url + "/api/discipline/user/new_file/", 
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
            } else if(result.status === "error" && result.errors === "upload_closed"){
                this.setState({
                    warningUserFile : "Извините: в данный момент загрука файлов отключена",
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
        return (
            <div className="col-12 row">
                <div className="col-8 d-none d-md-block"></div>
                <div className="col-12 col-lg-4 col-md-4 col-sm-12">
                    <div className="discipline-user-file-form">
                        <div className="form-group">
                            <input type="file" name="uploadedFile" ref={this.uploadUserFileRef} className="form-control hide" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp" onChange={this.userFileUpload} />

                            <button className="btn" onClick={this.userFileUploadChange}>Загрузить и отправить файл</button>
                            <p className="status">{this.state.warningUserFile}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}