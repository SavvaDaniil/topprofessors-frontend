
import constant from "../../utils/GlobalValues"

export default function DocPreview(props) {

    return(
        <div className="col-12 col-lg-4 col-md-4 col-sm-6">
            <div className="img-user-doc-preview">
                <img src={constant.url + "" + props.imgSrc} alt="Doc preview" className="img-fluid" />
                <br />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => props.fileDeleteHandler(props.imgDocTypeString, props.index)}>Удалить</button>
            </div>
        </div>
    )
}