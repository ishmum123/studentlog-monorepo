import {InputText} from "primereact/inputtext";
import React from "react";

export default function  InputTextField(props) {
    return <div className="p-field p-grid">
        <label htmlFor={props.id} className="p-col-fixed" style={{width:'180px'}}>{props.label}</label>
        <div className="p-col">
            <InputText
                value={props.value}
                id={props.id}
                type="text"
                style={{width:'300px'}}
                disabled={props.isDisabled}
                onChange={props.onChangeEvent}
            />
            {props.smallLogic && <small id="id-help" className="p-d-block">
                {props.smallMessage}
            </small>}
        </div>

    </div>
}