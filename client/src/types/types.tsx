export interface ItemStatusUpdates {
    pulseId: string;
    updates: ItemStatusUpdateData[];
}

export interface ItemStatusUpdateData {
    status: string;
    timestamp: string;
}

export interface ActivityLog {
    event: string;
    data: string;
    created_at: string;
}

export interface StatusChange {
    board_id: number;
    pulse_id: number;
    status: string;
    timestamp: number;
}

export interface ItemStatusDuration {
    [status: string]: number; // Key: status text, Value: duration in seconds
}
interface ItemCurrentState {
    statusDurationAndDetails: ItemStatusDuration;
    currentStatus?: string;
    currentStatusStartTime?: number
    lastTimestamp?: number
    lastStatus?: string;
}

export interface ItemDetails {
    [pulse_id: number]: ItemCurrentState;
}

export interface StatusDurationAndDetails {
    status: string;
    duration: number;
}


export interface ParsedLogs {
    id: string;
    statusDurationAndDetails: StatusDurationAndDetails[];
    totalDuration: number;
    currentStatus: string;
    createdAt: string;
    itemName: string;
    groupTitle: string;
    people: string[];
}

//////////////////////////

export interface BoardApiResponse {
    data: Data;
    account_id: number;
}

interface Data {
    boards: Board[];
}

interface Board {
    columns: Column[];
    items_page: ItemsPage;
}

interface Column {
    id: string;
    settings_str: string; // JSON string, might need parsing to access inner properties
}

interface ItemsPage {
    items: Item[];
}

interface Item {
    id: string;
    name: string;
    created_at: string; // ISO 8601 format date string
    group: Group;
    column_values: ColumnValue[];
}

interface Group {
    title: string;
}

interface ColumnValue {
    id: string;
    text: string;
    type: string; // Could potentially be a union type if there are a limited number of known types e.g. "people" | "status"
}

export interface StatusSettings {
    done_colors: number[];
    labels: { [key: string]: string };
    labels_positions_v2: { [key: string]: number };
    labels_colors: { [key: string]: { color: string; border: string; var_name: string } };
}