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
    setSelectedPeople: React.Dispatch<React.SetStateAction<string[]>>
    setSelectedGroups: React.Dispatch<React.SetStateAction<string[]>>
    boardUniqueStatuses: string[];
    boardUniquePeople: string[];
    boardUniqueGroups: string[];
    data: ParsedLogs[] | undefined;
    columnSettings: any;
    isFetching?: boolean;
}

const BoardViewDataContext = createContext<ContextProps>({
    setColumnId: () => {
    },
    setSelectedStatuses: () => {
    },
    setSelectedPeople: () => {
    },
    setSelectedGroups: () => {
    },
    boardUniqueGroups: [],
    boardUniqueStatuses: [],
    boardUniquePeople: [],
    data: undefined,
    columnSettings: undefined,
    isFetching: false
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

    useEffect(() => {
        async function fetchData() {
            setIsFetching(true)
            if (!context || !context?.boardId || !columnId) {
                setIsFetching(false)
                return
            }
            const boardItemIdsQueryData = await monday.api(getBoardItems({boardId: context.boardId}))
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

        if (isLoaded && context && context?.boardId && columnId) {
            fetchData()
        }
    }, [context, columnId, isLoaded]);

    useEffect(() => {
        if (TISData) {
            let tempFilteredData = [...TISData]; // Start with a copy of the original data

            // Apply people filter if any selectedPeople exist
            if (selectedPeople.length > 0) {
                tempFilteredData = tempFilteredData.filter((item) =>
                    item.people.some((person) => selectedPeople.includes(person)) || item.people.length === 0
                );
            }

            // Apply statuses filter if any selectedStatuses exist
            if (selectedStatuses.length > 0) {
                tempFilteredData = tempFilteredData.filter((item) =>
                    selectedStatuses.includes(item.currentStatus)
                );
            }

            // Apply groups filter if any selectedGroups exist
            if (selectedGroups.length > 0) {
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
            setSelectedStatuses,
            setSelectedPeople,
            setSelectedGroups,
            boardUniqueGroups: boardUniqueGroups,
            boardUniquePeople: boardUniquePeople,
            data: filteredData,
            columnSettings: columnSettings,
            boardUniqueStatuses: boardUniqueStatuses,
            isFetching: isFetching
        }}>
            {children}
        </BoardViewDataContext.Provider>
    );
};