import React, {useRef, useState} from "react";
import styles from '../../../styles/Home.module.css'
import Head from "next/head";
import {useRouter} from "next/router";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";
import {confirmDialog} from "primereact/confirmdialog";
import {getStudentApplicationAPI} from "../../../api";
import axios from "axios";
import {showToast} from "../../../modules/shared/utils";
import RegistrationApplicationTopBar from "../../../modules/registration/registration_application_top_bar";

const getDecidedById = () => {
    return 1;
}

export async function getServerSideProps({params}) {
    const student_application_api_address = getStudentApplicationAPI()

    const res = await fetch(student_application_api_address + "/" + params.application_id)
    const application = await res.json()

    if (!application) {
        return {
            notFound: true,
        }
    }

    // Pass application data to the page via props
    return {
        props: {application},
        notFound: false
    }
}

const student_application_api_address = getStudentApplicationAPI()

export default function StudentApplication({application}) {
    const router = useRouter();
    const decisionToast = useRef(null);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    if (!application) {
        return <div>Error...</div>;
    }

    const submitDecision = (decision) => {
        setButtonsDisabled(true);

        const changedApplication = {...application, decidedById: getDecidedById(), status: decision}
        axios.patch(student_application_api_address + "/" + application.id, changedApplication).then(resp => {
            showToast(decisionToast, 'success', "Application " + decision, 'Application ' + application.id + ' ' + decision + ' Successfully');
        }).catch(error => {
            showToast(decisionToast, 'error', "Error Occurred", "Failed");
        });
    };

    const confirmDecision = (msg, decision) => {
        confirmDialog({
            message: msg,
            header: 'Confirmation',
            icon: 'pi pi-save',
            accept: () => submitDecision(decision)
        });
    }

    const onDecisionClick = (e, decision) => {
        e.preventDefault();
        let msg = "";
        if (decision === "approved") {
            msg = "Approve application: " + application.id + "?";
        } else if (decision === "rejected") {
            msg = "Reject application: " + application.id + "?";
        }
        confirmDecision(msg, decision);
    };

    const convertObject = (obj) => {
        let arr = [];

        arr.push({field: "Applied Date", value: String(application.appliedDate).split('T')[0]});
        arr.push({field: "Decided by ID", value: application.decidedById});
        arr.push({field: "Name", value: application.name});
        arr.push({field: "Date of Birth", value: String(application.dateOfBirth).split('T')[0]});
        arr.push({field: "Blood Group", value: application.bloodGroup});
        arr.push({field: "Birth Registration ID", value: application.birthRegistrationId});
        arr.push({field: "Registration ID", value: application.registrationId});
        arr.push({field: "Present Address", value: application.presentAddress});
        arr.push({field: "Permanent Address", value: application.permanentAddress});
        arr.push({field: "Guardian Name", value: application.guardianName});
        arr.push({field: "Guardian Email", value: application.guardianEmail});
        arr.push({field: "Guardian Phone", value: application.guardianPhone});
        arr.push({field: "Applied for Grade", value: application.appliedForGrade});
        arr.push({field: "Status", value: application.status});

        return arr;
    };

    const tableFormattedData = convertObject(application)

    return (
        <>
            <div>
                <Head>
                    <title>Student Applications Details</title>
                    <link rel="icon" href="../../../public/favicon.ico"/>
                </Head>

                <main>
                    <Toast ref={decisionToast}
                           onHide={() => router.reload()}
                    />
                    <h1 className={styles.title}>
                        Student Applications Details
                    </h1>

                    <RegistrationApplicationTopBar/>

                    <div className="card">
                        <DataTable
                            value={tableFormattedData}>
                            <Column field="field" header="Registration ID"/>
                            <Column field="value" header="Name"/>
                        </DataTable>
                    </div>

                    <Divider/>

                    <div style={{margin: "auto", marginBottom: "1em"}}>

                        <form id="decisionForm">
                            <Button
                                disabled={application.status !== "submitted" || buttonsDisabled}
                                onClick={(e) => onDecisionClick(e, "approved")}
                                icon="pi pi-check"
                                className="p-button-success p-mr-2"
                                style={{width: '220px'}}
                                label="Approve Application"/>

                            <Button
                                disabled={application.status !== "submitted" || buttonsDisabled}
                                type="button"
                                onClick={(e) => onDecisionClick(e, "rejected")}
                                icon="pi pi-times"
                                className="p-button-danger p-mr-2"
                                style={{width: '220px'}}
                                label="Reject Application"/>
                        </form>

                    </div>

                </main>

                <footer className={styles.footer}>
                </footer>
            </div>
        </>
    );
}
