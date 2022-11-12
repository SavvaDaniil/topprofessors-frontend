import "./SystemErrorPage.style.css";
import imgLogo from "../../assets/images/logo.png";

export function SystemErrorPage(){
    return (
        <div className="row system-error">
            <div className="col-4 d-none d-md-block"></div>
            <div className="col-12 col-lg-4 col-md-4">
                <img className="img-fluid" alt="logo" src={imgLogo} />
                <p>Извините, на стороне сервера произошла ошибка, либо на сервере идут работы</p>
            </div>
        </div>
    )
}