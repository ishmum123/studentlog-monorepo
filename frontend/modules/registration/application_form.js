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

const visibilityLogic = (booleanValue) => booleanValue ? 'visible' : 'invisible';

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

                <InputTextField width="96" marginRight="24" id="id" label="Application ID" placeholder="Application ID"  value={applicationId}
                                isDisabled={true}
                                visibility={visibilityLogic(true)}
                                smallMessage="Please keep this ID for retrieval."/>

                <InputTextField width="96" marginRight="24" id="guardian_name" label="Guardian Name" placeholder="Guardian Name" value={guardianName}
                                isDisabled={false} onChangeEvent={event => setGuardianName(event.target.value)}
                                visibility={visibilityLogic(guardianName && !isValidGuardianName)}
                                smallMessage="Guardian Name must be between 5 to 50 characters."/>
                                <br/>
                <InputTextField width="96" marginRight="24" id="name" label="Student Name" placeholder="Student Name" value={name}
                                isDisabled={false} onChangeEvent={event => setName(event.target.value)}
                                visibility={visibilityLogic(name && !isValidName)}
                                smallMessage="Name must be between 5 to 50 characters."/>

                <InputTextField width="96" marginRight="24" id="guardian_email" label="Guardian Email"  placeholder="Guardian Email" value={guardianEmail}
                                isDisabled={false} onChangeEvent={event => setGuardianEmail(event.target.value)}
                                visibility={visibilityLogic(guardianEmail && !isValidGuardianEmail)}
                                smallMessage="Invalid Guardian Email Entered."/>
                                <br />

                <div className="inline-block w-96 mr-16 pb-4 ">
                    <label className="pl-2 block text-md text-gray-600 pb-4" htmlFor="date_of_birth">Date of Birth</label>
                    <Calendar monthNavigator yearNavigator yearRange="1900:2100" dateFormat="yy-mm-dd"  id="date_of_birth" className="bg-gray-200 rounded"
                              name="cus_email" value={new Date(dateOfBirth)} onChange={event => setDateOfBirth(event.target.value)}
                    />
                </div><br/>
                <InputTextField  width="96" marginRight="24" id="blood_group" label="Blood Group" placeholder="Blood Group" value={bloodGroup}
                                onChangeEvent={event => setBloodGroup(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(bloodGroup && !isValidBloodGroup)}
                                smallMessage="Invalid blood group."/>
                <InputTextField width="96" marginRight="24" id="guardian_phone" label="Guardian Contact Number" value={guardianPhone}
                                onChangeEvent={event => setGuardianPhone(event.target.value)} placeholder="Guardian Contact Number"
                                isDisabled={false} visibility={visibilityLogic(guardianPhone && !isValidGuardianPhone)}
                                smallMessage="Invalid Phone Number Entered."/>
                                <br/>

                <InputTextField  width="96" marginRight="24" id="birth_registration_id" label="Birth Registration ID" value={birthRegistrationId}
                                onChangeEvent={event => setBirthRegistrationId(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(birthRegistrationId && !isValidBirthRegistrationId)} placeholder="Birth Registration ID"
                                smallMessage="Birth Registration ID must be between 8 to 20 digits."/>
                <InputTextField width="96" marginRight="24" id="applied_for_grade" label="Applied for Grade" value={appliedForGrade} placeholder="Applied for Grade"
                                onChangeEvent={event => setAppliedForGrade(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(appliedForGrade && !isValidAppliedForGrade)}
                                smallMessage="Invalid Grade Entered."/>
                                <br/>
                <InputTextField width="96" marginRight="24" id="registration_id" label="Registration ID" value={registrationId} placeholder="Registration ID"
                                onChangeEvent={event => setRegistrationId(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(registrationId && !isValidRegistrationId)}
                                smallMessage="Registration ID must be between 8 to 20 digits."/>
                                <br/>
                <InputTextField width="96" marginRight="24" id="present_address" label="Present Address" value={presentAddress} placeholder="Present Address"
                                onChangeEvent={event => setPresentAddress(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(presentAddress && !isValidPresentAddress)}
                                smallMessage="Present Address must be between 5 to 100 characters."/>
                                <br/>
                <InputTextField width="96" marginRight="24" id="permanent_address" label="Permanent Address" value={permanentAddress} placeholder="Permanent Address"
                                onChangeEvent={event => setPermanentAddress(event.target.value)}
                                isDisabled={false} visibility={visibilityLogic(permanentAddress && !isValidPermanentAddress)}
                                smallMessage="Permanent Address must be between 5 to 100 characters."/>

                <div className="ml-80 mt-8">
                    <button
                        onClick={saveStudentApplicationData}
                        className="w-24 h-10 mr-12 text-green-700 border border-green-700 rounded bg-white shadow-lg block md:inline-block"
                        disabled={buttonsDisabled}
                    >Save Draft</button>

                    <button
                        disabled={!isValidData || buttonsDisabled}
                        onClick={submitStudentApplicationData}
                        className="w-24 h-10 text-white rounded bg-green-700 shadow-lg block md:inline-block"
                    >Submit</button>
                </div>
            </form>
        </React.Fragment>
    );
}