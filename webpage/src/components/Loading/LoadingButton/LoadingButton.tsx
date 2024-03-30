import {Button} from "@/Primitives/Button/Button";
import * as React from "react";
import {Spinner} from "@/Components/Loading/Spinner";

interface LoadingButtonProps {
    label: string;
    loadingStatus: boolean;
    type?: "button" | "submit" | "reset" | undefined;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | undefined;
    className?: string;
    onClick?: () => void;
}

const LoadingButton = ({label, loadingStatus, type, className, onClick}: LoadingButtonProps) => {
    return (
        <Button onClick={() => onClick && onClick()} className={className} disabled={loadingStatus} type={type}>
            {loadingStatus ? (
                <>
                    <div className={"flex justify-center items-center w-16"}>
                        <Spinner/>
                    </div>
                </>
            ) : (
                label
            )}
        </Button>
    );
};

export default LoadingButton;
