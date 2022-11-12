

export default function HomeworkResultOfUserLite(props){
    if(props.isWithoutHomework){
        return (
            <div className="alert alert-info" role="alert">
                Задание не предусмотрено
            </div>
        )
    } else if(props.homeworkUserResultLiteViewModel !== null) {
        if(props.homeworkUserResultLiteViewModel.isHomeworkAccepted){
            return (
                <div className="alert alert-success" role="alert">
                    Задание сдано
                </div>
            )
        } else if(props.homeworkUserResultLiteViewModel.isHomeworkDenied){
            return (
                <div className="alert alert-danget" role="alert">
                    Задание отклонено
                </div>
            )
        } else {
            return (
                <div className="alert alert-warning" role="alert">
                    Рассматривается
                </div>
            )
        }
    } else {
        return (
            <>
                - ошибка -
            </>
        )
    }
}