import {ITableColumn} from "monday-ui-react-core/dist/types/components/Table/Table/Table";
import {ActivityLog, StatusDurations, StatusSettings,} from "../types/types";

const dayjs = require('dayjs');


export interface StatusChange {
    newStatus: string;
    oldStatus: string | null;
    timestamp: number;  // Stored as a string to handle large numbers or specific formats
}

export interface ParsedActivityLogEntry {
    pulseId: number;
    pulseName: string;
    statusChanges: StatusChange[];
}

// Function to parse activity logs
export function parseActivityLogs(rawLogData: ActivityLog[], columnId: string): ParsedActivityLogEntry[] {
    const mergedLogs: Map<number, ParsedActivityLogEntry> = new Map();
    rawLogData.forEach(log => {
        if (log.event !== "update_column_value") return;
        const logData = JSON.parse(log.data);
        if (logData.column_id === columnId) {
            const pulseId = logData.pulse_id;
            const entry = mergedLogs.get(pulseId) || {
                pulseId: pulseId,
                pulseName: logData.pulse_name,
                statusChanges: []
            } as ParsedActivityLogEntry;
            entry.statusChanges.push({
                newStatus: logData.value.label.text,
                oldStatus: logData.previous_value ? logData.previous_value.label.text : null,
                timestamp: parseFloat(log.created_at.slice(0, 13))
            });

            mergedLogs.set(pulseId, entry);
        }
    });

    // Convert the map to an array and sort the changes for each entry
    const result = Array.from(mergedLogs.values());
    result.forEach(entry => {
        entry.statusChanges.sort((a, b) => a.timestamp - b.timestamp);
    });
    return result;
}

// Example function to merge processed logs with additional details from items API
export interface ProcessedItem {
    id: string;
    statusDurations: { status: string, duration: number }[];
    totalDuration: number;
    currentStatus: string;
    itemName: string;
    groupTitle: string;
    people: string[];
}

export function mergeProcessedLogsAndItems(processedLogs: ParsedActivityLogEntry[], itemsApiResponse: any, columnId: string) {
    const mergedResults: ProcessedItem[] = [];

    const processedItemsSet = new Set(processedLogs.map(pi => String(pi.pulseId)));

    // Iterate through each item in the items API response
    itemsApiResponse.data.boards.forEach(board => {
        board.items_page.items.forEach(item => {
            const pulseId = item.id;
            const createdAt = item.created_at;
            const currentStatusColumn = item.column_values.find(cv => cv.id === columnId);
            const peopleColumn = item.column_values.filter(cv => cv.type === "people").map(cv => cv.text);
            const columnSettings = parseColumnSettings(board.columns, columnId);
            const defaultStatus = getDefaultStatus(columnSettings);
            const hasProcessedLogs = processedItemsSet.has(pulseId);


            // Calculate status durations
            const statusDurations = hasProcessedLogs
                ? calculateStatusDurations(processedLogs.find(pi => String(pi.pulseId) === pulseId)!.statusChanges, currentStatusColumn.text, defaultStatus, createdAt)
                : { [currentStatusColumn.text]: dayjs().diff(createdAt, 'minutes') };

            mergedResults.push({
                id: pulseId,
                statusDurations: Object.entries(statusDurations).map(([status, duration]) => ({ status, duration })),
                totalDuration: Object.values(statusDurations).reduce((acc, duration) => acc + duration, 0),
                currentStatus: currentStatusColumn.text,
                itemName: item.name,
                groupTitle: item.group.title,
                people: peopleColumn
            });
        });
    });
    return mergedResults;
}

function calculateStatusDurations(statusChanges: StatusChange[], currentStatus: string, defaultStatus: string, itemCreatedAt: string): StatusDurations {
    const statusDurations: StatusDurations = {};
    // Initialize the status durations with the default status and the time of the first status change or now if there are no status changes
    const timeOfFirstStatusChange = statusChanges.length > 0 ? statusChanges[0].timestamp : dayjs().toISOString();
    statusDurations[defaultStatus] = dayjs(timeOfFirstStatusChange).diff(dayjs(itemCreatedAt), 'minutes');

    // Iterate through each status change
    statusChanges.forEach((change, index) => {
        const newStatus = change.newStatus;
        const oldStatus = change.oldStatus || defaultStatus;
        const duration = dayjs(change.timestamp).diff(dayjs(statusChanges[index - 1]?.timestamp || itemCreatedAt), 'minutes');
        // If the status is the current status, update the duration
        if (newStatus === currentStatus) {
            statusDurations[oldStatus] = statusDurations[oldStatus] || 0;
            statusDurations[oldStatus] += duration;

            statusDurations[newStatus] = dayjs().diff(dayjs(change.timestamp), 'minutes');
        } else {
            statusDurations[newStatus] = statusDurations[newStatus] || 0;
            statusDurations[newStatus] += duration;
        }
    });

    return statusDurations;

}

function getDefaultStatus(settings: StatusSettings): string {
    for (const key in settings.labels_colors) {
        if (settings.labels_colors[key].var_name === 'grey') {
            return settings.labels[key] || " ";
        }
    }
    return " ";
}

