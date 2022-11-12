

export default function MessageParentPreview(props){

    const {handleLoadChatDelegate} = props;

    const messageParentPreviewViewModel = props.messageParentPreviewViewModel;
    if(messageParentPreviewViewModel === null){
        return(
            <>
            </>
        )
    }
    const disciplineLiteViewModel = messageParentPreviewViewModel.disciplineLiteViewModel;
    const dateOfAdd = new Date(messageParentPreviewViewModel.dateOfAdd);
    //console.log("dateOfAdd: " + dateOfAdd);
    var dateOfAddString = "";
    if(dateOfAdd !== null && dateOfAdd instanceof Date){
        dateOfAddString = dateOfAdd.getDate()  + "." + (dateOfAdd.getMonth()+1) + "." + dateOfAdd.getFullYear() + " " + dateOfAdd.getHours() + ":" + dateOfAdd.getMinutes();
    }

    return(
        <div className={messageParentPreviewViewModel.isAnyUnread ? "message-preview unread" : "message-preview"} onClick={() => handleLoadChatDelegate(messageParentPreviewViewModel.id)}>
            <p className="heading">{dateOfAddString}</p>
            <p className="where">Дисциплина: {disciplineLiteViewModel !== null ? disciplineLiteViewModel.name : "Не определено"}</p>
            <p className="content">Сообщение: {messageParentPreviewViewModel.textContent}</p>
        </div>  
    )
}