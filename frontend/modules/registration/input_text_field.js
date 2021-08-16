import React from "react";

export default function  InputTextField(props) {
    return <div className={"inline-block w-"+props.width+" mr-"+props.marginRight+" pb-4 "}>
        <label className="pl-2 block text-md text-gray-600 pb-4" htmlFor={props.id}>{props.label}</label>
        <input className="w-full h-12 px-2 py-2 outline-none border-2 focus:border-blue-500 hover:border-blue-200 rounded bg-gray-200" id={props.id} name={props.id} value={props.value}
               type="text" required="" placeholder={" "+props.placeholder} disabled={props.isDisabled} onChange={props.onChangeEvent}/>
        <p className={props.visibility + " ml-2 text-sm"}>
            {props.smallMessage}
        </p>
    </div>;
}