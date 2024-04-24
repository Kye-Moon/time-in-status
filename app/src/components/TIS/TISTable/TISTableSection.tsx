import React, {useEffect, useState} from "react";
import {ITableColumn} from "monday-ui-react-core/dist/types/components/Table/Table/Table";
import {
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Label
} from "monday-ui-react-core";
import {extractTISTableData, getTimeInStatusColumns, lookupLabelColor} from "../../../lib/service";
import {useBoardViewDataContext} from "../../../context/TISBoardViewProvider";
import {hexToRgb} from "../../../lib/service";
import TableBodyLoading from "../../Loading/TableBodyLoading";

export default function TISTableSection() {
    const {data, columnSettings, isFetching} = useBoardViewDataContext()
    const [columns, setColumns] = useState<ITableColumn[]>([])
    const [tableData, setTableData] = useState<any[] | undefined>(undefined)


    useEffect(() => {
        if (data) {
            setColumns(getTimeInStatusColumns(data))
            const preparedData = extractTISTableData(data, getTimeInStatusColumns(data));
            setTableData(preparedData);
        }
    }, [data, columnSettings]);

    return (
        <div className={'z-0 w-full'}>
            <Table withoutBorder={true} columns={columns} errorState={<p>Error</p>}
                   emptyState={<p>Empty</p>}>
                {columns.length === 0 ? <Skeleton fullWidth={true} height={45}/> :
                    <TableHeader>
                        {columns.map((column: ITableColumn) => {
                            return <TableHeaderCell className={'text-center'} key={column.id} title={column.title}/>
                        })}
                    </TableHeader>
                }
                <TableBody>
                    <>
                        {isFetching && <TableBodyLoading rows={5} columns={2}/>}
                        {!isFetching && tableData?.length === 0 && (
                            <div className={'text-center text-xl font-semibold py-24'}>
                                <h1>
                                    No items found on the board
                                </h1>
                            </div>
                        )}
                        {!isFetching && tableData && (
                            <>
                                {tableData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((column) => {
                                            // Determine the content to render based on the column id
                                            const cellContent = (() => {
                                                switch (column.id) {
                                                    case 'item_name':
                                                        // Just return the cell data for simple cases
                                                        return row[column.id];
                                                    case 'assigned_to':
                                                        // Assume this renders a list of people, potentially with links or avatars
                                                        return row[column.id] ? row[column.id] : 'Unassigned';
                                                    case 'status':
                                                        const bgColor = lookupLabelColor(columnSettings, row[column.id])
                                                        return <div
                                                            className={'px-2 font-semibold flex justify-center min-w-32 rounded-sm text-sm text-center my-2'}
                                                            style={{
                                                                backgroundColor: `rgba(${hexToRgb(bgColor)}, 1)`, // For opaque background
                                                                color: `#fff`, // Text color matches background color but is not opaque
                                                            }}
                                                        >
                                                            {row[column.id] ? row[column.id].toUpperCase() : 'NO STATUS'}
                                                        </div>;
                                                    case 'total':
                                                        return row[column.id];
                                                    default:
                                                        // Default rendering for columns not explicitly handled
                                                        return row[column.id];
                                                }
                                            })();

                                            return <TableCell className={'text-center'}
                                                              key={column.id}>{cellContent}</TableCell>;
                                        })}
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </>
                </TableBody>
            </Table>
        </div>
    )
}