export function lookupLabelColor(settings: StatusSettings, label: string): string {
    const labelKey = Object.keys(settings.labels).find(key => settings.labels[key] === label);
    if (!labelKey) return "#c4c4c4" // Label not found
    // Return the color associated with the label
    return settings.labels_colors[labelKey]?.color || "#c4c4c4";
}

export function parseColumnSettings(columns, columnId) {
    const column = columns.find(col => col.id === columnId);
    if (!column || !column.settings_str) return null;
    try {
        return JSON.parse(column.settings_str);
    } catch (error) {
        console.error('Error parsing column settings:', error);
        return null;
    }
}

export interface ColumnWidths {
    group?: { min: number; max: number };
    item_id?: { min: number; max: number };
    item_name?: { min: number; max: number };
    assigned_to?: { min: number; max: number };
    status?: { min: number; max: number };
    total?: { min: number; max: number };
}

export const getTimeInStatusColumns = (data: ProcessedItem[], customWidths: ColumnWidths): ITableColumn[] => {
    let columns: ITableColumn[] = [
        {
            id: 'group',
            title: 'Group',
            loadingStateType: 'medium-text',
            width: customWidths.group || {min: 200, max: 300},
        },
        {
            id: 'item_id',
            title: 'Item ID',
            loadingStateType: 'medium-text',
            width: customWidths.item_id || {min: 200, max: 250},
        },
        {
            id: 'item_name',
            title: 'Name',
            infoContent: 'itemName',
            width: customWidths.item_name || {min: 250, max: 350}
        },
        {
            id: 'assigned_to',
            title: 'Assigned To',
            loadingStateType: 'circle',
            width: customWidths.assigned_to || {min: 120, max: 200}
        },
        {
            id: 'status',
            title: 'Status',
            loadingStateType: 'medium-text',
            width: customWidths.status || {min: 150, max: 250}
        },
    ];

    // Identifying unique statuses across all items
    const uniqueStatuses = new Set(data.flatMap(item => item.statusDurations.map(sd => sd.status)));
    // Dynamically adding columns for each unique status
    uniqueStatuses.forEach(status => {
        columns.push({
            id: status.toUpperCase(),
            title: status.toUpperCase(),
            infoContent: status,
            width: {
                max: 250,
                min: 120,
            },
            loadingStateType: 'medium-text',
        });
    });

    columns.push({
        id: 'total',
        title: 'TOTAL',
        loadingStateType: 'medium-text',
        width: customWidths.total || {min: 100, max: 200}
    });

    return columns;
}


export function extractTISTableData(data: ProcessedItem[], columns: ITableColumn[]) {
    return data.map(item => {
        // Transform item data to match columns for easy rendering
        return columns.reduce((acc, column) => {
            // For each column, decide what data from item should be displayed
            switch (column.id) {
                case 'group':
                    acc[column.id] = item.groupTitle;
                    break;
                case 'item_id':
                    acc[column.id] = item.id;
                    break;
                case 'item_name':
                    acc[column.id] = item.itemName;
                    break;
                case 'assigned_to':
                    acc[column.id] = item.people.join(', '); // Assuming people is an array of names
                    break;
                case 'status':
                    acc[column.id] = item.currentStatus;
                    break;
                case 'total':
                    acc[column.id] = formatDuration(item.totalDuration);
                    break;
                default:
                    // Handle dynamic status columns
                    const statusDuration = item.statusDurations.find(sd => sd.status.toUpperCase() === column.title.toUpperCase());
                    acc[column.id] = statusDuration ? formatDuration(statusDuration.duration) : '0m';
                    break;
            }
            return acc;
        }, {});
    });
}

function formatDuration(durationInMinutes: number) {
    const minutesInHour = 60;
    const hoursInDay = 24;
    const daysInWeek = 7;
    const weeksInMonth = 4; // Approximation
    const monthsInYear = 12;

    if (durationInMinutes < minutesInHour) {
        return `${durationInMinutes}m`;
    } else if (durationInMinutes < minutesInHour * hoursInDay) {
        const hours = Math.floor(durationInMinutes / minutesInHour);
        const minutes = durationInMinutes % minutesInHour;
        return `${hours}h ${minutes}m`;
    } else {
        const days = Math.floor(durationInMinutes / (minutesInHour * hoursInDay));
        const hours = Math.floor((durationInMinutes % (minutesInHour * hoursInDay)) / minutesInHour);
        return `${days}d ${hours}h`;
    }
    // } else if (durationInMinutes < minutesInHour * hoursInDay * daysInWeek * weeksInMonth) {
    //     const weeks = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek));
    //     const days = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek)) / (minutesInHour * hoursInDay));
    //     return `${weeks}w ${days}d`;
    // } else if (durationInMinutes < minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear) {
    //     const months = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth));
    //     const weeks = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek * weeksInMonth)) / (minutesInHour * hoursInDay * daysInWeek));
    //     return `${months}mo ${weeks}w`;
    // } else {
    //     const years = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear));
    //     const months = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear)) / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth));
    //     return `${years}y ${months}mo`;
    // }
}

export function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `${r}, ${g}, ${b}`;
}