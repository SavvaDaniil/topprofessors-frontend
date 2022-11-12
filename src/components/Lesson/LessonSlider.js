
import { useState } from "react";
import imgNoSlides from "../../assets/images/no_pesentation.jpg";

import constant from "../../utils/GlobalValues";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function LessonSlider(props){

    const [numberOfFile, changeSlider] = useState(0);
    const [isShowHandleModalChat, handleModalChat] = useState(false);

    if(props.sliders === null || props.sliders.length === 0){
        return (
            <>
                <img src={imgNoSlides} alt="Презентация не предусмотрена" className="img-fluid no-slider" />
            </>
        )
    }

    return(
        <div className="slider">
            <p className="title">{numberOfFile + 1}-ый слайд</p>
            <img src={constant.url + "" + props.sliders[numberOfFile]} alt="Слайд" className="img-fluid" />
            <div className="control">
                <button className={numberOfFile > 0 ? "btn btn-prev" : "btn btn-prev disabled"} onClick={() => changeSlider(numberOfFile - 1)}>Пред</button>
                <button className={numberOfFile < (props.sliders.length - 1) ? "btn btn-next" : "btn btn-next disabled"} onClick={() => changeSlider(numberOfFile + 1)}>След</button>
                <button className="btn btn-fullscreen" onClick={() => handleModalChat(true)}>На весь экран</button>
            </div>
            
            <Modal show={isShowHandleModalChat} onHide={() => handleModalChat(false)} size="lg" className="modal-fullscreen modal-lesson-slider">
                    <Modal.Header closeButton>
                        <Modal.Title>Данные переписки</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-12 img-content">
                                    <img src={constant.url + "" + props.sliders[numberOfFile]} alt="Слайд" className="img-fluid" />
                                </div>
                                <div className="col-6">
                                    <button className={numberOfFile > 0 ? "btn btn-prev" : "btn btn-prev disabled"} onClick={() => changeSlider(numberOfFile - 1)}>Пред</button>
                                </div>
                                <div className="col-6 text-right">
                                    <button className={numberOfFile < (props.sliders.length - 1) ? "btn btn-next" : "btn btn-next disabled"} onClick={() => changeSlider(numberOfFile + 1)}>След</button>
                                </div>
                            </div>
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModalChat(false)}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}