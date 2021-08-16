import Link from "next/link";

export default function RegistrationMenuCard(props) {
    return <>
        <Link href={props.link}>
            <div className="w-full lg:w-1/5 cursor-pointer">
                <div className={"widget h-28 w-full p-4 rounded-lg bg-white border-l-4 bg-gray-100 border-"+props.color+"-400"}>
                    <div className="flex items-center">
                        <div className="flex flex-col justify-center">
                            <div className="text-lg">{props.title}</div>
                            <div className="text-sm text-gray-400">{props.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </>;
}