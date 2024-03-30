import React from "react";
import {Skeleton} from "monday-ui-react-core";

interface TableBodyLoadingProps {
    rows: number;
    columns: number;
}

export default function TableBodyLoading({rows, columns}: TableBodyLoadingProps) {
    return (
        <div className={'flex flex-col gap-2 mt-2'}>
            {Array.from({length: rows}).map((_, i) => (
                <div key={i} className={'flex gap-2'}>
                    {Array.from({length: columns}).map((_, j) => (
                        <Skeleton key={j} fullWidth={true} height={45}/>
                    ))}
                </div>
            ))}
        </div>
    )
}