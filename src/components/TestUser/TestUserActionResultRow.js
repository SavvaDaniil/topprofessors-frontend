

export default function TestUserActionResultRow(props){

    if(props.testUserActionQuetionResultOfUserViewModel === null){
        return (
            <>
            </>
        )
    }

    const testUserActionQuetionResultOfUserViewModel = props.testUserActionQuetionResultOfUserViewModel;

    var tdWithNumberOfAnswers = "";
    for(var a = 0; a < testUserActionQuetionResultOfUserViewModel.testQuestionAnswerIdsFilledByUserSet.length; a++){
        //console.log("check " + testUserActionQuetionResultOfUserViewModel.testQuestionAnswerIdsFilledByUserSet[a]);
        for(var i =0; i < testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels.length; i++){
            //console.log("check testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels[i]['id'] " + testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels[i]["id"]);
            if(parseInt(testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels[i]["id"], 10) === parseInt(testUserActionQuetionResultOfUserViewModel.testQuestionAnswerIdsFilledByUserSet[a], 10)){
                if(tdWithNumberOfAnswers !== "")tdWithNumberOfAnswers = tdWithNumberOfAnswers + ", ";
                tdWithNumberOfAnswers = tdWithNumberOfAnswers + testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels[i]["numberOfAnswer"];
                //console.log("Added " + testUserActionQuetionResultOfUserViewModel.testQuestionAnswerLiteViewModels[i]["numberOfAnswer"]);
                break;
            }
        }
    }
    //console.log("tdWithNumberOfAnswers: " + tdWithNumberOfAnswers);

    return(
        <tr className={testUserActionQuetionResultOfUserViewModel.isCorrect 
        ? "result-bgd success" 
        : testUserActionQuetionResultOfUserViewModel.isPartlyCorrect
        ? "result-bgd warning"
        : "result-bgd danger"}>
            <td>
                {testUserActionQuetionResultOfUserViewModel.numberOfQuestion}
            </td>
            <td>
                {testUserActionQuetionResultOfUserViewModel.textContent}
            </td>
            <td>
                {tdWithNumberOfAnswers}
            </td>
            <td>
                {testUserActionQuetionResultOfUserViewModel.pointsGot}
            </td>

        </tr>
    )
}