import React from "react";
import {Label} from "monday-ui-react-core";
import ReportTypeSelect from "./ReportTypeSelect";
import StatusColumnSelect from "./StatusColumnSelect";
import {LabelColor} from "monday-ui-react-core/dist/types/components/Label/LabelConstants";

export default function ReportTypeByFieldSection() {
    return (
        <div className={'grid grid-cols-8 py-4 space-x-6 '}>
            <div className={'col-span-2 space-y-1'}>
                <Label text="Report Type"/>
                <ReportTypeSelect/>
            </div>
            <div className={'col-span-2  space-y-1'}>
                <Label text="Status Column"/>
                <StatusColumnSelect/>
            </div>
        </div>
    )
}