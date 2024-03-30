import varify from "@/Assets/varify.png";
import {LockClosedIcon} from '@heroicons/react/20/solid'
import {SmilePlusIcon, UsersIcon} from "lucide-react";
import {MagnifyingGlassCircleIcon} from "@heroicons/react/16/solid";

export default function VarifyProductContent() {
    return (
        <div id={'varify'}
             className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none"/>
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"/>
                </svg>
            </div>
            <div
                className="mx-auto grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                <div
                    className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="lg:max-w-lg">
                            <div className="flex items-center">
                                <div
                                    className="flex justify-center items-center w-12 h-12 rounded-full bg-primary-100 lg:h-14 lg:w-14">
                                    <img src={varify} alt="Verification icon"/>
                                </div>
                                <p className="text-4xl font-semibold leading-7  ml-2 lg:ml-4">
                                    Varify
                                </p>
                            </div>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Streamline your on-site to office communications and improve job management.
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-700">
                                Varify optimizes project management by streamlining the process of on-site to office
                                communications. It provides a centralized platform for all job data, ensuring seamless
                                job management and enhanced project visibility.

                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                            <ul role="list" className=" space-y-8 text-gray-600">
                                <li className="flex gap-x-3">
                                    <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600"
                                                    aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Seamless Revenue Protection: </strong>
                                        {'  '}
                                        Meticulous change management safeguards project revenue effortlessly. By precisely tracking variations, it minimizes revenue loss, ensuring a streamlined and profitable project management process.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <MagnifyingGlassCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600"
                                                               aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Perfect visibility across the entire job</strong>
                                        {'  '}
                                        Track every detail of your job from start to finish. Varify provides a centralized platform for all job data, ensuring seamless job management and enhanced project visibility. Add images, notes, and documents to your jobs, and keep your team in the loop.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <UsersIcon className="mt-1 h-5 w-5 flex-none text-indigo-600"
                                               aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Effortless Crew Onboarding:</strong>
                                        {'  '}
                                        Straightforward and user-friendly onboarding process for your crew. Simplified procedures ensure quick adaptation and usage, facilitating seamless integration into your project management system.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <SmilePlusIcon className="mt-1 h-5 w-5 flex-none text-indigo-600"
                                                   aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Enhanced Customer Relations:</strong>
                                        {'  '}
                                        Enhanced visibility into project progress, fostering better customer relations. By offering transparent insights and clear project status, it enhances trust and communication, ensuring clients are well-informed and satisfied with project developments.
                                    </span>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}