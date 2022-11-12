

function getUrlMicroserviceForAuditorium(){
    if((window.location.hostname).indexOf("localhost") + 1){
        return "XXXXXXXXXXXXXXXX";
    } else {
        return "XXXXXXXXXXXXXXXX";
    }
}


const constant = {
    "url" : "XXXXXXXXXXXXXXXX",
    "urlOnlineAuditorium" : getUrlMicroserviceForAuditorium()
}

export default constant;