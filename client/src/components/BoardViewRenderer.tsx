import {TISBoardViewProvider} from "../context/TISBoardViewProvider";
import TISBoardViewFiltersSection from "./TIS/TISBoardViewFiltersSection";
import TISTableSection from "./TIS/TISTable/TISTableSection";
import React from "react";
import {useRecoilValue} from "recoil";
import {ReportType, reportTypeState} from "../state/atoms";
import {Divider} from "monday-ui-react-core";

export default function BoardViewRenderer() {
    const reportTypeLabelAndValue = useRecoilValue(reportTypeState)

    return (
        <>
            {!reportTypeLabelAndValue && <div className={'text-center text-2xl'}>Select a report type</div>}
            {reportTypeLabelAndValue?.value === ReportType.TIS && (
                <TISBoardViewProvider>
                    <div className={'mx-2'}>
                        <TISBoardViewFiltersSection/>
                    </div>
                    <Divider/>
                    <TISTableSection/>
                </TISBoardViewProvider>)
            }
        </>
    )
}