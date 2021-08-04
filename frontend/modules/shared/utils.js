import React from "react";
import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";
import {FileUpload} from "primereact/fileupload";
import Link from "next/link";

export const showToast = (toast, severity, summary, detail) => toast.current.show({
    severity,
    summary,
    detail,
    life: 3000
})

export const submitTemplate = onClick =>
    <React.Fragment>
        <Button label="Submit" icon="pi pi-save" className="p-button-success p-mr-2" onClick={onClick}/>
    </React.Fragment>

export const datePickerTemplate = (onChange, value) =>
    <React.Fragment>
        <Calendar
            monthNavigator
            dateFormat="yy-mm-dd"
            value={value}
            onChange={event => onChange(event.target.value)}
        />
    </React.Fragment>

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const FileUploader = uploadHandler =>
    <FileUpload
        customUpload={true}
        uploadHandler={async event =>
            uploadHandler({
                name: event.files[0].name,
                type: event.files[0].type,
                size: event.files[0].size,
                base64: await toBase64(event.files[0])
            })
        }
        accept='text/*'
        maxFileSize={1000000}
        mode="basic"
        auto
    />

export const RegistrationMenuRow = props =>
    <p style={{textAlign: "center"}}>
        <Button className="p-button-link">
            <Link href={props.link}>
                <a>{props.title}</a>
            </Link>
        </Button>
    </p>;
