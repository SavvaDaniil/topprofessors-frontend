

export class UserService {

    checkAuth(){
        return fetch(constant.url + "/api", {method : "GET"});
    }

    async index(){
        
    }

    login(username, password){
        const data = {
            username: username,
            password : password
        }

        console.log("UserService login");
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
            if(result.answer === "success"){

            } else if(result.answer === "error" && result.error === "wrong"){
                //this.setState({login_warning : "Неверный логин или пароль"});
            } else if(result.answer === "error" && result.error === "accessDenied"){
            //this.setState({login_warning : "Извините, запрещен доступ в систему"});
            } else {
                //this.setState({login_warning : "Не распознан ответ от сервера"});
            }
            },
            (error) => {
                //this.setState({login_warning : "Ошибка на стороне сервера"});
            }
        )
    }

}