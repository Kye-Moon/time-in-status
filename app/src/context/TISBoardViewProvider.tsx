import React, {createContext, useContext, useEffect, useState} from 'react';
import {useMondayContext} from "./MondayContext";
import {getBoardActivityLogs, getBoardItems} from "../query/board";
import {mergeProcessedLogsAndItems, parseColumnSettings, processActivityLogs} from "../lib/service";
import {ParsedLogs} from "../types/types";
import {SetterOrUpdater, useRecoilState} from "recoil";
import {statusColumnIdState} from "../state/atoms";


interface ContextProps {
    setColumnId: SetterOrUpdater<string | undefined>
    setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>
    selectedStatuses: string[];
    setSelectedPeople: React.Dispatch<React.SetStateAction<string[]>>
    selectedPeople: string[];
    setSelectedGroups: React.Dispatch<React.SetStateAction<string[]>>
    selectedGroups: string[];
    boardUniqueStatuses: string[];
    boardUniquePeople: string[];
    boardUniqueGroups: string[];
    data: ParsedLogs[] | undefined;
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
    selectedGroups: [],
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
    const [TISData, setTISData] = useState<ParsedLogs[] | undefined>(undefined)
    const [columnId, setColumnId] = useRecoilState(statusColumnIdState)
    const [columnSettings, setColumnSettings] = useState<any>(undefined)

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [boardUniqueStatuses, setBoardUniqueStatuses] = useState<string[]>([])

    const [selectedPeople, setSelectedPeople] = useState<string[]>([])
    const [boardUniquePeople, setBoardUniquePeople] = useState<string[]>([])

    const [selectedGroups, setSelectedGroups] = useState<string[]>([])
    const [boardUniqueGroups, setBoardUniqueGroups] = useState<string[]>([])

    const [filteredData, setFilteredData] = useState<ParsedLogs[] | undefined>(undefined)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [cursorHistory, setCursorHistory] = useState([null]); // Initialize with the initial cursor
    const [pageIndex, setPageIndex] = useState(0);
    const [itemCount, setItemCount] = useState<number | undefined>(undefined)
    const [totalPages, setTotalPages] = useState<number | undefined>(undefined)

    //Sync with instance level view settings
    useEffect(() => {
        const asyncFunc = async () => {
            const selectedStatuses = await monday.storage.instance.getItem('selectedStatuses')
            const selectedPeople = await monday.storage.instance.getItem('selectedPeople')
            const selectedGroups = await monday.storage.instance.getItem('selectedGroups')
            if (selectedStatuses?.data.value === 'empty' || selectedStatuses?.data.value === undefined) {
                setSelectedStatuses([])
            } else {
                setSelectedStatuses(selectedStatuses?.data.value?.split(','))
            }
            if (selectedPeople?.data.value === 'empty' || selectedPeople?.data.value === undefined) {
                setSelectedPeople([])
            } else {
                setSelectedPeople(selectedPeople?.data.value?.split(','))
            }
            if (selectedGroups?.data.value === 'empty' || selectedGroups?.data.value === undefined) {
                setSelectedGroups([])
            } else {
                setSelectedGroups(selectedGroups?.data.value?.split(','))
            }
        }
        asyncFunc()
    }, [TISData]);

    const handleSetSelectedStatuses = async (statuses: string[]) => {
        await monday.storage.instance.setItem('selectedStatuses', statuses.length > 0 ? statuses : 'empty')
        setSelectedStatuses(statuses)
    }

    const handleSetSelectedPeople = async (people: string[]) => {
        await monday.storage.instance.setItem('selectedPeople', people.length > 0 ? people : 'empty')
        setSelectedPeople(people)
    }

    const handleSetSelectedGroups = async (groups: string[]) => {
        await monday.storage.instance.setItem('selectedGroups', groups.length > 0 ? groups : 'empty')
        setSelectedGroups(groups)
    }

    useEffect(() => {
        async function fetchData() {
            if (!context || !context?.boardId || !columnId) {
                setIsFetching(false)
                return
            }
            const boardItemIdsQueryData = await monday.api(getBoardItems({
                boardId: context.boardId,
                cursor: cursorHistory[pageIndex] || undefined
            }))
            const newCursor = boardItemIdsQueryData.data.boards[0].items_page.cursor
            // Update cursor history if moving forward
            if (pageIndex === cursorHistory.length - 1 && newCursor) {
                setCursorHistory([...cursorHistory, newCursor]);
            }
            setItemCount(boardItemIdsQueryData.data.boards[0].items_count)
            setTotalPages(boardItemIdsQueryData.data.boards[0].items_count / ITEMS_PER_PAGE)
            const itemIds = boardItemIdsQueryData.data.boards[0].items_page.items?.map((item: any) => item.id)
            if (!itemIds) {
                setIsFetching(false)
                return
            }
            const data = await monday.api(getBoardActivityLogs({
                boardId: context.boardId,
                columnId: columnId,
                itemIds: itemIds
            }))

            const logs = processActivityLogs(data.data.boards[0].activity_logs)
            const parsedData = mergeProcessedLogsAndItems(logs, boardItemIdsQueryData, columnId)
            const statusSettings = parseColumnSettings(boardItemIdsQueryData.data.boards[0].columns, columnId);
            const uniqueStatuses = new Set(parsedData.flatMap(item => item.statusDurationAndDetails.map(sd => sd.status)));
            const uniquePeople = new Set(parsedData.flatMap(item => item.people.map(p => p)));
            const uniqueGroups = new Set(parsedData.flatMap(item => item.groupTitle));

            setBoardUniqueGroups(Array.from(uniqueGroups))
            setBoardUniquePeople(Array.from(uniquePeople))
            setBoardUniqueStatuses(Array.from(uniqueStatuses))
            setColumnSettings(statusSettings)
            setTISData(parsedData)
            setIsFetching(false)
        }

        if (isLoaded && context?.boardId) {
            fetchData();
        }
    }, [context, columnId, isLoaded, pageIndex]);

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

    useEffect(() => {
        if (TISData) {
            let tempFilteredData = [...TISData]; // Start with a copy of the original data

            // Apply people filter if any selectedPeople exist
            if (selectedPeople?.length > 0) {
                tempFilteredData = tempFilteredData.filter((item) =>
                    item.people.some((person) => selectedPeople.includes(person)) || item.people.length === 0
                );
            }

            // Apply statuses filter if any selectedStatuses exist
            if (selectedStatuses?.length > 0) {
                tempFilteredData = tempFilteredData.filter((item) =>
                    selectedStatuses.includes(item.currentStatus)
                );
            }

            // Apply groups filter if any selectedGroups exist
            if (selectedGroups?.length > 0) {
                tempFilteredData = tempFilteredData.filter((item) =>
                    selectedGroups.includes(item.groupTitle)
                );
            }

            // Finally, update the filteredData state with the result
            setFilteredData(tempFilteredData);
        }
    }, [selectedPeople, selectedStatuses, selectedGroups, TISData]); // Depend on all filter criteria + original data


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
            data: filteredData,
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