import TestUserActionResultRow from "./TestUserActionResultRow";
import TestUserResultRowTestData from "./TestUserResultRowTestData";




export default function TestUserResult(props){

    if(props.testLiteViewModel === null || props.testUserResultOfUserViewModel === null){
        return (
            <p>
                Данных с сервера не получено
            </p>
        )
    }

    const testLiteViewModel = props.testLiteViewModel;
    const testUserResultOfUserViewModel = props.testUserResultOfUserViewModel;
    const testUserLiteViewModel = testUserResultOfUserViewModel.testUserLiteViewModel;
    let testUserActionQuetionResultOfUserViewModels = testUserResultOfUserViewModel.testUserActionQuetionResultOfUserViewModels;
    //testUserActionQuetionResultOfUserViewModels = testUserActionQuetionResultOfUserViewModels.sort((a,b) => a["numberOfQuestion"] > b["numberOfQuestion"]);

    var testUserActionResultRows = "";
    var summOfPoints = 0;
    if(testUserActionQuetionResultOfUserViewModels.length > 0){
        testUserActionQuetionResultOfUserViewModels = testUserActionQuetionResultOfUserViewModels.sort((a,b) => (a.numberOfQuestion > b.numberOfQuestion ? 1 : -1));

        testUserActionResultRows = testUserActionQuetionResultOfUserViewModels.map( testUserActionQuetionResultOfUserViewModel => {
            return <TestUserActionResultRow
            key={testUserActionQuetionResultOfUserViewModel.id}
            testUserActionQuetionResultOfUserViewModel={testUserActionQuetionResultOfUserViewModel}
            />
        });

        for(var i = 0; i < testUserActionQuetionResultOfUserViewModels.length; i++){
            summOfPoints += testUserActionQuetionResultOfUserViewModels[i]["pointsGot"];
        }
    }

    return(
        <div className="row">

            <TestUserResultRowTestData name="Наименование" value={testLiteViewModel.name} />
            <TestUserResultRowTestData name="Требуемый проходной балл" value={testLiteViewModel.neededPoints} />
            <TestUserResultRowTestData name="Статус сдачи" value={testUserLiteViewModel.statusOfDone === 1 ? "Сдано" : "Не сдано"} />
            <TestUserResultRowTestData name="Набранные баллы при прохождении" value={testUserLiteViewModel.points} />

            <div className="col-12">
                Блок с <span className="result-bgd danger">красным цветом</span>: неправильный ответ<br />
                Блок с <span className="result-bgd warning">желтым цветом</span>: частично правильный ответ<br />
                Блок с <span className="result-bgd success">зелёным цветом</span>: правильный ответ<br />
                <i>Обращаем ваше внимание, что если в вопросе с несколькими вариантами правильных ответов один из ваших ответов будет неправильный (например, правильный ответ 1,2,3 , а вы ответили 1,2,4), общая сумма за ответ обнуляется</i>
            </div>

            <table className="table table-bordered mb30">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Вопрос</th>
                        <th>Ответ</th>
                        <th>Баллы за ответ</th>
                    </tr>
                </thead>
                <tbody>
                    {testUserActionResultRows}
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            Итого:
                        </td>
                        <td>
                            {summOfPoints}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}