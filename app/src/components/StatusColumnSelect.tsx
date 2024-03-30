import {Dropdown} from "monday-ui-react-core";
import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {statusColumnIdState} from "../state/atoms";
import {useMondayContext} from "../context/MondayContext";
import {getBoardStatusColumns, GetBoardStatusColumnsResponse} from "../query/board";

export default function StatusColumnSelect() {
    const {monday, isLoaded, context} = useMondayContext();
    const [statusColumnId, setStatusColumnId] = useRecoilState(statusColumnIdState)
    const [statusColumns, setStatusColumns] = useState<{ label: string, value: string }[]>([]);

    useEffect(() => {
        async function getStatusColumns() {
            let colLabelAndValues: { label: string, value: string }[] = [];
            const columns = await monday.api(getBoardStatusColumns({boardId: context.boardId})) as GetBoardStatusColumnsResponse;
            columns.data.boards[0].columns.forEach((column) => {
                return colLabelAndValues.push({label: column.title, value: column.id});
            });
            setStatusColumns(colLabelAndValues);
            // If the status column is not set or the status column is not in the list of columns, set the status column to the first column in the list
            if (!statusColumnId || !colLabelAndValues.find((col) => col.value === statusColumnId)) {
                setStatusColumnId(colLabelAndValues[0].value);
            }
        }

        if (isLoaded && context && context?.boardId) {
            getStatusColumns()
        }
    }, [context, isLoaded]);

    return (
        <div className={'col-span-2'}>
            <Dropdown
                className={'z-20'}
                value={statusColumns.find((col) => col.value === statusColumnId)}
                key={'dropdown'}
                title={'Status Column'}
                options={statusColumns}
                clearable={false}
                onChange={(value) => {
                    setStatusColumnId(value.value)
                }}
            />
        </div>
    )
}