import Logo from "../../public/Logo.png";

export default function Footer() {
    return (
        <footer id='contact' className="p-4 text-white md:p-8 lg:p-10 h-96 bg-gray-900">
            <div className="mx-auto max-w-screen-xl text-center">
                <a href="#"
                   className="flex justify-center items-center text-2xl font-semibold space-x-4 ">
                    <img alt={'logo'} className={'h-16'} src={Logo}/>
                    <h2 className="text-3xl font-semibold">SyncStack</h2>
                </a>
            </div>
            <div >
                <h1 className="text-2xl font-semibold text-center mb-2">Contact</h1>
                <h1 className="text-md font-semibold text-center mb-2">Sales and Info</h1>
                <div className="flex text-xl justify-center items-center space-x-4">
                    kyemoondevelopment@gmail.com
                </div>
            </div>
        </footer>
    )
}