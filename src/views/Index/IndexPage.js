import { Component, createRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../store/UserContext";
import CoursesTab from "./CoursesTab.js";
import DocsTab from "./DocsTab.js";
import { styles } from "./IndexPage.style.js";
import MessagesTab from "./MessagesTab.js";
import ProfileTab from "./ProfileTab.js";
import VebinarsTab from "./VebinarsTab.js";
import ForDownloadsTab from "./ForDownloadsTab.js";
import TestResultsTab from "./TestResultsTab.js";
//import ActivityTab from "./ActivityTab.js";

//import constant from "../../utils/GlobalValues";

class IndexPageClass extends Component {

    static contextType = UserContext;


    constructor(props){
        super(props);
        this.state = {
            activeTabPanel : 0
        }
        //var isAuth = useContext(AuthStatusContext);
        this.btnMenuListener = this.btnMenuListener.bind(this);

        this.profileTabRef = createRef();
        this.docsTabsRef = createRef();
        this.coursesTabsRef = createRef();
        this.testResultsTabRef = createRef();
        this.messagesTabRef = createRef();
    }

    btnMenuListener(index){
        switch(index){
            case 0:
                this.profileTabRef.current.profileGet();
                break;
            case 1:
                this.docsTabsRef.current.userDocsListAll();
                break;
            case 2:
                this.coursesTabsRef.current.listCoursePreviewsForUser();
                break;
            case 4:
                this.messagesTabRef.current.listAllParentPreviews();
                break;
            case 7:
                this.testResultsTabRef.current.listAllCourseResultLites();
                break;
            default:
                break;
        }
        this.setState({activeTabPanel : index});
    }

    componentDidMount(){
        document.title = "Личный кабинет";
        //const { user, setUser } = this.context
        //console.log("ProfilePage user.isAuthed: " + user.isAuthed);
    }

    profileTabUpdate(){
        this.profileTabRef.profileGet();
    }

    render(){


        return(
            <div className="container index">
                <div className="row">
                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-12 col-lg-8 col-md-8">
                        <p style={styles.IndexDesciption}>
                        Приветствуем Вас на электронной площадке инвестиций в Интеллектуальный капитал.<br />
                        Инвестиции в себя и членов Вашей команды - верный путь к успеху!<br />
                        <br />
                        Что нужно сделать:<br />
                        1. Заполнить все поля профиля слушателя и загрузить свою фотографию;<br />
                        2. Загрузить документы, подтверждающие Ваш начальный актив знаний (копия диплома о среднем профессиональном или высшем образовании с приложением к диплому) и, в случае смены фамилии/имени, копию документа, подтверждающего основание изменений ( раздел «Копии документов»);<br />
                        3. Заполнить договор на оказание образовательных услуг, подписать, отсканировать, загрузить в разделе «Копии документов»; <br />
                        4. приступить к обучению.<br />
                        <br />
                        После зачисления у Вас автоматически откроется выбранный курс.<br />
                        <br />
                        Как проходит обучение:<br />
                        1. Видео-лекции и дополнительные материалы, доступны в любое удобное для Вас время;<br />
                        2. Вебинары, их запись и расписание Вы можете найти в разделе «Вебинары»;<br />
                        3. После освоения учебных материалов Вы проходите контроль знаний (задания или тестирование), по итогам которого Вам выдается "ценная бумага" – удостоверение о повышении квалификации установленного образца (в электронном виде направляется на Вашу электронную почту; в бумажном виде направляется на указанный почтовый адрес).<br />
                        <br />
                        Все вопросы по обучению направляйте на почту: <a href="mailto:goldennames@professorstoday.org">goldennames@professorstoday.org</a><br />
                        Методическое сопровождение и техническая поддержка <a href="https://t.me/goldzivsh_support_bot" target="_blank" rel="noreferrer">t.me/goldzivsh_support_bot</a>
                        
                        </p>
                    </div>

                    <div className="col-12">
                        <div className="text-center">
                            <Link to="/auditorium">
                                <button type="button" className="btn">Онлайн аудитория</button>
                            </Link>
                        </div>

                    </div>
                    <div className="col-12"><br /><br /></div>

                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-12 col-lg-8 col-md-8 row menu">
                        <div className="col-12 col-lg-2 col-md-2 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 0 ? " active" : "")} onClick={() => this.btnMenuListener(0)}>Профиль</button>
                        </div>
                        
                        <div className="col-12 col-lg-3 col-md-3 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 1 ? " active" : "")} onClick={() => this.btnMenuListener(1)}>Копии документов</button>
                        </div>
                        
                        <div className="col-12 col-lg-3 col-md-3 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 2 ? " active" : "")} onClick={() => this.btnMenuListener(2)}>Каталог курсов</button>
                        </div>
                        
                        <div className="col-12 col-lg-3 col-md-3 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 3 ? " active" : "")} onClick={() => this.btnMenuListener(3)}>Вебинары</button>
                        </div>

                        <div className="col-12 col-lg-3 col-md-3 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 4 ? " active" : "")} onClick={() => this.btnMenuListener(4)}>Сообщения <span> </span></button>
                        </div>
                        <div className="col-12 col-lg-2 col-md-2 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 5 ? " active" : "")} onClick={() => this.btnMenuListener(5)}>Скачать</button>
                        </div>
                        <div className="col-12 col-lg-3 col-md-3 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 6 ? " active" : "")} onClick={() => this.btnMenuListener(6)}>Активность</button>
                        </div>
                        
                        <div className="col-12 col-lg-4 col-md-4 col-sm-6 outblock">
                            <button type="button" className={"btn" + (this.state.activeTabPanel === 7 ? " active" : "")} onClick={() => this.btnMenuListener(7)}>Результаты тестирования</button>
                        </div>
                    </div>

                    <div className="col-12"></div>

                    <div className="col-2 d-none d-md-block"></div>
                    <div className="col-12 col-lg-8 col-md-8 row">
                        <div className={"col-12 row panel profile " + (this.state.activeTabPanel === 0 ? "active" : "")}>
                            <ProfileTab ref={this.profileTabRef} />
                        </div>
                        <div className={"col-12 row panel docs " + (this.state.activeTabPanel === 1 ? "active" : "")}>
                            <DocsTab ref={this.docsTabsRef} />
                        </div>
                        <div className={"col-12 row panel courses " + (this.state.activeTabPanel === 2 ? "active" : "")}>
                            <CoursesTab ref={this.coursesTabsRef} />
                        </div>
                        <div className={"col-12 row panel vebinars " + (this.state.activeTabPanel === 3 ? "active" : "")}>
                            <VebinarsTab />
                        </div>
                        <div className={"col-12 row panel messages " + (this.state.activeTabPanel === 4 ? "active" : "")}>
                            <MessagesTab ref={this.messagesTabRef} />
                        </div>
                        <div className={"col-12 row panel for-downloads " + (this.state.activeTabPanel === 5 ? "active" : "")}>
                            <ForDownloadsTab />
                        </div>
                        <div className={"col-12 row panel test-results " + (this.state.activeTabPanel === 7 ? "active" : "")}>
                            <TestResultsTab ref={this.testResultsTabRef} />
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


export default function IndexPage(props){
    const navigate = useNavigate();



    return(<IndexPageClass navigate={navigate}></IndexPageClass>)
}

/*
<br /><br />
<b>Приглашаем пройти опрос</b><br />
<a href="https://forms.gle/dE8hfEQWmM9NpqoM9" target="_blank" rel="noreferrer">https://forms.gle/dE8hfEQWmM9NpqoM9</a>

<div className={"col-12 row panel activities " + (this.state.activeTabPanel === 6 ? "active" : "")}>
    <ActivityTab />
</div>

*/