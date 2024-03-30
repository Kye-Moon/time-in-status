import React from "react";
import {Dropdown} from "monday-ui-react-core";
import ReportTypeSelect from "./ReportTypeSelect";
import StatusColumnSelect from "./StatusColumnSelect";

``
export default function ReportTypeByFieldSection() {
    return (
        <div className={'grid grid-cols-8 py-4 space-x-6'}>
            <div className={'col-span-2'}>
                <h1 className={'font-semibold text-sm'}>Report Type</h1>
                <ReportTypeSelect/>
            </div>
            <div className={'col-span-2'}>
                <h1 className={'font-semibold text-sm'}>Status Column</h1>
                <StatusColumnSelect/>
            </div>
        </div>
    )
}