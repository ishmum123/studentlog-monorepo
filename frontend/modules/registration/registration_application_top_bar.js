import {Button} from "primereact/button";
import Link from "next/link";
import {Divider} from "primereact/divider";

export default function RegistrationApplicationTopBar() {
    return <>
        <Divider/>
        <div className="card">
            <p><Button className="p-button-link">
                <Link href="/">
                    <a>Home Page</a>
                </Link>
            </Button></p>

            <p><Button className="p-button-link">
                <Link href="/registration">
                    <a>Registration Home Page</a>
                </Link>
            </Button></p>
        </div>
        <Divider/>
    </>;
}