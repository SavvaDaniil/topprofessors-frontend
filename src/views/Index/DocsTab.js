import { Component, createRef } from "react";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";
import UserMiddleWare from "../../components/middlewares/UserMiddleWare";
import PanelTemplateLoading from "../../components/PanelTemplate/PanelTemplateLoading";
import PanelTemplateError from "../../components/PanelTemplate/PanelTemplateError";
import DocPreview from "../../components/Doc/DocPreview";

import constant from "../../utils/GlobalValues";

export default class DocsTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            warning : "",

            isLoading : false,
            isError : false,
            isFetching : false,

            diplomUserImgDocs : [],
            supplementUserImgDocs : [],
            statementUserImgDocs : [],
            changeSecondnameUserImgDocs : []
        }

        this.userDocsListAll = this.userDocsListAll.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.fileDelete = this.fileDelete.bind(this);

        this.uploadDiplomRef = createRef();
        this.uploadSupplementRef = createRef();
        this.uploadStatementRef = createRef();
        this.uploadChangesecondnameRef = createRef();
    }

    userDocsListAll(){
        this.setState({isLoading : true, isError : false});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/user/imgdoc/list_all", 
            {
                method : "POST",
                headers : {
                  "Authorization" : "Bearer " + jwt,
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({isLoading : false, isError : false});
            console.log(result);
            if(result.status === "success" && result.userImgDocsViewModel != null){
                
                this.setState({
                    warning : "",
                    diplomUserImgDocs: result.userImgDocsViewModel.diplomUserImgDocs,
                    supplementUserImgDocs: result.userImgDocsViewModel.supplementUserImgDocs,
                    statementUserImgDocs: result.userImgDocsViewModel.statementUserImgDocs,
                    changeSecondnameUserImgDocs: result.userImgDocsViewModel.changeSecondnameUserImgDocs,
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

    fileUpload(imgDocTypeString){
        if(this.state.isFetching)return;
        this.setState({isFetching : true, isLoading: true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        const data = new FormData();
        switch(imgDocTypeString){
            case "diplom":
                data.append("uploadedFile", this.uploadDiplomRef.current.files[0]);
                break;
            case "supplement":
                data.append("uploadedFile", this.uploadSupplementRef.current.files[0]);
                break;
            case "statement":
                data.append("uploadedFile", this.uploadStatementRef.current.files[0]);
                break;
            case "changesecondname":
                data.append("uploadedFile", this.uploadChangesecondnameRef.current.files[0]);
                break;
            default:
                break;
        }
        fetch(constant.url + "/api/user/imgdoc/upload/" + imgDocTypeString, 
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
                    isFetching : false,
                    isLoading : false
                });
                this.userDocsListAll();
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false,
                    isLoading : false
                });
            }
            },
            (error) => {
                this.setState({warning : "Неизвестная ошибка", isFetching : false, isLoading : false});
            }
        )
    }

    fileDelete(imgDocTypeString, numberOfFile){
        if(this.state.isFetching)return;
        this.setState({isFetching : true, isLoading: true});
        const userMiddleWare = new UserMiddleWare();
        const jwt = userMiddleWare.getJWTFromCookie();
        fetch(constant.url + "/api/user/imgdoc/delete/" + imgDocTypeString + "/" + numberOfFile, 
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
                    isFetching : false,
                    isLoading : false
                });
                this.userDocsListAll();
            } else {
                this.setState({
                    warning : "Неизвестная ошибка",
                    isFetching : false,
                    isLoading : false
                });
            }
            },
            (error) => {
                this.setState({warning : "Неизвестная ошибка", isFetching : false, isLoading: false});
            }
        )
    }

    render(){

        if(this.state.isError){
            return(
                <PanelTemplateError tryAgainDelegate={this.userDocsGet} />
            )
        }

        if(this.state.isLoading){
            return(
                <PanelTemplateLoading />
            )
        }

    
        var diplomPreviews = ""
        if(this.state.diplomUserImgDocs !== null){
            diplomPreviews = this.state.diplomUserImgDocs.map((diplomUserImgDoc, index) => {
                return <DocPreview key={index} imgSrc={diplomUserImgDoc.src} index={diplomUserImgDoc.index} imgDocTypeString="diplom" fileDeleteHandler={this.fileDelete} />
            })
            //diplomPreview = <DocPreview imgSrc={this.state.diplomSrc} imgDocTypeString="diplom" fileDeleteHandler={this.fileDelete} />
        }

        var supplementPreviews = ""
        if(this.state.supplementUserImgDocs !== null){
            supplementPreviews = this.state.supplementUserImgDocs.map((supplementUserImgDoc, index) => {
                return <DocPreview key={index} imgSrc={supplementUserImgDoc.src} index={supplementUserImgDoc.index} imgDocTypeString="supplement" fileDeleteHandler={this.fileDelete} />
            })
        }

        var statementPreviews = ""
        if(this.state.statementUserImgDocs !== null){
            statementPreviews = this.state.statementUserImgDocs.map((statementUserImgDoc, index) => {
                return <DocPreview key={index} imgSrc={statementUserImgDoc.src} index={statementUserImgDoc.index} imgDocTypeString="statement" fileDeleteHandler={this.fileDelete} />
            })
        }

        var changeSecondnamePreviews = ""
        if(this.state.changeSecondnameUserImgDocs !== null){
            changeSecondnamePreviews = this.state.changeSecondnameUserImgDocs.map((changeSecondnameUser, index) => {
                return <DocPreview key={index} imgSrc={changeSecondnameUser.src} index={changeSecondnameUser.index} imgDocTypeString="changesecondname" fileDeleteHandler={this.fileDelete} />
            })
        }

        return(
            <div className="col-12 row doc-block">
                <IndexPanelTitle title="Копия диплома об образовании" />

                <div className="col-12">
                    <p>
                        <i>
                        - допустимое максимальное количество загружаемых изображений в каждой категории- 10 шт.;<br />
                        - приемлемые форматы файлов: jpg, jpeg, png, bmp, gif;<br />
                        - размер файла не должен превышать 20 Мб.
                        </i>
                    </p>
                </div>
                <div className="col-3 d-none d-md-block"></div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">

                        <input type="file" name="doc_of_user" ref={this.uploadDiplomRef} className="form-control" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp" onChange={() => this.fileUpload("diplom")} />
                        
                        <p>
                            <i>Загрузка должна начаться автоматически после выбора файла, если она не произошла, нажмите пожалуйста кнопку "загрузить"</i>
                        </p>
                        <button className="btn btn-info" onClick={() => this.fileUpload("diplom")}>Загрузить</button>
                    </div>
                </div>

                {diplomPreviews}



                <IndexPanelTitle title="Копия приложения к диплому об образовании" />

                <div className="col-12">
                    <p>
                        <i>
                        - допустимое максимальное количество загружаемых изображений в каждой категории- 10 шт.;<br />
                        - приемлемые форматы файлов: jpg, jpeg, png, bmp, gif;<br />
                        - размер файла не должен превышать 20 Мб.
                        </i>
                    </p>
                </div>
                <div className="col-3 d-none d-md-block"></div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">

                        <input type="file" name="doc_of_user" ref={this.uploadSupplementRef} className="form-control" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp" onChange={() => this.fileUpload("supplement")} />
                        
                        <p>
                            <i>Загрузка должна начаться автоматически после выбора файла, если она не произошла, нажмите пожалуйста кнопку "загрузить"</i>
                        </p>
                        <button className="btn btn-info" onClick={() => this.fileUpload("supplement")}>Загрузить</button>
                    </div>
                </div>
                {supplementPreviews}

                <IndexPanelTitle title="Копия договора об оказании образовательных услуг" />

                <div className="col-12">
                    <p>
                        <b>(заполнен, подписан, отсканирован, загружен)<br />
                        <a href="/contract_2022.docx" target="download">Скачать форму договора</a><br />
                        </b>
                    </p>
                    <p>
                        <i>
                        - допустимое максимальное количество загружаемых изображений в каждой категории- 10 шт.;<br />
                        - приемлемые форматы файлов: jpg, jpeg, png, bmp, gif;<br />
                        - размер файла не должен превышать 20 Мб.
                        </i>
                    </p>
                </div>
                <div className="col-3 d-none d-md-block"></div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">

                        <input type="file" name="doc_of_user" ref={this.uploadStatementRef} className="form-control" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp" onChange={() => this.fileUpload("statement")} />
                        
                        <p>
                            <i>Загрузка должна начаться автоматически после выбора файла, если она не произошла, нажмите пожалуйста кнопку "загрузить"</i>
                        </p>
                        <button className="btn btn-info" onClick={() => this.fileUpload("statement")}>Загрузить</button>
                    </div>
                </div>
                {statementPreviews}




                <IndexPanelTitle title="Копии документов, подтверждающих смену фамилии*" />

                <div className="col-12">
                    <p>
                        <b>(*) в случае несовпадения фамилии в паспорте и документе об образовании</b>
                    </p>
                    <p>
                        <i>
                        - допустимое максимальное количество загружаемых изображений в каждой категории- 10 шт.;<br />
                        - приемлемые форматы файлов: jpg, jpeg, png, bmp, gif;<br />
                        - размер файла не должен превышать 20 Мб.
                        </i>
                    </p>
                </div>
                <div className="col-3 d-none d-md-block"></div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">

                        <input type="file" name="doc_of_user" ref={this.uploadChangesecondnameRef} className="form-control" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp" onChange={() => this.fileUpload("changesecondname")} />
                        
                        <p>
                            <i>Загрузка должна начаться автоматически после выбора файла, если она не произошла, нажмите пожалуйста кнопку "загрузить"</i>
                        </p>
                        <button className="btn btn-info" onClick={() => this.fileUpload("changesecondname")}>Загрузить</button>
                    </div>
                </div>
                {changeSecondnamePreviews}

            </div>
        )
    }

}