import Link from 'next/link'
import {SelectButton} from 'primereact/selectbutton';
import {config, withTranslation} from "../../next-i18next.config";
import styles from './dashboard.module.css';
import Menu from "./menu";
import {useKeycloak} from "@react-keycloak/ssr";

const Dashboard = ({children, t, i18n}) => {
    const keycloak = useKeycloak();

    return (
        <>
            <div className="relative min-h-screen flex flex-col flex-auto flex-shrink-0 bg-regal-blue text-gray-800">
                <Menu/>
                <div
                    className="absolute left-64 top-5 box-border h-64 w-customWidth h-customHeight  border-2 z-0 rounded-md border-green-400 bg-white border-opacity-100 overflow-auto">
                    <div className="flex flex-row-reverse mr-8  md:flex  inline-block absolute right-0 mt-2">
                        <button
                            tooltip={t("logout")}
                            id="logout"
                            tooltipOptions={{position: 'bottom'}}
                            onClick={() => window.location.href = keycloak.keycloak.createLogoutUrl()}
                            className="hover:bg-gray-300 bg-gray-200 rounded py-2 px-4 block w-24 ">Log Out
                        </button>
                        <button className="rounded hover:bg-gray-300 bg-gray-200  py-2 px-4 block w-24"><Link
                            href="/profile">{t("profile")}</Link></button>
                    </div>
                    <div className={styles.children}>{children}</div>
                </div>
                <SelectButton
                    value={i18n.language}
                    options={config.allLanguages}
                    onChange={({value}) => i18n.changeLanguage(value)}
                    itemTemplate={locale => locale.toUpperCase()}
                    className={styles.bottomright}
                />
            </div>
        </>
    );
}

Dashboard.getInitialProps = async () => (
    {
        namespacesRequired: ['common'],
    }
)

export default withTranslation('common')(Dashboard);
