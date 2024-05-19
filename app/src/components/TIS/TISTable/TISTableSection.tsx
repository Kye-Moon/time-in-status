import React, {useEffect, useState} from "react";
import {ITableColumn} from "monday-ui-react-core/dist/types/components/Table/Table/Table";
import {
    Button,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Text
} from "monday-ui-react-core";
import {extractTISTableData, getTimeInStatusColumns, hexToRgb, lookupLabelColor} from "../../../lib/service";
import {ITEMS_PER_PAGE, useBoardViewDataContext} from "../../../context/TISBoardViewProvider";
import TableBodyLoading from "../../Loading/TableBodyLoading";
import {TextType} from "monday-ui-react-core/dist/types/components/Text/TextConstants";

export default function TISTableSection() {
    const {
        data,
        columnSettings,
        isFetching,
        itemCount,
        pageNumber,
        fetchNextPage,
        fetchPreviousPage
    } = useBoardViewDataContext()
    const [columns, setColumns] = useState<ITableColumn[]>([])
    const [tableData, setTableData] = useState<any[] | undefined>(undefined)
    const [columnWidths, setColumnWidths] = useState({
        group: {min: 50, max: 500},
        item_id: {min: 100, max: 500},
        item_name: {min: 200, max: 500},
        assigned_to: {min: 100, max: 500},
        status: {min: 100, max: 500},
        total: {min: 100, max: 500},
    });

    useEffect(() => {
        if (data) {
            setColumns(getTimeInStatusColumns(data, columnWidths));
            const preparedData = extractTISTableData(data, getTimeInStatusColumns(data, columnWidths));
            setTableData(preparedData);
        }
    }, [data, columnSettings]);

    useEffect(() => {
        if (data) {
            const newColumns = getTimeInStatusColumns(data, columnWidths);
            setColumns(newColumns);
        }
    }, [data, columnWidths]);

    const handleMouseDown = (columnId) => (e) => {
        if (!columnWidths[columnId]) {
            return;
        }
        const startWidth = columnWidths[columnId].min; // Use the min width for resizing
        const startX = e.clientX;

        const handleMouseMove = (e) => {
            const currentX = e.clientX;
            const newWidth = Math.max(
                columnWidths[columnId]?.min, // Ensure new width is not less than min
                Math.min(
                    columnWidths[columnId]?.max, // Ensure new width is not greater than max
                    startWidth + (currentX - startX)
                )
            );
            setColumnWidths({
                ...columnWidths,
                [columnId]: {min: newWidth, max: columnWidths[columnId]?.max} // Only update the min width
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className={'z-0 w-full'}>
            <Table withoutBorder={true} columns={columns} errorState={<p>Error</p>}
                   emptyState={<p>Empty</p>}>
                {columns.length === 0
                    ? <Skeleton fullWidth={true} height={45}/>
                    : <TableHeader>
                        {columns.map((column) => (
                            <div className={'relative text-center'} key={column.id}
                                 style={{width: columnWidths[column.id]}}>
                                <TableHeaderCell className={'text-center'} key={column.id} title={column.title}/>
                                {columnWidths[column.id] && (
                                    <div
                                        className={'resize-handle hover:bg-gray-900 hover:rounder-xl hover:opacity-50 hover:cursor-col-resize absolute top-0 bottom-0 right-0 w-5'}
                                        style={{
                                            cursor: 'col-resize',
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '5px'
                                        }}
                                        onMouseDown={handleMouseDown(column.id)}
                                    />
                                )}
                            </div>
                        ))}
                    </TableHeader>
                }
                <TableBody>
                    <>
                        {isFetching && <TableBodyLoading rows={5} columns={2}/>}
                        {!isFetching && tableData?.length === 0 && (
                            <div className={'text-center text-xl  flex justify-center py-24'}>
                                <Text
                                    //@ts-ignore
                                    type={"TextType.TEXT2"}> No items found on the board</Text>
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
                <>
                    {!isFetching && tableData && (
                        <div className={'flex justify-end mx-6 space-x-4 items-center py-4'}>
                            <div className={'flex flex-col text-xs'}>
                                <Text
                                    //@ts-ignore
                                    type={"TextType.TEXT2"}>{`Showing ${tableData?.length} of ${itemCount} items`}</Text>
                                <Text
                                    //@ts-ignore
                                    type={"TextType.TEXT2"}>{`Page ${pageNumber} of ${Math.ceil((itemCount ?? 1) / ITEMS_PER_PAGE)}`}</Text>
                            </div>
                            <div className={'flex space-x-1'}>
                                <Button size={'small'}
                                        disabled={Math.ceil((itemCount ?? 1) / ITEMS_PER_PAGE) === 1 || pageNumber === 1}
                                        onClick={fetchPreviousPage}
                                        className={'btn btn-primary mr-2'}>Previous</Button>
                                <Button
                                    disabled={Math.ceil((itemCount ?? 1) / ITEMS_PER_PAGE) === 1 || itemCount === 0 || pageNumber === Math.ceil((itemCount ?? 1) / ITEMS_PER_PAGE)}
                                    size={'small'}
                                    onClick={fetchNextPage}
                                    className={'btn btn-primary'}>Next</Button>
                            </div>
                        </div>
                    )}
                </>
            </Table>
        </div>
    )
}