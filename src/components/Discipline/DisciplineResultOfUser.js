
import { Link } from "react-router-dom";
import HomeworkResultOfUserLite from "../Homework/HomeworkResultOfUserLite";
import TestResultOfUserLite from "../Test/TestResultOfUserLite";

export default function DisciplineResultOfUser(props){

    const {handleMoreInfoDelegate} = props;


    var testUserResult = "";
    if(props.isWithoutTest){
        testUserResult = <div className="alert alert-default" role="alert">
            Тест не предусмотрен
        </div>
    }  else if(props.testResultOfUserLiteViewModel === null){
        testUserResult = <div className="alert alert-danger" role="alert">
            Тест не установлен
        </div>
    } else {
        testUserResult = <TestResultOfUserLite
            testId={props.testResultOfUserLiteViewModel.id}
            isDone={props.testResultOfUserLiteViewModel.isDone}
            isFinished={props.testResultOfUserLiteViewModel.isFinished}
            isStarted={props.testResultOfUserLiteViewModel.isStarted}
            neededPoints={props.testResultOfUserLiteViewModel.neededPoints}
            points={props.testResultOfUserLiteViewModel.points}
            handleMoreInfoDelegate={handleMoreInfoDelegate}
        />
    }

    var homeworkResult = "";
    if(props.isWithoutHomework){
        homeworkResult = <div className="alert alert-default" role="alert">
            Задание не предусмотрено
        </div>
    }  else if(props.homeworkUserResultLiteViewModel === null){
        homeworkResult = <div className="alert alert-danger" role="alert">
            Задание не сдавали
        </div>
    } else {
        homeworkResult = <HomeworkResultOfUserLite
        homeworkUserResultLiteViewModel = {props.homeworkUserResultLiteViewModel}
        />
    }


    return (
        
        <div className="row col-12">
            <div className="test-preview row col-12">
                <div className="col-8">
                    <Link to={"/course/" + props.courseId + "/discipline/" + props.id + "/lesson/1"}>
                        <p>
                            {props.name}
                        </p>
                    </Link>
                </div>

                <div className="col-4">
                    {testUserResult}
                    {homeworkResult}
                </div>

            </div>
            <div className="col-12">
                <hr />
            </div>
        </div>
    )
}

/*

                    <div className="alert alert-danger" role="alert" onClick={() => handleMoreInfoDelegate(0)}>
                        Не сдан или не пройден 75%<br />
                        <span>подробнее</span>
                    </div>
*/