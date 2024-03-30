import {Dropdown} from "monday-ui-react-core";
import React from "react";
import {useRecoilState} from "recoil";
import {ReportType, reportTypeState} from "../state/atoms";

const reportTypes = [
    {label: 'Time in Status', value: ReportType.TIS},
]

export default function ReportTypeSelect() {
    const [reportTypeLabelAndValue, setReportTypeLabelAndValue] = useRecoilState(reportTypeState)
    return (
        <Dropdown
            title={'Report Type'}
            className={'z-20'}
            value={reportTypeLabelAndValue}
            clearable={false}
            key={'dropdown'}
            options={reportTypes}
            onChange={(value) => {
                setReportTypeLabelAndValue(value)
            }}
        />
    )
}