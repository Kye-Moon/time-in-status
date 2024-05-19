import React, {createContext, useContext, useEffect, useState} from 'react';
import {useMondayContext} from "./MondayContext";
import {
    FilterOptionsResponse,
    getBoardActivityLogs,
    getBoardItems, getBoardItemsByGroup, GetBoardItemsByGroupResponse,
    GetBoardItemsResponse,
    getFilterOptions
} from "../query/board";
import {mergeProcessedLogsAndItems, parseActivityLogs, parseColumnSettings, ProcessedItem} from "../lib/service";
import {SetterOrUpdater, useRecoilState} from "recoil";
import {statusColumnIdState} from "../state/atoms";
import {useEffectDebugger} from "../lib/utils";

export type LabelObject = {
    [key: string]: string;
};

interface ContextProps {
    setColumnId: SetterOrUpdater<string | undefined>
    setSelectedStatuses: React.Dispatch<React.SetStateAction<{ label: string, value: string }[]>>
    selectedStatuses: { label: string, value: string }[];
    setSelectedPeople: React.Dispatch<React.SetStateAction<{ label: string, value: string }[]>>
    selectedPeople: { label: string, value: string }[];
    setSelectedGroups: React.Dispatch<React.SetStateAction<{ label: string, value: string }>>
    selectedGroups: { label: string, value: string } | undefined;
    boardUniqueStatuses: { label: string, value: string }[];
    boardUniquePeople: { label: string, value: string }[];
    boardUniqueGroups: { label: string, value: string }[];
    data: ProcessedItem[] | undefined;
    columnSettings: any;
    isFetching?: boolean;
    fetchNextPage: () => void;
    fetchPreviousPage: () => void;
    itemCount?: number;
    pageNumber: number
}

export const ITEMS_PER_PAGE = 50;

const BoardViewDataContext = createContext<ContextProps>({
    setColumnId: () => {
    },
    setSelectedStatuses: () => {
    },
    selectedStatuses: [],
    setSelectedPeople: () => {
    },
    selectedPeople: [],
    setSelectedGroups: () => {
    },
    selectedGroups: undefined,
    boardUniqueGroups: [],
    boardUniqueStatuses: [],
    boardUniquePeople: [],
    data: undefined,
    columnSettings: undefined,
    isFetching: false,
    fetchNextPage: () => {
    },
    fetchPreviousPage: () => {
    },
    itemCount: undefined,
    pageNumber: 1
});

export const useBoardViewDataContext = () => useContext(BoardViewDataContext);

