import {atom} from "recoil";

const localStorageEffect = (key: string) => ({setSelf, onSet}: { setSelf: any, onSet: any }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null && savedValue !== "undefined") {
        setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any, _: any, isReset: any) => {
        isReset
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, JSON.stringify(newValue));
    });
};

export enum ReportType {
    TIS = "TIS",
    TIS2 = "TIS2",
}

export interface ReportTypeLabelAndValue {
    label: string;
    value: ReportType;
}

export const reportTypeState = atom<ReportTypeLabelAndValue | undefined>({
    key: 'reportTypeState',
    default: {label: 'Time in Status', value: ReportType.TIS},
    effects: [localStorageEffect('reportTypeState')]
})

export const statusColumnIdState = atom({
    key: 'statusColumnIdState',
    default: 'status',
    effects: [localStorageEffect('statusColumnIdState')]
})

