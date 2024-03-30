import fieldLenz from "@/Assets/FieldLens.png";
import {CameraIcon, Database} from "lucide-react";

export default function FieldLenzProductContent() {
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
                            className={'flex text-sm mb-2 justify-center items-center bg-purple-300 text-purple-600 py-1 px-2 rounded-full w-[118px]'}>
                            Coming soon
                        </div>
                        <div className="lg:max-w-xl">
                            <div className="flex items-center my-8">
                                <div
                                    className="flex justify-center items-center w-12 h-12 rounded-full bg-primary-100 lg:h-14 lg:w-14">
                                    <img src={fieldLenz} alt="Verification icon"/>
                                </div>
                                <p className="text-4xl font-semibold leading-7 bg ml-2 lg:ml-4">
                                    FieldLenz
                                </p>
                            </div>

                            <h1 className="mt-2  text-3xl font-bold text-gray-900 sm:text-4xl">
                                Take, manage and add metadata to your site photos with ease.
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-700">
                                FieldLenz allows you to easily take photos on site and add useful metadata to them, such
                                as location, date, time, descriptions, tags and more. It also allows you to manage where
                                photos are stored automatically.
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
                                    <CameraIcon className="mt-1 h-5 w-5 flex-none text-purple-500"
                                                aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Add meaningful metadata to images:</strong>
                                        {'  '}
                                        FieldLenz allows you to add meaningful metadata to images, such as location, date, time, descriptions, tags and more. No more drawing on photos or trying to remember where they were taken.
                                    </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <Database className="mt-1 h-5 w-5 flex-none text-purple-500"
                                              aria-hidden="true"/>
                                    <span>
                                        <strong
                                            className="font-semibold text-gray-900">Set default storage locations for all your images:</strong>
                                        {'  '}
                                        Set default job folders for all your images such as google drive, dropbox, or your own server. FieldLenz will automatically store your images in the correct location. Making it easy to find and manage your images.
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