export const TISBoardViewProvider = ({children}) => {
    const {settings, context, isLoaded, monday} = useMondayContext();
    const [TISData, setTISData] = useState<ProcessedItem[] | undefined>(undefined)
    const [columnId, setColumnId] = useRecoilState(statusColumnIdState)
    const [columnSettings, setColumnSettings] = useState<any>(undefined)

    const [selectedStatuses, setSelectedStatuses] = useState<{ label: string, value: string }[]>([])
    const [boardUniqueStatuses, setBoardUniqueStatuses] = useState<{ label: string, value: string }[]>([])
    const [selectedPeople, setSelectedPeople] = useState<{ label: string, value: string }[]>([])
    const [boardUniquePeople, setBoardUniquePeople] = useState<{ label: string, value: string }[]>([])
    const [selectedGroups, setSelectedGroups] = useState<{ label: string, value: string } | undefined>(undefined)
    const [boardUniqueGroups, setBoardUniqueGroups] = useState<{ label: string, value: string }[]>([])

    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [cursorHistory, setCursorHistory] = useState(['']); // Initialize with the initial cursor
    const [pageIndex, setPageIndex] = useState(0);
    const [itemCount, setItemCount] = useState<number | undefined>(undefined)
    const [totalPages, setTotalPages] = useState<number | undefined>(undefined)
    const [filtersInitialised, setFiltersInitialised] = useState(false); // New state to track initialization

    const [board_query_params, setBoardQueryParams] = useState<{
        column_id: string,
        compare_value: string[]
        operator: 'is_empty' | 'contains_terms'
    }[] | undefined>(undefined)


    const generateBoardQueryParams = () => {
        const params: any = []
        if (selectedStatuses && selectedStatuses?.length > 0) {
            const values = selectedStatuses.map(status => parseInt(status.value))
            params.push({
                column_id: columnId,
                compare_value: values,
                operator: 'any_of'
            })
        }
        if (selectedPeople?.length > 0) {
            const values = selectedPeople.map(person => (`"person-${person.value}"`))
            params.push({
                column_id: 'person', // Adjust to your column ID for people
                compare_value: values,
                operator: 'any_of'
            });
        }
        setBoardQueryParams(params.length > 0 ? params : undefined);
    }

    // Monitor the selection criteria changes and regenerate the query params
    useEffect(() => {
        if (filtersInitialised) {
            console.log('selection criteria changed')
            generateBoardQueryParams();
        }
    }, [selectedStatuses, selectedPeople, selectedGroups]);

    //Sync with instance level view settings run once on load
    useEffect(() => {
        console.log('syncing with instance level view settings')
        const asyncFunc = async () => {
            setFiltersInitialised(false); // Set initialization to false before the async function starts
            const selectedStatuses = await monday.storage.instance.getItem('selectedStatuses')
            const selectedPeople = await monday.storage.instance.getItem('selectedPeople')
            const selectedGroup = await monday.storage.instance.getItem('selectedGroup')
            if (selectedStatuses?.data.value === 'empty' || selectedStatuses?.data.value === undefined) {
                setSelectedStatuses([])
            } else {
                const selectedStatusesArray = selectedStatuses?.data.value?.split(',')
                const toSet = selectedStatusesArray?.map((status: string) => ({
                    label: boardUniqueStatuses.find(uniqueStatus => uniqueStatus.value === status)?.label,
                    value: status
                }))
                setSelectedStatuses(toSet)
            }
            if (selectedPeople?.data.value === 'empty' || selectedPeople?.data.value === undefined) {
                setSelectedPeople([])
            } else {
                const selectedPeopleArray = selectedPeople?.data.value?.split(',')
                const toSet = selectedPeopleArray?.map((personId: string) => ({
                    label: boardUniquePeople.find(uniquePerson => uniquePerson.value === personId)?.label,
                    value: personId
                }))
                setSelectedPeople(toSet)
            }
            if (selectedGroup?.data.value === 'empty' || selectedGroup?.data.value === undefined) {
                setSelectedGroups(undefined)
            } else {
                const selected = selectedGroup?.data.value
                setSelectedGroups(
                    {
                        label: boardUniqueGroups.find(uniqueGroup => uniqueGroup.value === selected)?.label || '',
                        value: selected
                    }
                )
            }
            setFiltersInitialised(true); // Set initialization to true after the async function completes
        }
        asyncFunc()
    }, [boardUniqueStatuses, boardUniqueGroups, boardUniquePeople]);

    //Get search filter options
    useEffect(() => {
        setFiltersInitialised(false); // Set initialization to false before the async function starts
        const asyncFunc = async () => {
            const filterOptions = await monday.api(getFilterOptions({
                boardId: context.boardId,
                columnId: columnId
            })) as FilterOptionsResponse
            const people = filterOptions.data.users.map(user => ({
                label: user.name,
                value: user.id
            }))
            setBoardUniquePeople(people)
            const statusLabels = JSON.parse(filterOptions.data.boards[0].columns[0].settings_str).labels as LabelObject
            const labelsArray = Object.entries(statusLabels).map(([key, value]) => ({
                label: value,
                value: key
            }));
            setBoardUniqueStatuses(labelsArray)

            const groupLabels = filterOptions.data.boards[0].groups.map(group => ({
                label: group.title,
                value: group.id
            }))
            setBoardUniqueGroups(groupLabels)
            setFiltersInitialised(true); // Set initialization to true after the async function completes
        }
        asyncFunc()
    }, [columnId])

    const handleSetSelectedStatuses = async (statuses: { label: string, value: string }[]) => {
        await monday.storage.instance.setItem('selectedStatuses', statuses && statuses.length > 0 ? statuses.map(status => status.value) : 'empty')
        setSelectedStatuses(statuses)
    }

    const handleSetSelectedPeople = async (people: { label: string, value: string }[]) => {
        await monday.storage.instance.setItem('selectedPeople', people && people.length > 0 ? people.map(person => person.value) : 'empty')
        setSelectedPeople(people)
    }
    //
    const handleSetSelectedGroups = async (group: { label: string, value: string }) => {
        await monday.storage.instance.setItem('selectedGroup', group ? group.value : 'empty')
        setSelectedGroups(group ? group : undefined)
    }

    useEffectDebugger(() => {
        // log to determine what has caused the re-render

        async function fetchData() {
            if (!context || !context?.boardId || !columnId || !filtersInitialised) {
                return
            }
            setIsFetching(true)
            let boardData: GetBoardItemsResponse = {} as GetBoardItemsResponse
            if (selectedGroups) {
                const result = await monday.api(getBoardItemsByGroup({
                    boardId: context.boardId,
                    cursor: cursorHistory[pageIndex] || undefined,
                    query_params: board_query_params,
                    groupId: selectedGroups.value
                })) as GetBoardItemsByGroupResponse
                boardData = {
                    data: {
                        boards: [
                            {
                                columns: result.data.boards[0].columns,
                                items_count: result.data.boards[0].groups[0].items_page.items.length,
                                items_page: {
                                    cursor: result.data.boards[0].groups[0].items_page.cursor,
                                    items: result.data.boards[0].groups[0].items_page.items
                                }
                            }
                        ]
                    }
                }
            } else {
                boardData = await monday.api(getBoardItems({
                    boardId: context.boardId,
                    cursor: cursorHistory[pageIndex] || undefined,
                    query_params: board_query_params
                })) as GetBoardItemsResponse
            }

            const newCursor = boardData.data.boards[0].items_page.cursor
            // Update cursor history if moving forward
            if (pageIndex === cursorHistory.length - 1 && newCursor) {
                setCursorHistory([...cursorHistory, newCursor]);
            }
            setItemCount(boardData.data.boards[0].items_count)
            setTotalPages(boardData.data.boards[0].items_count / ITEMS_PER_PAGE)
            const itemIds = boardData.data.boards[0].items_page.items?.map((item: any) => item.id)
            if (!itemIds) {
                setIsFetching(false)
                return
            }
            const data = await monday.api(getBoardActivityLogs({
                boardId: context.boardId,
                columnId: columnId,
                itemIds: itemIds
            }))

            const logs = parseActivityLogs(data.data.boards[0].activity_logs, columnId)
            const parsedData = mergeProcessedLogsAndItems(logs, boardData, columnId)
            const statusSettings = parseColumnSettings(boardData.data.boards[0].columns, columnId);
            setColumnSettings(statusSettings)
            setTISData(parsedData)
            setIsFetching(false)
        }

        if (isLoaded && context?.boardId) {
            fetchData();
        }
    }, [columnId, isLoaded, pageIndex, board_query_params, selectedGroups]);

    const fetchNextPage = () => {
        // Calculate the potential next page index
        const potentialNextPageIndex = pageIndex + 1;

        // Ensure this does not exceed the number of available pages
        if (potentialNextPageIndex < (totalPages || 0)) {
            if (potentialNextPageIndex < cursorHistory.length) {
                setPageIndex(potentialNextPageIndex); // Move forward within existing history
            } else {
                // Assuming cursor for a new page needs to be fetched
                // Trigger data fetch which will handle cursor update and pageIndex
                setPageIndex(potentialNextPageIndex); // This will trigger useEffect to fetch data
            }
        }
    };

    const fetchPreviousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1); // Move back to the previous cursor in history
        }
    };


    return (
        <BoardViewDataContext.Provider value={{
            setColumnId,
            setSelectedStatuses: handleSetSelectedStatuses,
            selectedStatuses,
            setSelectedPeople: handleSetSelectedPeople,
            selectedPeople,
            setSelectedGroups: handleSetSelectedGroups,
            selectedGroups,
            boardUniqueGroups: boardUniqueGroups,
            boardUniquePeople: boardUniquePeople,
            data: TISData,
            columnSettings: columnSettings,
            boardUniqueStatuses: boardUniqueStatuses,
            isFetching: isFetching,
            fetchNextPage,
            fetchPreviousPage,
            itemCount,
            pageNumber: pageIndex + 1
        }}>
            {children}
        </BoardViewDataContext.Provider>
    );
};