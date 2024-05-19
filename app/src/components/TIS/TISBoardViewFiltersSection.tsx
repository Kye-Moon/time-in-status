import React from "react";
import {useBoardViewDataContext} from "../../context/TISBoardViewProvider";
import {Dropdown} from "monday-ui-react-core";

export default function TISBoardViewFiltersSection() {
    const {
        boardUniqueStatuses,
        setSelectedStatuses,
        boardUniquePeople,
        setSelectedPeople,
        boardUniqueGroups,
        setSelectedGroups,
        selectedGroups,
        selectedPeople,
        selectedStatuses
    } = useBoardViewDataContext()

    const [statusLabelAndValue, setStatusLabelAndValue] = React.useState<{
        label: string,
        value: string
    }[]>([])
    const [peopleLabelAndValue, setPeopleLabelAndValue] = React.useState<{
        label: string,
        value: string
    }[]>([])
    const [groupLabelAndValue, setGroupLabelAndValue] = React.useState<{
        label: string,
        value: string
    }[]>([])

    React.useEffect(() => {
        if (boardUniqueStatuses) {
            setStatusLabelAndValue(boardUniqueStatuses)
        }
        if (boardUniquePeople) {
            setPeopleLabelAndValue(boardUniquePeople)
        }
        if (boardUniqueGroups) {
            setGroupLabelAndValue(boardUniqueGroups)
        }
    }, [boardUniqueStatuses, boardUniquePeople, boardUniqueGroups])

    const handleStatusSelect = (selectedStatuses: any) => {
        setSelectedStatuses(selectedStatuses)
    }

    const handlePeopleSelect = (selectedPeople: any) => {
        setSelectedPeople(selectedPeople)
    }

    const handleGroupSelect = (selectedGroup: { label: string, value: string }) => {
        setSelectedGroups(selectedGroup)
    }

    return (
        <div className={'grid grid-cols-8  space-x-6 w-full '}>
            <div className={'col-span-2'}>
                <Dropdown
                    className={'z-10'}
                    clearable={true}
                    title={'Group'}
                    options={groupLabelAndValue}
                    multi={false}
                    onChange={handleGroupSelect}
                    value={selectedGroups}
                    placeholder={'Filter by Group'}
                />
            </div>
            <div className={'col-span-2'}>
                <Dropdown
                    className={'z-10'}
                    clearable={true}
                    title={'Status'}
                    options={statusLabelAndValue}
                    multi={true}
                    onChange={handleStatusSelect}
                    value={selectedStatuses}
                    multiline={true}
                    placeholder={'Filter by status'}
                />
            </div>
            <div className={'col-span-2'}>
                <Dropdown
                    className={'z-10'}
                    clearable={true}
                    title={'People'}
                    options={peopleLabelAndValue}
                    multi={true}
                    onChange={handlePeopleSelect}
                    value={selectedPeople}
                    placeholder={'Filter by person'}
                />
            </div>
            <div className={'col-span-2'}></div>
        </div>
    )
}