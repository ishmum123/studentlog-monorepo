import styles from '../../styles/Home.module.css'
import Head from "next/head";
import Link from "next/link";
import ApplicationsTable from "../../modules/registration/application_table";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {getStudentApplicationAPI} from "../../api";

export async function getServerSideProps() {
  const student_application_api_address = getStudentApplicationAPI()
  const res = await fetch(student_application_api_address)
  const applications = await res.json()

  if (!applications) {
    return {
      notFound: true,
    }
  }

  const pendingApplications = applications.filter(a => a.status === "submitted")

  // Pass applications data to the page via props
  return {
    props: { pendingApplications },
    notFound: false
  }
}

export default function PendingApplications({pendingApplications, notFound}) {

  return (
    <>
      <div >
        <Head>
          <title>Pending Student Applications</title>
          <link rel="icon" href="../../public/favicon.ico"/>
        </Head>

        <main >
          <h1 className={styles.title}>
            Pending Student Applications
          </h1>

          <Divider />

          <div className="card">
            <p><Button className="p-button-link">
              <Link href ="/">
                <a>Home Page</a>
              </Link>
            </Button></p>

            <p><Button className="p-button-link">
              <Link href ="/registration">
                <a>Registration Home Page</a>
              </Link>
            </Button></p>
          </div>

          <Divider />

          <ApplicationsTable applications={pendingApplications}
                             notFound={notFound}/>

        </main>

        <footer className={styles.footer}>
        </footer>
      </div>
    </>

  );
}