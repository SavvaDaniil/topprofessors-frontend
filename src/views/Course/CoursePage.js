import { Component } from "react"
import { useParams } from "react-router-dom";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from "react-router-dom";

import constant from "../../utils/GlobalValues";
import {clearSpecialSymbols} from "../../services/SpecialSymbolCleaner";


class CoursePageClass extends Component {

    constructor(props){
        super(props);
        this.state = {
            id : props.params.id,

            isLoading : false,
            isError : false,
            isFetching : false,

            courseInfoViewModel : null
        }
        //console.log("props.courseId: " + props.params.id);
        this.getCourse = this.getCourse.bind(this);
    }

    getCourse(id){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            id : parseInt(id, 10),
        }
        fetch(constant.url + "/api/course/user/get", 
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
            if(result.status === "success" && result.courseInfoViewModel !== null){
                this.setState({
                    warning : "",
                    courseInfoViewModel : result.courseInfoViewModel
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
        this.getCourse(this.props.params.id);
    }

    render(){

        if(this.state.isError){
            return(
                <div className="row">
                    <PanelTemplateError tryAgainDelegate={() => this.getCourse(this.props.params.id)} />
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

        var coursePoster = "";
        if(this.state.courseInfoViewModel.posterSrc !== null){
            coursePoster = <img alt="poster" src={constant.url + "" + this.state.courseInfoViewModel.posterSrc} className="img-fluid" />
        }

        var disciplineLiteViewModels = "";
        if(this.state.courseInfoViewModel.disciplineLiteViewModels !== null){
            disciplineLiteViewModels = this.state.courseInfoViewModel.disciplineLiteViewModels.map((disciplineLiteViewModel) => {
                return <p key={disciplineLiteViewModel.id}><Link to={"/course/"+this.state.id+"/discipline/" + disciplineLiteViewModel.id + "/lesson/1"}>{disciplineLiteViewModel.name}</Link></p>
            });
        }

        return (
            <div className="container">
                <div className="row page-course">
                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                        <h2 className="name">{this.state.courseInfoViewModel.name}</h2>
                        <div className="text-center">
                            {coursePoster}
                        </div>

                        <div className="description" dangerouslySetInnerHTML={{ __html: clearSpecialSymbols(this.state.courseInfoViewModel.description)}}>
                        </div>


                        <Tabs
                            defaultActiveKey="disciplines"
                            id="uncontrolled-tab-example"
                            className="col-12"
                            >
                            <Tab eventKey="disciplines" title="Дисциплины">
                                <div className="tab-content">
                                    <h3>Дисциплины</h3>
                                    {disciplineLiteViewModels}
                                </div>
                            </Tab>
                            <Tab eventKey="download" title="Скачать">
                                <div className="tab-content">
                                    <h3>Скачать</h3>
                                    <p>- не предусмотрено -</p>
                                </div>
                            </Tab>
                            <Tab eventKey="links" title="Материалы">
                                <div className="tab-content">
                                    <h3>Материалы</h3>
                                    <p>- не предусмотрено -</p>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default function CoursePage(props){
    return (
        <CoursePageClass {...props} params={useParams()} />
    )
}