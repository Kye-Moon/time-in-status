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
        setSelectedGroups
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
            setStatusLabelAndValue(boardUniqueStatuses.map(status => ({label: status.toUpperCase(), value: status})))
        }
        if (boardUniquePeople) {
            setPeopleLabelAndValue(boardUniquePeople.map(person => ({
                label: person === '' ? 'Unassigned' : person,
                value: person
            })));
        }
        if (boardUniqueGroups) {
            setGroupLabelAndValue(boardUniqueGroups.map(group => ({label: group, value: group})))
        }
    }, [boardUniqueStatuses, boardUniquePeople])

    const handleStatusSelect = (selectedStatuses: any) => {
        setSelectedStatuses(selectedStatuses?.map((status: any) => status.value) ?? [])
    }

    const handlePeopleSelect = (selectedPeople: any) => {
        setSelectedPeople(selectedPeople?.map((person: any) => person.value) ?? [])
    }

    const handleGroupSelect = (selectedGroups: any) => {
        setSelectedGroups(selectedGroups?.map((group: any) => group.value) ?? [])
    }

    return (
        <div className={'grid grid-cols-8  space-x-6 w-full '}>
            <div className={'col-span-2'}>
                <Dropdown
                    className={'z-10'}
                    clearable={true}
                    title={'Group'}
                    options={groupLabelAndValue}
                    multi={true}
                    onChange={handleGroupSelect}
                    defaultValues={[]}
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
                    multiline={true}
                    defaultValues={[]}
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
                    defaultValues={[]}
                    placeholder={'Filter by person'}
                />
            </div>
            <div className={'col-span-2'}></div>
        </div>
    )
}