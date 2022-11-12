import "./SystemLoadingPage.style.css";
import imgLogo from "../../assets/images/logo.png";

export function SystemLoadingPage() {
    
    return (
        <div className="row system-loading">
            <div className="col-4 d-none d-md-block"></div>
            <div className="col-12 col-lg-4 col-md-4">
                <img className="img-fluid" alt="logo" src={imgLogo} />
                <p>Подождите пожалуйста, идет загрузка...</p>
            </div>
        </div>
    )
}