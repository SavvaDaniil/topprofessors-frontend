import { Component } from "react";
import { Link } from "react-router-dom";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";

export default class VebinarsTab extends Component {

    hideHref(){
        this.props.navigate("/auditorium");
    }

    render(){
        return(
            <>
                <IndexPanelTitle title="Вебинары" />

                <div className="text-center">
                    <Link to="/auditorium">
                        <button type="button" className="btn">Онлайн аудитория</button>
                    </Link>
                    <br />
                    <br />
                </div>
                <p>19.10.2022 11:00 - Вводная информация о курсе <i>(Е.В. Ляпунцова, Ю.М. Белозерова, Е.А. Лисиченко)</i> <a href="https://www.youtube.com/watch?v=L0zcZXEggTw" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=L0zcZXEggTw</a></p>
                <p>19.10.2022 13:00 - Психология и информационная гигиена в педагогической практике высшей школы (часть 1) <i>(М.А. Филатова-Сафронова)</i> <a href="https://www.youtube.com/watch?v=Z1Gg9EiGB8U" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=Z1Gg9EiGB8U</a></p>
                <p>21.10.2022 11:00 - Организация и профессиональная этика работы преподавателя высшей школы в меняющейся информационной среде (Часть 1)<i>(С.В. Бадмаева)</i> <a href="https://www.youtube.com/watch?v=gd8Zcr5c4IQ" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=gd8Zcr5c4IQ</a></p>
                <p>21.10.2022 13:00 - Эффективная работа с инструментами социальной сети «ВКонтакте» (Часть 1)<i>(Е.А. Лисиченко)</i> <a href="https://www.youtube.com/watch?v=P58PITW_Vs8" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=P58PITW_Vs8</a></p>
                <p>22.10.2022 11:00 - Практические моменты обеспечения информационной безопасности преподавателя и студентов в современных условиях<i>(Х.В. Белогорцева (Пешкова))</i> <a href="https://www.youtube.com/watch?v=N5qZLVdQQS4" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=N5qZLVdQQS4</a></p>
                <p>22.10.2022 13:00 - Эффективная работа с инструментами социальной сети «ВКонтакте» (Часть 2)<i>(Е.А. Лисиченко)</i> <a href="https://www.youtube.com/watch?v=kUt39RnbFU0" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=kUt39RnbFU0</a></p>
                <p>24.10.2022 11:00 - Технология работы преподавателя в «Телеграмм»<i>(Е.А. Лисиченко)</i> <a href="https://www.youtube.com/watch?v=RVoGx2j-W_g" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=RVoGx2j-W_g</a></p>
                <p>24.10.2022 13:00 - Психология и информационная гигиена в педагогической практике высшей школы (часть 2)<i>(М.А. Филатова-Сафронова)</i> <a href="https://www.youtube.com/watch?v=SYr17nWKNCg" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=SYr17nWKNCg</a></p>
                
                <p>27.10.2022 11:00 - Организация и профессиональная этика работы преподавателя высшей школы в меняющейся информационной среде (Часть 1)<i>(С.В. Бадмаева)</i> <a href="https://www.youtube.com/watch?v=FPGhidDefjo" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=FPGhidDefjo</a></p>

                <p>27.10.2022 13:00 - Технология работы преподавателя с видеосервисом «RUTUBE»<i>(Е.А. Лисиченко)</i> <a href="https://www.youtube.com/watch?v=qW1EL-ZLp10" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=qW1EL-ZLp10</a></p>

                <p>05.11.2022 11:00 - Правовые аспекты применения информационных технологий в высшем образовании<i>(Х.В. Белогорцева (Пешкова))</i></p>
            </>
        )
    }

}