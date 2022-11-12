import { Component } from "react";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import CoursePreview from "../../components/Course/CoursePreview/CoursePreview";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";

import constant from "../../utils/GlobalValues";

export default class CoursesTab extends Component {

    constructor(props){
        super(props)
        this.state = {
            isAnyDoneCourses : false,

            isLoading : false,
            isError : false,
            isFetching : false,

            isDeniedBecauseAgreement : false,
            isDeniedBecauseProfileNotFilled : false,
            isDeniedBecauseDocsNotUploaded : false,

            coursePreviewForUserViewModels : [],
        }
    }

    listCoursePreviewsForUser(){
        this.setState({
            warning: "",
            isLoading : true, 
            isError : false,
            isDeniedBecauseAgreement : false,
            isDeniedBecauseProfileNotFilled : false,
            isDeniedBecauseDocsNotUploaded : false
        });
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/course/user/list_all", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success"){
                
                this.setState({
                    coursePreviewForUserViewModels : result.coursePreviewForUserViewModels
                });
            } else if(result.status === "error" && result.errors === "agreement_not_accepted"){
                this.setState({
                    isDeniedBecauseAgreement : true
                });
            } else if(result.status === "error" && result.errors === "profile_not_filled"){
                this.setState({
                    isDeniedBecauseProfileNotFilled : true
                });
            } else if(result.status === "error" && result.errors === "docs_not_uploaded"){
                this.setState({
                    isDeniedBecauseDocsNotUploaded : true
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

    render(){

        if(this.state.isError){
            return(
                <PanelTemplateError tryAgainDelegate={this.userDocsGet} />
            )
        }

        if(this.state.isLoading){
            return(
                <PanelTemplateLoading />
            )
        }

        const divExplained = <div className="info">
            <p>Данный раздел будет доступен после зачисления Вас в качестве слушателя. Для зачисления необходимо:<br />
            1.	Заполнить все поля профиля и фото для личного дела;<br />
            2.	Загрузить необходимые документы в разделе «Копии документов»;<br />
            3.	Оформить договор на оказание образовательных услуг<br />
            Если Вы уже выполнили все действия, указанные выше – свяжитесь с администратором системы по почте <a href="mailto:goldennames@professorstoday.org">goldennames@professorstoday.org</a><br />
            Методическое сопровождение и техническая поддержка <a href="https://t.me/goldzivsh_support_bot" target="_blank" rel="noreferrer">t.me/goldzivsh_support_bot</a>
            </p>
        </div>

        if(this.state.isDeniedBecauseAgreement){
            return(
                <>
                    <IndexPanelTitle title="Каталог курсов" />
                    {divExplained}
                    <hr />
                    <p className="courses-error">
                        Внимание: у вас нет согласия с пользовательским соглашением, отметьте пожалуйста ваше согласие с пользовательким соглашением во вкладке ПРОФИЛЬ , для получения доступа к курсам
                    </p>
                </>
            )
        }
        if(this.state.isDeniedBecauseProfileNotFilled){
            return(
                <>
                    <IndexPanelTitle title="Каталог курсов" />
                    {divExplained}
                    <hr />
                    <p className="courses-error">
                        Внимание: у вас не заполнены все поля профиля, укажите пожалуйста все данные во вкладке ПРОФИЛЬ, для получения доступа к курсам.
                    </p>
                </>
            )
        }
        if(this.state.isDeniedBecauseDocsNotUploaded){
            return(
                <>
                    <IndexPanelTitle title="Каталог курсов" />
                    {divExplained}
                    <hr />
                    <p className="courses-error">
                        Внимание: у вас не загружена один из обязательных документов, загрузите пожалуйста документы во вкладке  КОПИИ ДОКУМЕНТОВ, для получения доступа к курсам
                    </p>
                </>
            )
        }

        var coursePreviewForUserViewModels = [];
        if(this.state.coursePreviewForUserViewModels !== null){
            coursePreviewForUserViewModels = this.state.coursePreviewForUserViewModels.map(coursePreviewForUserViewModel => {
                return <CoursePreview 
                key={coursePreviewForUserViewModel.id}
                id={coursePreviewForUserViewModel.id} 
                title={coursePreviewForUserViewModel.name} 
                posterSrc={coursePreviewForUserViewModel.posterSrc}
                status={coursePreviewForUserViewModel.status}
                />
            })
        }

        return (
            <>
                <IndexPanelTitle title="Каталог курсов" />
                {divExplained}
                <div className="col-12 row">
                    {coursePreviewForUserViewModels}
                </div>
            </>
        )
    }
}