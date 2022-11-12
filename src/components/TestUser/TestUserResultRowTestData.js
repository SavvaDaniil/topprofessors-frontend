


export default function TestUserResultRowTestData(props){

    return(
        <div className="form-group row test-data">
            <label className="control-label col-12 col-lg-4 col-md-4 col-sm-12">{props.name}:</label>
            <div className="col-12 col-lg-8 col-md-8 col-sm-12">
                <input type="text" className="form-control" value={props.value} disabled />
            </div>
        </div>
    )
}