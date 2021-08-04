import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import {RegistrationMenuRow} from "../../modules/shared/utils";

export default function RegistrationHome() {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Student Registration</title>
          <link rel="icon" href="../../public/favicon.ico"/>
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Student Registration Home
          </h1>

          <h2>
            <RegistrationMenuRow link = "/registration/new-application" title = "New Student Application"/>
            <RegistrationMenuRow link = "/registration/draft-application" title = "Retrieve Draft Student Application"/>
            <RegistrationMenuRow link = "/registration/pending-applications" title = "View Pending Applications"/>
            <RegistrationMenuRow link = "/registration/all-applications" title = "View All Applications"/>
          </h2>

        </main>

        <footer className={styles.footer}>
        </footer>
      </div>
    </>
  )
}
