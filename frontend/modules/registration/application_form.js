import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {Divider} from 'primereact/divider';
import {Button} from "primereact/button";
import 'primeflex/primeflex.css';
import {Calendar} from "primereact/calendar";
import {confirmDialog} from 'primereact/confirmdialog';
import {Toast} from 'primereact/toast';
import {getStudentApplicationAPI} from "../../api";
import axios from "axios";

import InputTextField from "../registration/input_text_field"
import {showToast} from "../shared/utils";

const clean = (obj) => {
    let cleanedObj = {};
    Object.getOwnPropertyNames(obj).forEach(propName => {
        if (obj[propName]) {
            cleanedObj[propName] = obj[propName]
        }
    });
    return cleanedObj;
};

const student_application_api_address = getStudentApplicationAPI()
export default function ApplicationForm(props) {
    const router = useRouter();

    const applicationToast = useRef(null);

    const applicationId = props.applicationId;
    const retrievedData = props.retrievedData

    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [birthRegistrationId, setBirthRegistrationId] = useState("");
    const [registrationId, setRegistrationId] = useState("");
    const [presentAddress, setPresentAddress] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianEmail, setGuardianEmail] = useState("");
    const [guardianPhone, setGuardianPhone] = useState("");
    const [appliedForGrade, setAppliedForGrade] = useState("");
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [onHideAction, setOnHideAction] = useState("");

    const onToastHide = () => {
        if (onHideAction === "registration") {
            router.push("/registration");
        }
        if (onHideAction === "application") {
            router.push("/registration/application/" + applicationId);
        }
    };

    useEffect(() => { // side effect hook
        if (retrievedData) {
            setName(retrievedData.name ? String(retrievedData.name) : "");
            setDateOfBirth(retrievedData.dateOfBirth ? new Date(retrievedData.dateOfBirth) : "");
            setBloodGroup(retrievedData.bloodGroup ? String(retrievedData.bloodGroup) : "");
            setBirthRegistrationId(retrievedData.birthRegistrationId ? String(retrievedData.birthRegistrationId) : "");
            setRegistrationId(retrievedData.registrationId ? String(retrievedData.registrationId) : "");
            setPresentAddress(retrievedData.presentAddress ? String(retrievedData.presentAddress) : "");
            setPermanentAddress(retrievedData.permanentAddress ? String(retrievedData.permanentAddress) : "");
            setGuardianName(retrievedData.guardianName ? String(retrievedData.guardianName) : "");
            setGuardianEmail(retrievedData.guardianEmail ? String(retrievedData.guardianEmail) : "");
            setGuardianPhone(retrievedData.guardianPhone ? String(retrievedData.guardianPhone) : "");
            setAppliedForGrade(retrievedData.appliedForGrade ? String(retrievedData.appliedForGrade) : "");
        }
    }, [retrievedData]);

    const isValidName = name.match(/^(\w| ){5,50}$/);
    const isValidDateOfBirth = !isNaN(new Date(dateOfBirth).getTime());
    const isValidBloodGroup = bloodGroup.match(/^(A|B|AB|O)[+-]$/);
    const isValidBirthRegistrationId = birthRegistrationId.match(/^[\d]{8,20}$/);
    const isValidRegistrationId = registrationId.match(/^[\d]{8,20}$/);
    const isValidPresentAddress = presentAddress.match(/^(\w| ){5,100}$/);
    const isValidPermanentAddress = permanentAddress.match(/^(\w| ){5,100}$/);
    const isValidGuardianName = guardianName.match(/^(\w| ){5,100}$/);
    const isValidGuardianEmail = true;
    const isValidGuardianPhone = guardianPhone.match(/^(\+88)?01[0-9]{9}$/);
    const isValidAppliedForGrade = appliedForGrade.match(/^([\d]|10)$/)

    const isValidData = !!(isValidName && isValidDateOfBirth && isValidBloodGroup && isValidBirthRegistrationId
        && isValidRegistrationId && isValidPresentAddress && isValidPermanentAddress && isValidGuardianName
        && isValidGuardianEmail && isValidGuardianPhone && isValidAppliedForGrade);

    const postStudentApplicationData = (status) => {
        if (!applicationId) {
            setButtonsDisabled(true);
            setOnHideAction("registration");
            showToast(applicationToast, 'error', 'Error Occurred', "Application ID: " + applicationId);
        }
        let application_body = {
            id: applicationId,
            appliedDate: new Date(),
            decidedById: null,
            name: name,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            bloodGroup: bloodGroup,
            birthRegistrationId: birthRegistrationId,
            registrationId: registrationId,
            presentAddress: presentAddress,
            permanentAddress: permanentAddress,
            guardianName: guardianName,
            guardianEmail: guardianEmail,
            guardianPhone: guardianPhone,
            appliedForGrade: appliedForGrade,
            status: status
        };
        const cleaned_application_body = clean(application_body);

        axios.patch(student_application_api_address + "/" + applicationId, cleaned_application_body).then(resp => {
            if (status === "draft") {
                setOnHideAction("");
                showToast(applicationToast, 'success', 'Draft Saved Successfully', "Application ID: " + applicationId);
            } else if (status === "submitted") {
                setButtonsDisabled(true);
                setOnHideAction("application");
                showToast(applicationToast, 'success', 'Application Submitted Successfully', "Application ID: " + applicationId);
            }
        }).catch(error => {
            // console.log(error);
            setButtonsDisabled(true);
            setOnHideAction("registration");
            showToast(applicationToast, 'error', 'Error Occurred', "Failed");
        });

    };

    const confirmApplication = (msg, status) => {
        confirmDialog({
            message: msg,
            header: 'Confirmation',
            icon: 'pi pi-save',
            accept: () => postStudentApplicationData(status)
        });
    };

    const saveStudentApplicationData = (e) => {
        e.preventDefault();
        confirmApplication("Save the form?", "draft")
    };

    const submitStudentApplicationData = (e) => {
        e.preventDefault();
        confirmApplication("Submit the form?", "submitted")
    };

    return (
        <React.Fragment>
            <Toast ref={applicationToast}
                   onHide={onToastHide}
            />

            <form id="applicationForm" action="none">

                <InputTextField id="id" label="Application id:" value={applicationId} isDisabled={true}
                                smallLogic={true} smallMessage="Please keep this ID for retrieval."/>
                <InputTextField id="name" label="Student Name:" value={name}
                                onChangeEvent={event => setName(event.target.value)}
                                isDisabled={false} smallLogic={(name && !isValidName)}
                                smallMessage="Name must be between 5 to 50 characters."/>

                <div className="p-field p-grid">
                    <label htmlFor="date_of_birth" className="p-col-fixed" style={{width: '180px'}}>Date of
                        Birth:</label>
                    <div className="p-col">
                        <Calendar
                            monthNavigator
                            yearNavigator
                            yearRange="1900:2100"
                            dateFormat="yy-mm-dd"
                            id="date_of_birth"
                            value={new Date(dateOfBirth)}
                            onChange={event => setDateOfBirth(event.target.value)}
                        />
                    </div>
                </div>

                <InputTextField id="blood_group" label="Blood Group:" value={bloodGroup}
                                onChangeEvent={event => setBloodGroup(event.target.value)}
                                isDisabled={false} smallLogic={(bloodGroup && !isValidBloodGroup)}
                                smallMessage="Invalid blood group."/>

                <InputTextField id="birth_registration_id" label="Birth Registration ID:" value={birthRegistrationId}
                                onChangeEvent={event => setBirthRegistrationId(event.target.value)}
                                isDisabled={false} smallLogic={(birthRegistrationId && !isValidBirthRegistrationId)}
                                smallMessage="Birth Registration ID must be between 8 to 20 digits."/>

                <InputTextField id="registration_id" label="Registration ID:" value={registrationId}
                                onChangeEvent={event => setRegistrationId(event.target.value)}
                                isDisabled={false} smallLogic={(registrationId && !isValidRegistrationId)}
                                smallMessage="Registration ID must be between 8 to 20 digits."/>

                <InputTextField id="present_address" label="Present Address:" value={presentAddress}
                                onChangeEvent={event => setPresentAddress(event.target.value)}
                                isDisabled={false} smallLogic={(presentAddress && !isValidPresentAddress)}
                                smallMessage="Present Address must be between 5 to 100 characters."/>

                <InputTextField id="permanent_address" label="Permanent Address:" value={permanentAddress}
                                onChangeEvent={event => setPermanentAddress(event.target.value)}
                                isDisabled={false} smallLogic={(permanentAddress && !isValidPermanentAddress)}
                                smallMessage="Permanent Address must be between 5 to 100 characters."/>

                <InputTextField id="guardian_name" label="Guardian Name:" value={guardianName}
                                onChangeEvent={event => setGuardianName(event.target.value)}
                                isDisabled={false} smallLogic={(guardianName && !isValidGuardianName)}
                                smallMessage="Guardian Name must be between 5 to 50 characters."/>

                <InputTextField id="guardian_email" label="Guardian Email:" value={guardianEmail}
                                onChangeEvent={event => setGuardianEmail(event.target.value)}
                                isDisabled={false} smallLogic={(guardianEmail && !isValidGuardianEmail)}
                                smallMessage="Invalid Guardian Email Entered."/>

                <InputTextField id="guardian_phone" label="Guardian Phone:" value={guardianPhone}
                                onChangeEvent={event => setGuardianPhone(event.target.value)}
                                isDisabled={false} smallLogic={(guardianPhone && !isValidGuardianPhone)}
                                smallMessage="Invalid Phone Number Entered."/>

                <InputTextField id="applied_for_grade" label="Applied for Grade:" value={appliedForGrade}
                                onChangeEvent={event => setAppliedForGrade(event.target.value)}
                                isDisabled={false} smallLogic={(appliedForGrade && !isValidAppliedForGrade)}
                                smallMessage="Invalid Grade Entered."/>

                <Divider/>

                <div style={{margin: "auto", marginBottom: "1em"}}>
                    <Button
                        onClick={saveStudentApplicationData}
                        icon="pi pi-save"
                        className="p-button-success p-mr-2"
                        style={{width: '150px'}}
                        label="Save Draft"
                        disabled={buttonsDisabled}
                    />

                    <Button
                        disabled={!isValidData || buttonsDisabled}
                        onClick={submitStudentApplicationData}
                        icon="pi pi-check"
                        className="p-button-primary p-mr-2"
                        style={{width: '150px'}}
                        label="Submit"
                    />
                </div>
            </form>
        </React.Fragment>
    );
}