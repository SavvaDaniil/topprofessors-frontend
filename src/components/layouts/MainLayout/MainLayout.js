import { Component } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import imgHeader from "../../../assets/images/header.jpg";
import UserContext from "../../../store/UserContext";
import UserMiddleWare from "../../middlewares/UserMiddleWare";
import {styles} from "./MainLayout.style.js";
import { Link } from "react-router-dom";

class MainLayoutClass extends Component {

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.actionLogout = this.actionLogout.bind(this);
        this.state = {
            isCourse : false
        }
        /*
        if(typeof(props.params) !== "undefined"){
            console.log("MainLayoutClass props.params.id: " + props.params.id);
        } else {
            console.log("не сработало");
        }
        */
    }

    actionLogout(){
        const userMiddleWare = new UserMiddleWare();
        userMiddleWare.clearJWTCookie();
        //console.log(userMiddleWare.getJWTFromCookie());
        const { logout } = this.context;
        logout();
        this.props.navigate("/login");
    }



    render(){

        var btnBack = "";
        var url = window.location.toString();
        if((window.location.href.indexOf("/course/") + 1) && (window.location.href.indexOf("/discipline/") + 1) && (window.location.href.indexOf("/test/") + 1)){
            const disciplineId = url.split("/discipline/")[1].split("/test/")[0];
            const courseId = url.split("/course/")[1].split("/discipline/")[0];

            btnBack = <Link to={"/course/" + courseId + "/discipline/" + disciplineId + "/lesson/1"}><button type="button" className="btn btn-back">Закрыть</button></Link>
        } else if((window.location.href.indexOf("/course/") + 1) && (window.location.href.indexOf("/discipline/") + 1)){
            const courseId = url.split("/course/")[1].split("/discipline/")[0];

            btnBack = <Link to={"/course/" + courseId}><button type="button" className="btn btn-back">Назад</button></Link>
        } else if(window.location.href.indexOf("/course/") + 1){
            btnBack = <Link to="/"><button type="button" className="btn btn-back">Назад</button></Link>
        } else if(window.location.href.indexOf("/auditorium") + 1){
            btnBack = <Link to="/"><button type="button" className="btn btn-back">Назад</button></Link>
        }

        return (
            <>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <img className="img-fluid" alt="header" src={imgHeader} />
                        </div>
                        <div className="col-12 col-lg-1 col-md-1">
                            {btnBack}
                        </div>
                        <div className="col-12 col-lg-10 col-md-10">
                            <hr style={styles.HrBig} />
                            <hr style={styles.HrSmall} />
                        </div>
                        <div className="col-12 col-lg-1 col-md-1 div-for-logout">
                            <button type="button" className="btn btn-logout" onClick={this.actionLogout}>
                                Выйти
                            </button>
                        </div>
                    </div>

                </div>

                <Outlet />
            </>
        )
    }
}

export default function MainLayout(props){
    const navigate = useNavigate();
    return(<MainLayoutClass {...props} navigate={navigate} params={useParams()}></MainLayoutClass>)
};