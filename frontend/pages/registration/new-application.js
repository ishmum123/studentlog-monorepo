import {useEffect, useState} from "react";
import styles from '../../styles/Home.module.css'
import Head from "next/head";
import ApplicationForm from "../../modules/registration/application_form";
import {getStudentApplicationAPI} from "../../api";
import axios from "axios";
import RegistrationApplicationTopBar from "../../modules/registration/registration_application_top_bar";

const student_application_api_address = getStudentApplicationAPI()

export default function NewApplication() {
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    //generating a blank form for getting a unique id for saving as draft
    const application_body = {
      appliedDate: new Date(),
      status: "draft"
    };
    axios.post(student_application_api_address, application_body).then(resp => {
      setApplicationId(resp.data.id);
    }).catch(error => {
      // console.log(error);
    });

  }, []);
  if(!applicationId){
    return <div>Loading...</div>
  }

  return (
    <>
      <div >
        <Head>
          <title>New Student Registration</title>
          <link rel="icon" href="../../public/favicon.ico"/>
        </Head>

        <main>
          <div className="pb-8 pl-24 text-2xl font-bold">Application Form</div>
            <div className="ml-24">
            <ApplicationForm applicationId={applicationId}
                             retrievedData={null}/>
          </div>
        </main>

        <footer className="mt-12">
        </footer>
      </div>
    </>

  );
}
