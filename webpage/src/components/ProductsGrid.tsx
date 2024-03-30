import React from 'react';
import Logo from '../../public/img_1.png';

export default function ProductsGrid() {
    return (
        <section className="bg-slate-900 text-gray-200 flex justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-2xl sm:py-16 lg:px-6">
                <div className="max-w-screen mb-8 lg:mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-extrabold pb-40">Our Products</h2>
                </div>
                <div className="space-y-8 flex md:space-y-0">
                    <div className="flex px-40 w-1/2 flex-col items-left justify-center mb-4">
                        <div className={''}>
                            <h3 className="mb-2 text-3xl font-bold">Status Report </h3>
                            <h3 className="mb-2 text-xl font-semibold">Maximize Your Project Visibility</h3>
                        </div>
                        <p className="text-gray-200 leading-6 py-6">
                            Dive into the intricacies of your projects with our Status Report app.
                            Designed for the Monday.com marketplace, this tool illuminates the progress of each task,
                            displaying how long it's been in any given status.
                            Tailor-made for teams seeking to enhance accountability and efficiency, our app simplifies
                            project oversight and ensures that every task moves seamlessly towards completion.
                            Perfect for agile workflows and dynamic project management environments, Status Report is
                            your key to unlocking a deeper understanding of your work's flow and rhythm.
                        </p>
                        <div>
                            <button
                                className="mt-4 bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="p-2 w-2/3 flex justify-center items-center">
                        <div className="inline-block  p-2 rounded-lg shadow-md relative overflow-hidden">
                            <img src={Logo} alt="Hero"
                                 className="relative rounded-lg shadow-lg shadow-indigo-900"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}