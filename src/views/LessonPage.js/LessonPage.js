//import { Component } from "react";
//import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
//import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
//import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import LessonSlider from "../../components/Lesson/LessonSlider";
import LessonMessageBlock from "../../components/Lesson/LessonMessageBlock";
import DisciplineUserFileUploader from "../../components/Discipline/DisciplineUserFileUploader";


/*
class LessonPageClass extends Component {

    constructor(props){
        super(props);
        this.state = {
            lessonId : props.lessonId,
            numberOfLesson: props.numberOfLesson,

            courseId : props.courseId,
            disciplineId : props.disciplineId,

            isLoading : false,
            isError : false,
            isFetching : false,

            lessonViewModel : null
        }

        this.getLesson = this.getLesson.bind(this);
    }

    getLesson(lessonId, disciplineId, courseId){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            lessonId : parseInt(lessonId, 10),
            disciplineId : parseInt(disciplineId, 10),
            courseId : parseInt(courseId, 10)
        }
        fetch(constant.url + "/api/lesson/user/get", 
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
            if(result.status === "success" && result.lessonViewModel !== null){
                this.setState({
                    warning : "",
                    lessonViewModel : result.lessonViewModel
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
        this.getLesson(this.props.lessonId, this.props.disciplineId, this.props.courseId);
    }

    render(){

        if(this.state.isError){
            return(
                <div className="row">
                    <PanelTemplateError tryAgainDelegate={() => this.getLesson(this.props.lessonId, this.props.disciplineId, this.props.courseId)} />
                </div>
            )
        }

        if(this.state.isLoading || (!this.state.isError && this.state.lessonViewModel === null)){
            return(
                <div className="row">
                    <PanelTemplateLoading />
                </div>
            )
        }

        return(
            <>
                <div className="col-12">
                    <h3>{this.props.numberOfLesson} занятие: {this.state.lessonViewModel.name}</h3>
                </div>
            </>
        )
    }
}
*/

export default function LessonPage(props){

    var youtubeContent = "";
    if(props.lessonViewModel.videoYoutubeLink !== null){
        youtubeContent = <iframe src={'https://www.youtube.com/embed/' + props.lessonViewModel.videoYoutubeLink}
            frameBorder='0'
            width="100%"
            height="320px"
            allow='encrypted-media'
            allowFullScreen
            title={props.lessonViewModel.name}
        />
    }
    //console.log("numberOfLesson: " + props.numberOfLesson);
    //console.log("props.lessonViewModel.videoYoutubeLink: " + props.lessonViewModel.videoYoutubeLink);

    return (
        <>
            <div className="col-12">
                <h4>{props.numberOfLesson} занятие{props.lessonViewModel.name !== null ? ": " + props.lessonViewModel.name : ""}</h4>
            </div>

            <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                <p className="title">Видео</p>
                {youtubeContent}
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                <LessonSlider sliders={props.lessonViewModel.sliders} />
            </div>
            <div className="col-12 clearfix"></div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                <LessonMessageBlock
                courseId={props.courseId}
                disciplineId={props.disciplineId}
                lessonId={props.lessonViewModel.id}
                countOfUnreadedMessagesFromUser={props.countOfUnreadedMessagesFromUser} 
                 />
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                <div className="faq">
                    <h4>Часто задаваемые вопросы</h4>
                    <p>- список пуст -</p>
                </div>
            </div>

            <DisciplineUserFileUploader
                courseId={props.courseId}
                disciplineId={props.disciplineId}
                lessonId={props.lessonViewModel.id}
            />
            
            <div className="col-12 links">
                <h3 className="title">Материалы</h3>
                <p>- не предусмотрено -</p>
            </div>
        </>
    )
}