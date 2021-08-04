import React, {useRef, useState} from "react";
import styles from '../../styles/Home.module.css'
import Head from "next/head";
import ApplicationForm from "../../modules/registration/application_form";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {InputText} from "primereact/inputtext";
import 'primeflex/primeflex.css';
import {Toast} from "primereact/toast";
import {getStudentApplicationAPI} from "../../api";
import axios from "axios";
import {showToast} from "../../modules/shared/utils";
import RegistrationApplicationTopBar from "../../modules/registration/registration_application_top_bar";

const student_application_api_address = getStudentApplicationAPI()

export default function DraftApplication() {
    const [applicationId, setApplicationId] = useState("");
    const [applicationData, setApplicationData] = useState(null);

    const draftToast = useRef(null);

    const retrieveApplication = (e) => {
        e.preventDefault();
        if (!applicationId) return;

        axios.get(student_application_api_address + "/" + applicationId,).then(resp => {
            if (resp.data.status !== "draft") {
                showToast(draftToast, 'error', 'Not Found', "Application not drafted with ID: " + applicationId);
                return;
            }
            setApplicationData(resp.data);

        }).catch(error => {
            showToast(draftToast, 'error', 'Not Found', "Application not found with ID: " + applicationId);
        });
    };

    return (
        <>
            <div>
                <Head>
                    <title>Student Registration</title>
                    <link rel="icon" href="../../public/favicon.ico"/>
                </Head>

                <main>
                    <Toast ref={draftToast}/>

                    <h1 className={styles.title}>
                        Student Application Form
                    </h1>

                    <RegistrationApplicationTopBar/>

                    <form id="searchForm" action="none">
                        <h3 style={{"margin": "auto", "marginLeft": "8px"}}>Retrieve draft application</h3>
                        <div className="p-col">
                            <span className="p-input-icon-left" style={{margin: "auto", marginRight: "1em"}}>
                              <i className="pi pi-search"/>
                              <InputText
                                  value={applicationId}
                                  id="id"
                                  placeholder="Application ID"
                                  type="text"
                                  style={{width: '300px'}}
                                  disabled={applicationData}
                                  onChange={event => setApplicationId(event.target.value)}/>
                            </span>
                            <Button icon="pi pi-search"
                                    className="p-button-rounded p-button-success p-button-outlined"
                                    disabled={applicationData}
                                    onClick={e => retrieveApplication(e)}
                            />
                        </div>
                    </form>

                    <Divider/>

                    {applicationData && <ApplicationForm applicationId={applicationId}
                                                         retrievedData={applicationData}/>}

                </main>

                <footer className={styles.footer}>
                </footer>
            </div>
        </>

    );
}
