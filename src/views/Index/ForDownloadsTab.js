import { Component } from "react";
import IndexPanelTitle from "../../components/IndexPanelTitle/IndexPanelTitle";

export default class ForDownloadsTab extends Component {

    render(){
        return(
            <>
                <IndexPanelTitle title="Скачать" />
                <p className="text-center">- файлов для скачивания не предусмотрено -</p>
            </>
        )
    }
}