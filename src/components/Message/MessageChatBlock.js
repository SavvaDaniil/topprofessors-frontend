


export default function MessageChatBlock(props){

    const messageViewModel = props.messageViewModel;
    if(messageViewModel === null){
        return (
            <></>
        )
    }

    const dateOfAdd = new Date(messageViewModel.dateOfAdd);
    //console.log("dateOfAdd: " + dateOfAdd);
    var dateOfAddString = "";
    if(dateOfAdd !== null && dateOfAdd instanceof Date){
        dateOfAddString = dateOfAdd.getDate()  + "." + (dateOfAdd.getMonth()+1) + "." + dateOfAdd.getFullYear() + " " + dateOfAdd.getHours() + ":" + dateOfAdd.getMinutes();
    }


    return (
        <div className="col-12">
            <div className="message-block">
                <p className="date">{dateOfAddString}</p>
                <p className="content">{messageViewModel.messageContent}</p>
                <p className={"is-readed" + (messageViewModel.isReaded ? "" : " unreaded")}>{messageViewModel.isReaded ? "" : "не прочитано"}</p>
            </div>
        </div>
    )
}