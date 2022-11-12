


export default function PanelTemplateError(props) {

    const {tryAgainDelegate} = props;

    return (
        <div className="panel-template error">
            <p>Во время загрузки произошла ошибка</p>
            <button type="button" className="btn" onClick={tryAgainDelegate}>Попробовать еще раз</button>
        </div>
    )
}