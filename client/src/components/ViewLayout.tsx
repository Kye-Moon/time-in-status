import React from "react";
import ReportTypeByFieldSection from "./ReportTypeByFieldSection";
import BoardViewRenderer from "./BoardViewRenderer";

export default function ViewLayout() {
    return (
        <>
            <div className={'mx-2'}>
                <ReportTypeByFieldSection/>
            </div>
            <BoardViewRenderer/>
        </>
    )
}