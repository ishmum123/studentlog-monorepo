import Head from 'next/head'
import RegistrationMenuCard from "../../modules/registration/registration_menu_card";

export default function RegistrationHome() {
  return (
    <>
      <Head>
        <title>Student Registration</title>
        <link rel="icon" href="../../public/favicon.ico"/>
      </Head>

        <div className="pb-8 pl-36 text-2xl font-bold">Student Registration</div>
        <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4 justify-center">

          <RegistrationMenuCard link = "/registration/new-application" title = "New Student Application" description="Create New Application"
                                color="purple"/>
          <RegistrationMenuCard link = "/registration/draft-application" title = "Retrieve Draft Student Application" description="Edit Draft Applications"
                                color="blue"/>
          <RegistrationMenuCard link = "/registration/pending-applications" title = "Pending Applications" description="View Pending Applications"
                                color="yellow"/>
          <RegistrationMenuCard link = "/registration/all-applications" title = "View All Applications" description="View All Applications"
                                color="red"/>
        </div>

    </>
  )
}
