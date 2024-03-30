import estiq from "@/Assets/EstiQ.png";
import {BookCheck, Database, FileSpreadsheet} from "lucide-react";

export default function EstiQProductContent() {
    return (
        <div id={'EstiQ'}
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
                        <div
                            className={'flex text-sm mb-2 justify-center items-center bg-orange-200 text-orange-500 py-1 px-2 rounded-full w-[118px]'}>
                            Coming soon
                        </div>
                        <div className="lg:max-w-lg">
                            <div className="flex items-center">
                                <div
                                    className="flex justify-center items-center w-12 h-12 rounded-full bg-primary-100 lg:h-14 lg:w-14">
                                    <img src={estiq} alt="Verification icon"/>
                                </div>
                                <p className="text-4xl font-semibold leading-7  ml-2 lg:ml-4">
                                    EstiQ
                                </p>
                            </div>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                A better way to estimate
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-700">
                                A full featured estimation suite for everything from small maintenance jobs to large
                                feasibility studies. EstiQ is a powerful tool that allows you to create and manage
                                estimates with confidence and speed.
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
                                    <BookCheck className="mt-1 h-5 w-5 flex-none text-orange-500"
                                               aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Built in estimating norms and rate suggestions: </strong>
                                        {'  '}
                                        EstiQ comes with a comprehensive database of estimating norms and rate suggestions, allowing you to quickly and accurately estimate your projects.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <Database className="mt-1 h-5 w-5 flex-none text-orange-500"
                                              aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Build your own custom price and rates database:</strong>
                                        {'  '}
                                        EstiQ allows you to create your own custom price and rates database, so you can estimate your projects with your own rates and prices.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <FileSpreadsheet className="mt-1 h-5 w-5 flex-none text-orange-500"
                                                     aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">No more spreadsheets</strong>
                                        {'  '}
                                        Using spreadsheets to estimate your projects can be time consuming and error prone. EstiQ allows you to create and manage your estimates in one place, saving you time and reducing errors, while increasing your confidence in your estimates.
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