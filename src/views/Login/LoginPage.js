import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../store/UserContext";
import {styles} from "./LoginPage.style.js";
//import { UserService } from "../../services/UserService";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";

import constant from "../../utils/GlobalValues";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class LoginPage extends Component {
    
    //static isAuth = IsAuthStatusContext;
    static contextType = UserContext;

    constructor(props){
        super(props);
        this.state = {
            warning : "",
            username : "",
            password : "",

            isShowHandleModalForget : false,
            forgetWarning : "",
            forgetStep : 0,
            forgetUsername : "",
            forgetId : 0,
            forgetCode : ""
        }
        this.changeUserIsAuth = this.changeUserIsAuth.bind(this);
        this.formLoginListener = this.formLoginListener.bind(this);
        this.formForgetStep0Listener = this.formForgetStep0Listener.bind(this);
        this.formForgetStep1Listener = this.formForgetStep1Listener.bind(this);
        this.forgetCansel = this.forgetCansel.bind(this);
        this.forget = this.forget.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
        this.clearForgetWarning = this.clearForgetWarning.bind(this);
        this.login = this.login.bind(this);
        this.handleModalForget = this.handleModalForget.bind(this);
    }

    componentDidMount(){
        const {user} = this.context;
        //var isAuth = useContext(IsAuthStatusContext);
        console.log("context.isAuthed: " + user.isAuthed);
    }

    formLoginListener(e){
        this.clearWarning();
        switch(e.target.name){
            case "username":
                this.setState({username : e.target.value.trim()});
                break;
            case "password":
                this.setState({password : e.target.value.trim()});
                break;
            default:
                break;
        }
    }

    clearWarning(){
        this.setState({warning : ""});
    }
    clearForgetWarning(){
        this.setState({forgetWarning : ""});
    }

    login(){
        if(this.state.username === "" || this.state.password === ""){
            this.setState({warning : "Все поля обязательны для заполнения"});
            return;
        }
        
        const data = {
            username: this.state.username,
            password : this.state.password
        }
        fetch(constant.url + "/api/user/login", 
            {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                    //'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success" && result.accessToken != null){
                const userMiddleWare = new UserMiddleWare();
                userMiddleWare.setJWTToCookie(result.accessToken);
                const { login } = this.context;
                login();
                this.props.navigate("/");
            } else if(result.status === "error" && result.errors === "wrong"){
                this.setState({warning : "Неверный логин или пароль"});
            } else if(result.status === "error" && result.errors === "accessDenied"){
                this.setState({warning : "Извините, запрещен доступ в систему"});
            } else {
                this.setState({warning : "Неизвестная ошибка на сервере"});
            }
            },
            (error) => {
                this.setState({warning : "Ошибка на стороне сервера"});
            }
        )
    }

    changeUserIsAuth(){
        const { login } = this.context
        //setUser({isAuth : true});
        login();
        this.props.navigate("/");
        //useNavigate("/");
    }

    handleModalForget(value){
        this.setState({
            isShowHandleModalForget : value
        });
    }

    formForgetStep0Listener(e){
        this.setState({
            forgetUsername : e.target.value,
            forgetWarning : ""
        });
    }
    formForgetStep1Listener(e){
        this.setState({
            forgetCode : e.target.value,
            forgetWarning : ""
        });
    }
    forgetCansel(){
        this.setState({
            forgetStep : 0,
            forgetCode : "",
            forgetWarning : ""
        });
    }

    forget(){
        this.clearForgetWarning();
        var data;
        if(this.state.forgetStep === 0){
            if(this.state.forgetUsername === ""){
                this.setState({
                    forgetWarning : "Введите пожалуйста свою почту"
                });
                return;
            }
            data = {
                step : 0,
                username : this.state.forgetUsername
            }
        } else if(this.state.forgetStep === 1){
            if(this.state.forgetCode === ""){
                this.setState({
                    forgetWarning : "Введите пожалуйста полученный код"
                });
                return;
            }
            data = {
                step : 1,
                forgetId : this.state.forgetId,
                code : this.state.forgetCode
            }
        }
        
        fetch(constant.url + "/api/user/forget", 
            {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success" && result.userForgetViewModel != null){
                /*
                const userMiddleWare = new UserMiddleWare();
                userMiddleWare.setJWTToCookie(result.accessToken);
                const { login } = this.context;
                login();
                this.props.navigate("/");
                */
                if(this.state.forgetStep === 0){
                     this.setState({
                        forgetUsername : "",
                        forgetId : result.userForgetViewModel.forgetId,
                        forgetStep : 1
                     });   
                } else if(this.state.forgetStep === 1 && result.userForgetViewModel.accessToken){
                    const userMiddleWare = new UserMiddleWare();
                    userMiddleWare.setJWTToCookie(result.userForgetViewModel.accessToken);
                    const { login } = this.context;
                    login();
                    this.props.navigate("/");
                }

            } else if(result.status === "error" && result.errors === "user_not_found"){
                this.setState({forgetWarning : "Электронная почта не найдена"});
            } else if(result.status === "error" && result.errors === "try_2"){
                this.setState({forgetWarning : "Неверный код, осталось 2 попытки"});
            } else if(result.status === "error" && result.errors === "try_1"){
                this.setState({forgetWarning : "Неверный код, осталось 1 попытка"});
            } else if(result.status === "error" && result.errors === "try_limit"){
                this.setState({forgetWarning : "Неверный код, количество попыток исчерпано"});
            } else if(result.status === "error" && result.errors === "code_empty"){
                this.setState({forgetWarning : "Код не установлен"});
            }  else {
                this.setState({forgetWarning : "Неизвестная ошибка на сервере"});
            }
            },
            (error) => {
                this.setState({forgetWarning : "Ошибка на стороне сервера"});
            }
        )
    }

    render(){

        var forgetContent = "";
        if(this.state.forgetStep === 0){
            forgetContent = <form className="col-12 col-lg-8 col-md-8 row">
                <div className="form-group col-12">
                    <label>Введите свою электронную почту</label>
                    <input type="text" name="forgetUsername" className="form-control" style={styles.InputLogin} maxLength={256}
                    onChange={this.formForgetStep0Listener} placeholder="Электронная почта" />
                </div>
                <div className="form-group col-12 text-center">
                    <button type="button" className="btn" onClick={this.forget}>
                        Отправить код
                    </button>
                    <p>{this.state.forgetWarning}</p>
                </div>
            </form>
        } else if(this.state.forgetStep === 1){
            forgetContent = <form className="col-12 col-lg-8 col-md-8 row">
                <div className="form-group col-12">
                    <label>На вашу электронную почту был отправлен 6-тизначный код, введите его пожалуйста</label>
                    <input type="text" name="forgetCode" className="form-control" style={styles.InputLogin} maxLength={6}
                    onChange={this.formForgetStep1Listener} value={this.state.forgetCode} placeholder="6-тизначный код" />
                </div>
                <div className="form-group col-12 text-center">
                    <button type="button" className="btn" onClick={this.forget}>
                        Подтвердить
                    </button>
                </div>
                <div className="form-group col-12 text-center">
                    <button type="button" className="btn" onClick={this.forgetCansel}>
                        Отмена
                    </button>
                    <p>{this.state.forgetWarning}</p>
                </div>
            </form>
        }

        return(
            <div className="container">
                <div className="row">
                    <div className="col-2 d-none d-md-block"></div>
                    <form action="#" className="col-12 col-lg-8 col-md-8 row" style={styles.LoginForm}>
                        <div className="form-group col-12 col-lg-3 col-md-3 col-sm-6">
                            <input type="text" name="username" className="form-control" style={styles.InputLogin} maxLength={256}
                            onChange={this.formLoginListener} placeholder="Логин" />
                        </div>
                        <div className="form-group col-12 col-lg-3 col-md-3 col-sm-6">
                            <input type="password" name="password" className="form-control" style={styles.InputLogin} maxLength={256}
                            onChange={this.formLoginListener} placeholder="Пароль" />
                        </div>
                        <div className="form-group col-12 col-lg-3 col-md-3 col-sm-6">
                            <button type="button" className="btn" style={styles.BtnLogin} onClick={() => this.handleModalForget(true)}>
                                Забыли пароль
                            </button>
                        </div>
                        <div className="form-group col-12 col-lg-3 col-md-3 col-sm-6">
                            <button type="button" className="btn" style={styles.BtnLogin} onClick={this.login}>
                                Войти
                            </button>
                        </div>
                        <div className="col-12">
                            <p className="warning">{this.state.warning}</p>
                        </div>
                    </form>

                </div>
                
                
                <Modal show={this.state.isShowHandleModalForget} onHide={() => this.handleModalForget(false)} size="lg" className="modal-forget">
                    <Modal.Header closeButton>
                        <Modal.Title>Восстановление пароля</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-2 d-none d-md-block"></div>
                                {forgetContent}
                            </div>
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleModalForget(false)}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export function LoginPageWithRouter(props){
    const navigate = useNavigate();
    return(<LoginPage navigate={navigate}></LoginPage>)
}

export default LoginPage;