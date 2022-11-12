import { Component, createRef } from "react";
import imgPhotoDefault from "../../assets/images/user.png";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import constant from "../../utils/GlobalValues";

export default class ProfileTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            warning : "",
            warningClass : "",

            password : "",
            username: "",
            secondname: "Фамилия",
            firstname : "",
            patronymic : "",
            datebirthday: null,
            region_id : 0,
            nationality : "",
            address : "",
            addressindex : "",
            snils : "",
            telephone : "",
            education : 0,
            specialization : "",
            placework : "",
            office : "",
            agreement : 0,

            regions : [],

            isLoading : false,
            isError : false,
            isFetching : false,

            isModalAgreementShow : false,
            photoFile : null,
            photoSrc : null,
        }

        this.profileFormListener = this.profileFormListener.bind(this);
        this.profileGet = this.profileGet.bind(this);
        this.profileSave = this.profileSave.bind(this);

        this.agreementCheckboxListener = this.agreementCheckboxListener.bind(this);
        this.checkBoxAgreementRef = createRef();
        this.agreementUpdate = this.agreementUpdate.bind(this);

        this.inputPhotoRef = createRef();
        this.inputPhotoClick = this.inputPhotoClick.bind(this);
        this.photoUpdate = this.photoUpdate.bind(this);
        this.photoDelete = this.photoDelete.bind(this);
        
    }

    componentDidMount(){
        this.profileGet();
    }

    photoUpdate(){
        if(this.state.isFetching)return;
        this.setState({isFetching : true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = new FormData();
        data.append("uploadedFile", this.inputPhotoRef.current.files[0]);
        fetch(constant.url + "/api/user/imgdoc/upload/photo", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  //'Content-Type': 'application/json'
                },
                body : data
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success"){
                this.setState({
                    warning : "Успешно сохранено",
                    isFetching : false
                });
                this.profileGet();
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false
                });
            }
            },
            (error) => {
                this.setState({warning : "Неизвестная ошибка", isFetching : false});
            }
        )
    }
    photoDelete(){
        if(this.state.isFetching)return;
        this.setState({isFetching : true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/user/imgdoc/delete/photo/0", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  //'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success"){
                this.setState({
                    warning : "Успешно сохранено",
                    isFetching : false
                });
                this.profileGet();
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false
                });
            }
            },
            (error) => {
                this.setState({warning : "Неизвестная ошибка", isFetching : false});
            }
        )
    }

    inputPhotoClick(){
        this.inputPhotoRef.current.click();
    }

    agreementUpdate(value){
        if(this.state.isFetching)return;
        this.setState({isFetching : true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            newValue : value,
        }
        fetch(constant.url + "/api/user/agreement/update", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success"){
                this.setState({
                    isModalAgreementShow : false,
                    isFetching : false
                });
                this.profileGet();
            } else {
                alert("Неизвестная ошибка на сервере");
                this.setState({
                    isFetching : false
                });
            }
            },
            (error) => {
                this.setState({isModalAgreementShow : false, isFetching : false});
            }
        )
    }

    agreementCheckboxListener(){
        if(this.state.agreement !== 2){
            this.checkBoxAgreementRef.current.checked = false;
        } else {
            this.checkBoxAgreementRef.current.checked = true;
        }
        this.setState({isModalAgreementShow : true});
    }


    profileSave(){
        if(this.state.isFetching)return;
        this.setState({isFetching : true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = {
            password : this.state.password,
            secondname: this.state.secondname,
            firstname : this.state.firstname,
            patronymic : this.state.patronymic,
            datebirthday: this.state.datebirthday,
            region_id : this.state.region_id,
            nationality : this.state.nationality,
            address : this.state.address,
            addressindex : this.state.addressindex,
            snils : this.state.snils,
            telephone : this.state.telephone,
            education : this.state.education,
            specialization : this.state.specialization,
            placework : this.state.placework,
            office : this.state.office,
        }
        fetch(constant.url + "/api/user/profile/save", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            //this.setState({isLoading : false});
            console.log(result);
            if(result.status === "success"){
                this.setState({
                    warning : "Успешно сохранено",
                    warningClass : "success",
                    password : "",
                    isFetching : false
                });
                if(result.accessToken != null){
                    const userMiddleWare = new UserMiddleWare();
                    userMiddleWare.setJWTToCookie(result.accessToken);
                }
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false
                });
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true, isFetching : false});
            }
        )
    }

    profileGet(){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/user/profile/get", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                  'Access-Control-Allow-Origin': '*',
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success" && result.userProfileViewModel != null){
                /*
                var regions = [];
                if(result.userProfileViewModel.regionLiteViewModels != null){
                    regions.push({value : 0, label : "Не выбрано"});
                    result.userProfileViewModel.regionLiteViewModels.forEach((region) => {
                        regions.push({value: region.id, label : region.name});
                    });
                }
                */

                this.setState({
                    warning : "",
                    warningClass : "",
                    username: result.userProfileViewModel.username,
                    secondname: result.userProfileViewModel.secondname,
                    firstname : result.userProfileViewModel.firstname,
                    patronymic : result.userProfileViewModel.patronymic,
                    datebirthday: result.userProfileViewModel.datebirthday,
                    region_id : (result.userProfileViewModel.regionLiteViewModel != null ? result.userProfileViewModel.regionLiteViewModel.id : 0),
                    nationality : result.userProfileViewModel.nationality,
                    address : result.userProfileViewModel.address,
                    addressindex : result.userProfileViewModel.addressindex,
                    snils : result.userProfileViewModel.snils,
                    telephone : result.userProfileViewModel.telephone,
                    education : result.userProfileViewModel.education,
                    specialization : result.userProfileViewModel.specialization,
                    placework : result.userProfileViewModel.placework,
                    office : result.userProfileViewModel.office,

                    regions : result.userProfileViewModel.regionLiteViewModels,
                    agreement : result.userProfileViewModel.agreement,
                    agreementCheckboxChecked : (result.userProfileViewModel.agreement === 2),

                    photoSrc : result.userProfileViewModel.photoSrc,
                });
            } else {
                this.setState({isError : true});
            }
            },
            (error) => {
                this.setState({isLoading : false, isError : true});
            }
        )
    }

    clearWarning(){

    }

    profileFormListener(e){
        this.setState({warning : "", profileWarningClass : ""});
        switch(e.target.name){
            case "password":
                this.setState({password : e.target.value.trim()});
                break;
            case "secondname":
                this.setState({secondname : e.target.value.trim()});
                break;
            case "firstname":
                this.setState({firstname : e.target.value.trim()});
                break;
            case "patronymic":
                this.setState({patronymic : e.target.value.trim()});
                break;
            case "datebirthday":
                this.setState({datebirthday : e.target.value});
                break;
            case "region_id":
                this.setState({region_id : e.target.value});
                break;
            case "nationality":
                this.setState({nationality : e.target.value.trim()});
                break;
            case "address":
                this.setState({address : e.target.value.trim()});
                break;
            case "addressindex":
                this.setState({addressindex : e.target.value.trim()});
                break;
            case "snils":
                this.setState({snils : e.target.value.trim()});
                break;
            case "telephone":
                this.setState({telephone : e.target.value.trim()});
                break;
            case "education":
                this.setState({education : e.target.value});
                break;
            case "specialization":
                this.setState({specialization : e.target.value.trim()});
                break;
            case "placework":
                this.setState({placework : e.target.value.trim()});
                break;
            case "office":
                this.setState({office : e.target.value.trim()});
                break;
            default:
                break;
        }
    }


    handleAgreementModal(value){
        this.setState({isModalAgreementShow : value});
    }


    render(){

        if(this.state.isError){
            return(
                <PanelTemplateError tryAgainDelegate={this.profileGet} />
            )
        }

        if(this.state.isLoading){
            return(
                <PanelTemplateLoading />
            )
        }

        const listOfRegionOptions = this.state.regions.map((region) => {
            return <option key={region.id} value={region.id}>{region.name}</option>
        });

        var modalAgreementContent = <>
            <p>Даю согласие 
            на обработку Межрегиональной общественной организацией «Лига Преподавателей Высшей Школы» (далее – Организация) моих персональных данных, а именно фамилия, имя, отчество, число, месяц, год и место рождения, паспортные данные, информация об образовании, информация о трудовой деятельности, место работы, должность с указанием выполняемой работы, ученая степень (научное или иное звание) при наличии, контактные телефоны, адрес электронной почты, адрес места проживания, фотография, в целях осуществления деятельности Организации, при условии, что их обработка осуществляется соответствии с законодательством Российской Федерации.
            </p>
            <p>Предоставляю Организации право осуществлять все действия (операции) с моими персональными данными, включая сбор, систематизацию, накопление, хранение, обновление, изменение, использование, обезличивание, блокирование, уничтожение. Организация вправе обрабатывать мои персональные данные посредством внесения их 
            в электронную базу данных, включения в Единый реестр членов Организации, списки 
            и другие отчетные формы.</p>
            <p>
            Передача моих персональных данных иным лицам или иное их разглашение может осуществляться только с моего письменного согласия.
            </p>
        </>
        if(this.state.agreement === 2){
            modalAgreementContent = <>
                <p>Это приведёт к:<br />
                <br />
                - обнулению доступов к курсам, дисциплинам, тестам и другим учебным материалам,<br />
                - уничтожение ваших личных данных на сервере (кроме логина и пароля для авторизации), вплоть до загруженных файлов, фотографий и документов,<br />
                - мы оставляем за собой право сохранить ваши ответы на тестирования, чтобы улучшить качество системы дистанционного обучения<br />
                </p>
            </>
        }

        return(
            <>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                    <img src={this.state.photoSrc != null ? constant.url + "" + this.state.photoSrc : imgPhotoDefault} className="img-fluid" alt="userPhotoDefault" />
                </div>
                
                <div className="col-12 col-lg-6 col-md-6 col-sm-12 row">
                    <div className="col-12 col-lg-5 col-md-5 col-sm-12"></div>
                    <div className="col-12 col-lg-7 col-md-7 col-sm-12">
                        <h3>Мой профиль</h3>
                        <input type="file" className="hide" ref={this.inputPhotoRef} onChange={this.photoUpdate}
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp" />
                        <button className="btn btn-profile" onClick={this.inputPhotoClick}>Сменить фотографию</button>
                        <button className={this.state.photoSrc != null ? "btn btn-profile" : "hide"} data-toggle="modal" data-target="#modal_window_for_delete_photo_of_user" onClick={this.photoDelete}>Удалить фотографию</button>
                        
                    </div>
                    
                    <div className="col-12 col-lg-5 col-md-5 col-sm-12">
                        <p className="info">для изменения электронной почты/логина обратитесь к администратору системы</p>
                    </div>
                    
                    <div className="col-12 col-lg-7 col-md-7 col-sm-12">
                        
                        <div className="form-group info">
                            <input type="checkbox" ref={this.checkBoxAgreementRef} defaultChecked={this.state.agreement === 2} onChange={this.agreementCheckboxListener} /> Я принимаю <a href="/agreement.docx" download>пользовательское соглашение</a>
                        </div>
                        
                        <Modal show={this.state.isModalAgreementShow} onHide={() => this.handleAgreementModal(false)} size="lg" className="modal-agreement">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {this.state.agreement !== 2 ? "Пользовательское соглашение" : "Вы уверены, что хотите отказаться от пользовательского соглашения?"}
                                </Modal.Title>
                            </Modal.Header>
                                <Modal.Body>
                                    {modalAgreementContent}
                                </Modal.Body>
                            <Modal.Footer>
                                <Button variant="success" onClick={() => this.agreementUpdate(this.state.agreement !== 2)}>
                                    {this.state.agreement === 2 ? "Отказаться" : "Принять"}
                                </Button>
                                <Button variant="danger" onClick={() => this.handleAgreementModal(false)}>
                                    Закрыть
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <button className="btn btn-profile" onClick={this.profileSave}>Сохранить изменения</button>
                        <p className={"profile-warning " + this.state.warningClass}>{this.state.warning}</p>
                    </div>
                    
                </div>


                <div className="col-12">

                    <form className="form-horizontal">
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="password">Изменить пароль:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="password" className="form-control" name="password" onChange={this.profileFormListener} value={this.state.password} />
                            </div>
                        </div>
                        
                        <hr />
                    
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="username">Электронная почта:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="email" className="form-control" name="username" defaultValue={this.state.username} onChange={this.profileFormListener} disabled />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="secondname">Фамилия:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="secondname" defaultValue={this.state.secondname} onChange={this.profileFormListener} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="firstname">Имя:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="firstname" defaultValue={this.state.firstname} onChange={this.profileFormListener} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="patronymic">Отчество:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="patronymic" defaultValue={this.state.patronymic} onChange={this.profileFormListener} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Дата рождения:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="date" className="form-control" name="datebirthday" defaultValue={this.state.datebirthday} onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        
                        
                        
                        
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12" htmlFor="region_id">Регион:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <select name="region_id" className="form-control" value={this.state.region_id} spellCheck="false" onChange={this.profileFormListener}>
                                    <option defaultValue="0">-- Не указан --</option>
                                    {listOfRegionOptions}
                                </select>
                            </div>
                        </div>
                        
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Гражданство:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="nationality" defaultValue={this.state.nationality} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Адрес проживания:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="address" defaultValue={this.state.address} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Индекс:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="number" className="form-control" name="addressindex" defaultValue={this.state.addressindex} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">СНИЛС:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="snils" defaultValue={this.state.snils} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Ваш телефон:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="telephone" defaultValue={this.state.telephone} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Образование:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <select name="education" className="form-control" value={this.state.education} required spellCheck="false" placeholder="Образование" onChange={this.profileFormListener}>
                                    <option value={0}>Не выбрано</option>
                                    <option value={1}>высшее</option>
                                    <option value={2}>неполное высшее</option>
                                    <option value={3}>среднее профессиональное</option>
                                    <option value={4}>среднее полное общее</option>
                                </select>
                            </div>
                        </div>
                        
                        
                    
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Направление, специальность, квалификация:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="specialization" defaultValue={this.state.specialization} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Место работы:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="placework" defaultValue={this.state.placework} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">Занимаемая должность:</label>
                            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                                <input type="text" className="form-control" name="office" defaultValue={this.state.office} required="required" onChange={this.profileFormListener} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <button type="button" className="btn btn-profile" onClick={this.profileSave}>Сохранить изменения</button>
                            <p className={"profile-warning " + this.state.warningClass}>{this.state.warning}</p>
                        </div>
                        
                    </form>
                </div>
            </>
        )
    }

}