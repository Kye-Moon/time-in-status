// export interface ItemStatusUpdates {
//     pulseId: string;
//     updates: ItemStatusUpdateData[];
// }
//
// export interface ItemStatusUpdateData {
//     status: string;
//     timestamp: string;
// }
//
// export interface ActivityLog {
//     event: string;
//     data: string;
//     created_at: string;
// }
//
// export interface StatusChange {
//     board_id: number;
//     pulse_id: number;
//     status: string;
//     timestamp: number;
// }
//
// export interface ItemStatusDuration {
//     [status: string]: number; // Key: status text, Value: duration in seconds
// }
// interface ItemCurrentState {
//     statusDurationAndDetails: ItemStatusDuration;
//     currentStatus?: string;
//     currentStatusStartTime?: number
//     lastTimestamp?: number
//     lastStatus?: string;
// }
//
// export interface ItemDetails {
//     [pulse_id: number]: ItemCurrentState;
// }
//
// export interface StatusDurationAndDetails {
//     status: string;
//     duration: number;
// }
//
//
// export interface ParsedLogs {
//     id: string;
//     statusDurationAndDetails: StatusDurationAndDetails[];
//     totalDuration: number;
//     currentStatus: string;
//     createdAt: string;
//     itemName: string;
//     groupTitle: string;
//     people: string[];
// }
//
// //////////////////////////
//
// export interface BoardApiResponse {
//     data: Data;
//     account_id: number;
// }
//
// interface Data {
//     boards: Board[];
// }
//
// interface Board {
//     columns: Column[];
//     items_page: ItemsPage;
//     items_count: number;
// }
//
// interface Column {
//     id: string;
//     settings_str: string; // JSON string, might need parsing to access inner properties
// }
//
// interface ItemsPage {
//     items: Item[];
// }
//
// interface Item {
//     id: string;
//     name: string;
//     created_at: string; // ISO 8601 format date string
//     group: Group;
//     column_values: ColumnValue[];
// }
//
// interface Group {
//     title: string;
// }
//
// interface ColumnValue {
//     id: string;
//     text: string;
//     type: string; // Could potentially be a union type if there are a limited number of known types e.g. "people" | "status"
// }
//
export interface StatusSettings {
    done_colors: number[];
    labels: { [key: string]: string };
    labels_positions_v2: { [key: string]: number };
    labels_colors: { [key: string]: { color: string; border: string; var_name: string } };
}


export interface Column {
    id: string;
}

export interface Group {
    title: string;
}

export interface ColumnValue {
    id: string;
    text: string
    type: string;
}

export interface Item {
    id: string;
    name: string;
    created_at: string;
    group: Group;
    column_values: ColumnValue[];
}

export interface Board {
    columns: Column[];
    items_count: number;
    items_page: {
        cursor: string | null;
        items: Item[];
    };
}

export interface ActivityLog {
    event: string;
    data: string;
    created_at: string;
}

export interface BoardActivity {
    activity_logs: ActivityLog[];
}

export interface BoardsResponse {
    data: {
        boards: Board[];
    };
    account_id: number;
}

export interface ActivityLogsResponse {
    data: {
        boards: BoardActivity[];
    };
    account_id: number;
}

export interface StatusDurations {
    [status: string]: number;  // Status as key, duration as value in string format like "8d 23h"
}

export interface Task {
    groupId: string;
    itemId: string;
    name: string;
    assignedTo: string;
    currentStatus: string;
    statusDurations: StatusDurations;
    totalDuration: string;
}

export interface DashboardData {
    tasks: Task[];
}