import styles from '../../styles/Home.module.css'
import Head from "next/head";
import ApplicationsTable from "../../modules/registration/application_table";
import {getStudentApplicationAPI} from "../../api";
import RegistrationApplicationTopBar from "../../modules/registration/registration_application_top_bar";

export async function getServerSideProps() {
    const student_application_api_address = getStudentApplicationAPI();
    const res = await fetch(student_application_api_address);
    const applications = await res.json();

    if (!applications) {
        return {
            notFound: true,
        }
    }

    return {
        props: {applications},
        notFound: false
    }
}

export default function AllApplications({applications, notFound}) {

    return (
        <>
            <div>
                <Head>
                    <title>All Student Applications</title>
                    <link rel="icon" href="../../public/favicon.ico"/>
                </Head>

                <main>
                    <h1 className={styles.title}>
                        All Student Applications
                    </h1>

                    <RegistrationApplicationTopBar/>

                    <ApplicationsTable applications={applications}
                                       notFound={notFound}/>

                </main>

                <footer className={styles.footer}>
                </footer>
            </div>
        </>

    );
}