


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    return (
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
        ].join(':') + ' ' +
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-')
    );
  }

export default function OnlineAuditoriumChatMessage(props){

    const onlineAuditoriumMessageLiteViewModel = props.onlineAuditoriumMessageLiteViewModel;
    if(onlineAuditoriumMessageLiteViewModel === null)return(
        <>-</>
    )

    var author = "<не найдено>";
    const userLiteViewModel = onlineAuditoriumMessageLiteViewModel.userLiteViewModel;
    if(userLiteViewModel !== null){
        author = userLiteViewModel.secondname + " " + userLiteViewModel.firstname;
    }

    const dateOfAdd = new Date(onlineAuditoriumMessageLiteViewModel.dateOfAdd);
    var dateOfAddString = "";
    if(dateOfAdd !== null && dateOfAdd instanceof Date){
        //dateOfAddString = dateOfAdd.getHours() + ":" + dateOfAdd.getMinutes() + " " + dateOfAdd.getDate()  + "." + (dateOfAdd.getMonth()+1) + "." + dateOfAdd.getFullYear();
        dateOfAddString = formatDate(dateOfAdd);
    }


    return(
        <div className="message">
            <div className={"block" + (onlineAuditoriumMessageLiteViewModel.isOwnerOfRequest ? " from-user" : " from-other")}>
                <p className="author-and-date">{author} {dateOfAddString}</p>
                <p className="message-content">
                    {onlineAuditoriumMessageLiteViewModel.messageContent}
                </p>
            </div>
        </div>
    )
}