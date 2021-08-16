import Link from 'next/link'
import { withTranslation } from "next-i18next";
import { useKeycloak } from "@react-keycloak/ssr";

const Menu = ({t}) => {
  const items = [
    {label: t('students'), url: '/attendance/', role: 'teacher'},
    {label: t('attendance'), url: '/attendance/list', role: 'teacher'},
    {label: t('new_leave_application'), url: '/leave-application/new-application', role: 'student'},
    {label: t('pending_leave_applications'), url: '/leave-application/pending-applications', role: 'teacher'},
    {label: t('student_registration'), url: '/registration', role: 'admin'},
    {label: t('student_registration'), url: '/registration', role: 'teacher'}
  ]

  const keycloak = useKeycloak();

  const menuItems = keycloak.keycloak.tokenParsed ?
    items.filter(item => keycloak.keycloak.tokenParsed.realm_access.roles.includes(item.role)) :
    [];

  return (
      <div
          className="fixed flex flex-col top-14 left-0 md:w-64 bg-regal-blue h-full text-white transition-all duration-300 border-none px-4">
        {menuItems.map(item =>
            <div
                className=' rounded-md text-white hover:bg-white hover:text-gray-900 h-10 align-middle box-content  justify-center pt-2 font-menuFontFamily text-lg font-semibold'>
              <Link href={item.url} key={item.label}>
                <a className="px-2 text-center">{item.label}</a>
              </Link>
            </div>)
        }
      </div>
  );
}

Menu.getInitialProps = async () => (
  {
    namespacesRequired: ['common'],
  }
)

export default withTranslation('common')(Menu);
