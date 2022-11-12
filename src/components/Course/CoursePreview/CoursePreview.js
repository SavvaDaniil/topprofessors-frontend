
import { Link } from "react-router-dom";

export default function CoursePreview(props){


    if(props.status === "DONE"){
        return (
            <div className="course-preview">
                <div >
                    <Link to={"/course/" + props.id}>
                        <h5>{props.title}</h5>
                    </Link>
                </div>
                <br />
                <center>
                    <p className="status success">Курс успешно сдан</p>
                </center>
            </div>
        )
    } else if(props.status === "CLOSED"){
        return (
            <div className="course-preview">
                <div >
                    <h5>{props.title}</h5>
                </div>
                <br />
                <center>
                    <p className="status danger">Доступ закрыт</p>
                </center>
            </div>
        )
    } else {

    }

    return (
        <div className="course-preview">
            <div >
                <Link to={"/course/" + props.id}>
                    <h5>{props.title}</h5>
                </Link>
            </div>
                <br />
                <center>
                    <p className="status success">Доступ открыт</p>
                </center>
        </div>
    )

}