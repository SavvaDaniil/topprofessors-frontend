import { Outlet } from "react-router-dom";
import imgWelcome from "../../../assets/images/welcome.png";
import imgLoginFooter from "../../../assets/images/login-footer.png";
import {styles} from "./LoginLayout.style.js";

const LoginLayout = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-12 col-md-8 col-lg-8">
                        <img className="img-fluid" src={imgWelcome} alt="welcome" />
                        <hr style={styles.HrBig} />
                        <hr style={styles.HrSmall} />
                    </div>
                </div>
            </div>

            <Outlet />

            <img className="img-fluid" alt="login-footer" src={imgLoginFooter} style={styles.ImgLoginFooter} />

            <div className="container">
                <div className="row" style={styles.Footer}>
                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-4 d-none d-md-block"></div>
                    <div className="col-12 col-md-4 col-lg-4" style={styles.FooterDesc}>
                        <h3 style={styles.FooterH3}>Наши контакты</h3>
                        <p style={styles.FooterP}>
                            +74994445204<br />
                            info@professorstoday.org
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginLayout;