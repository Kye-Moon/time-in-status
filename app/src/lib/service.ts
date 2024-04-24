import {ITableColumn} from "monday-ui-react-core/dist/types/components/Table/Table/Table";
import {
    ActivityLog,
    BoardApiResponse,
    ItemDetails,
    ParsedLogs,
    StatusChange,
    StatusDurationAndDetails, StatusSettings,
} from "../types/types";

const dayjs = require('dayjs');


// Function to parse a single log entry
function parseLogEntry(log: ActivityLog): StatusChange {
    const data = JSON.parse(log.data);
    return {
        board_id: data.board_id,
        pulse_id: data.pulse_id,
        status: data.value?.label.text ?? "NEW",
        timestamp: parseFloat(log.created_at.slice(0, 13))// Convert to seconds assuming the timestamp is in 100-nanoseconds
    };
}

// Main function to process all activity logs
export function processActivityLogs(logs: ActivityLog[]): ItemDetails {
    const items: ItemDetails = {};

    // Sort logs by timestamp using dayjs for comparison
    logs.sort((a, b) => parseLogEntry(a).timestamp - parseLogEntry(b).timestamp);
    logs.forEach(log => {
        const {pulse_id, status, timestamp} = parseLogEntry(log);

        // Initialize the item in the items map if it doesn't exist
        if (!items[pulse_id]) {
            items[pulse_id] = {statusDurationAndDetails: {}, currentStatusStartTime: timestamp, currentStatus: status};
        } else {
            // Check if the status has changed to update the start time and current status
            if (items[pulse_id].currentStatus !== status) {
                items[pulse_id].currentStatusStartTime = timestamp;
                items[pulse_id].currentStatus = status;
            }
        }

        const item = items[pulse_id];
        const previousDuration = dayjs(item.lastTimestamp) ? dayjs(timestamp).diff(item.lastTimestamp, 'minutes') : 0;

        // Update the duration for the last status
        if (item.lastStatus) {
            item.statusDurationAndDetails[item.lastStatus] = (item.statusDurationAndDetails[item.lastStatus] || 0) + previousDuration;
        }

        // Update for next iteration
        item.lastTimestamp = timestamp;
        item.lastStatus = status;
    });

    // Calculate duration in current status up to now for each item
    Object.values(items).forEach(item => {
        const now = dayjs();
        const currentDuration = now.diff(item.currentStatusStartTime, 'minutes');

        // Add the current duration to the total for the current status
        item.statusDurationAndDetails[item.currentStatus] = (item.statusDurationAndDetails[item.currentStatus] || 0) + currentDuration;
        if (item.currentStatus) {
            item.statusDurationAndDetails[item.currentStatus] = (item.statusDurationAndDetails[item.currentStatus] || 0) + currentDuration;
        }
        // Cleanup
        delete item.currentStatusStartTime;
        delete item.lastTimestamp;
        delete item.lastStatus;
    });

    return items;
}

// Example function to merge processed logs with additional details from items API
export function mergeProcessedLogsAndItems(processedLogs: ItemDetails, itemsApiResponse: BoardApiResponse, columnId: string): ParsedLogs[] {
    const mergedResults: ParsedLogs[] = [];
    // Iterate through each item in the items API response
    itemsApiResponse.data.boards.forEach(board => {
        board.items_page.items.forEach(item => {
            const pulseId = item.id;
            const createdAt = item.created_at;
            const processedItem = processedLogs[pulseId];
            // Retrieve the current status and people columns
            const currentStatusColumn = item.column_values.find(cv => cv.id === columnId);
            const peopleColumn = item.column_values.filter(cv => cv.type === "people").map(cv => cv.text);

            // Check if the item has processed logs
            if (processedItem) {
                const statusDurationsArray: StatusDurationAndDetails[] = processedItem ? Object.entries(processedItem.statusDurationAndDetails).map(([status, duration]) => {
                    return {
                        status,
                        duration: typeof duration === 'number' ? duration : 0, // or handle the case appropriately if not a number
                    };
                }) : [{
                    status: "NEW",
                    duration: dayjs().diff(dayjs(createdAt), 'minutes'),
                }];

                mergedResults.push({
                    id: pulseId,
                    statusDurationAndDetails: statusDurationsArray,
                    totalDuration: statusDurationsArray.reduce((acc, item) => acc + item.duration, 0),
                    currentStatus: currentStatusColumn ? currentStatusColumn.text : "",
                    createdAt: createdAt,
                    itemName: item.name,
                    groupTitle: item.group.title,
                    people: peopleColumn
                });
            } else {
                // For items without activity logs, still include them with default values
                mergedResults.push({
                    id: pulseId,
                    statusDurationAndDetails: [{
                        status: "NEW",
                        duration: dayjs().diff(createdAt, 'minutes'),
                    }],
                    totalDuration: dayjs().diff(createdAt, 'minutes'),
                    currentStatus: "NEW",
                    createdAt: createdAt,
                    itemName: item.name,
                    groupTitle: item.group.title,
                    people: peopleColumn
                });
            }
        });
    });

    return mergedResults;
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

export const getTimeInStatusColumns = (data: ParsedLogs[]): ITableColumn[] => {
    let columns: ITableColumn[] = [
        {
            id: 'group',
            title: 'Group',
            loadingStateType: 'medium-text',
        },
        {
            id: 'item_id',
            title: 'Item ID',
            loadingStateType: 'medium-text',
        },
        {
            id: 'item_name',
            title: 'Name',
            infoContent: 'itemName',
            width: {
                max: 350,
                min: 200,
            },
        },
        {
            id: 'assigned_to',
            title: 'Assigned To',
            loadingStateType: 'circle',
        },
        {
            id: 'status',
            title: 'Status',
            loadingStateType: 'medium-text',
            width: {
                max: 200,
                min: 120,
            },
        },
    ];

    // Identifying unique statuses across all items
    const uniqueStatuses = new Set(data.flatMap(item => item.statusDurationAndDetails.map(sd => sd.status)));
    // Dynamically adding columns for each unique status
    uniqueStatuses.forEach(status => {
        columns.push({
            id: status.toUpperCase(),
            title: status.toUpperCase(),
            infoContent: status,
            // Customize these as necessary
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
    });

    return columns;
}


export function extractTISTableData(data: ParsedLogs[], columns: ITableColumn[]) {
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
                    const statusDuration = item.statusDurationAndDetails.find(sd => sd.status.toUpperCase() === column.title.toUpperCase());
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
    } else if (durationInMinutes < minutesInHour * hoursInDay * daysInWeek) {
        const days = Math.floor(durationInMinutes / (minutesInHour * hoursInDay));
        const hours = Math.floor((durationInMinutes % (minutesInHour * hoursInDay)) / minutesInHour);
        return `${days}d ${hours}h`;
    } else if (durationInMinutes < minutesInHour * hoursInDay * daysInWeek * weeksInMonth) {
        const weeks = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek));
        const days = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek)) / (minutesInHour * hoursInDay));
        return `${weeks}w ${days}d`;
    } else if (durationInMinutes < minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear) {
        const months = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth));
        const weeks = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek * weeksInMonth)) / (minutesInHour * hoursInDay * daysInWeek));
        return `${months}mo ${weeks}w`;
    } else {
        const years = Math.floor(durationInMinutes / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear));
        const months = Math.floor((durationInMinutes % (minutesInHour * hoursInDay * daysInWeek * weeksInMonth * monthsInYear)) / (minutesInHour * hoursInDay * daysInWeek * weeksInMonth));
        return `${years}y ${months}mo`;
    }
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