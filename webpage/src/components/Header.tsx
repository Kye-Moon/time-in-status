import {useState} from "react";
import logo from "/Logo.png";
import {useNavigate} from "@tanstack/react-router";


export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="bg-slate-900  w-full ">
            <nav className="mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 align-middle">
                    <a href="#">
                        <img className="h-12 w-auto"
                             src={logo} alt=""/>
                    </a>
                    <span className="pl-4  text-3xl  text-gray-100 font-bold">SyncStack</span>
                </div>
            </nav>
        </header>
    )
}