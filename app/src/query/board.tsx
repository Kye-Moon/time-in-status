import {ITEMS_PER_PAGE} from "../context/TISBoardViewProvider";

export const createTrackingBoardMutation = (key: string) => {
    return `
        mutation{
            create_board(
              board_name:${`tracking-${key}`} 
              board_kind:private
            ){
              id
            }
        }
    `;
}

export const getBoardActivityLogs = ({boardId, columnId, itemIds}: {
    boardId: string,
    columnId: string,
    itemIds: string[]
}) => {
    return `
        query{
          boards(limit:1,ids:["${boardId}"]){
            activity_logs(column_ids:["${columnId}"], item_ids:[${itemIds}],limit:10000){
              event
              data
              created_at
            }
          }
        }
    `;
}


export interface GetBoardItemsResponse {
    data: {
        boards: {
            columns: {
                id: string;
                settings_str: string;
            }[],
            items_count: number;
            items_page: {
                cursor: string
                items: {
                    id: string;
                    name: string;
                    created_at: string;
                    group: {
                        title: string;
                    };
                    column_values: {
                        id: string;
                        text: string;
                        type: string;
                    }[]
                }[]
            }
        }[]
    }
}

export const getBoardItems = ({boardId, cursor, query_params}: {
    boardId: string,
    cursor?: string
    query_params?: any
}) => {
    const cursorQueryPart = cursor ? `, cursor: "${cursor}"` : "";
    // Helper function to convert the params into GraphQL format
    const formatQueryParams = (params) => {
        if (!params || params.length === 0) return '';

        return params.map(({column_id, compare_value, operator}) => {
            // Convert the compare_value array to a string that GraphQL understands
            const formattedValues = compare_value.map(value => `${value}`).join(', ');
            return `{ column_id: "${column_id}", compare_value: [${formattedValues}], operator: ${operator} }`;
        }).join(', ');
    };

    // Format the query parameters
    const formattedQueryParams = query_params ? `query_params: { rules: [${formatQueryParams(query_params)}], operator: and }` : '';

    return `
        query{
          boards(ids:["${boardId}"]){
            columns(types:[status]){
                 id
                 settings_str
            }
            items_count
                items_page(limit: ${ITEMS_PER_PAGE} ${cursorQueryPart}, ${formattedQueryParams}) {
                      cursor
                      items{
                        id
                        name
                        created_at
                        group{
                          title
                        }
                        column_values(types:[people,status]){
                          id
                          text
                          type
                        }
                      }
                    }
                }
        }
    `;
}

export interface GetBoardItemsByGroupResponse {
    data: {
        boards: {
            columns: {
                id: string;
                settings_str: string;
            }[],
            items_count: number;
            groups: {
                items_page: {
                    cursor: string
                    items: {
                        id: string;
                        name: string;
                        created_at: string;
                        group: {
                            title: string;
                        };
                        column_values: {
                            id: string;
                            text: string;
                            type: string;
                        }[]
                    }[]
                }
            }[]
        }[]
    }
}
export const getBoardItemsByGroup = ({boardId, cursor, query_params, groupId}: {
    boardId: string,
    cursor?: string
    query_params?: any
    groupId: string
}) => {
    const cursorQueryPart = cursor ? `, cursor: "${cursor}"` : "";
    const formatQueryParams = (params) => {
        if (!params || params.length === 0) return '';

        return params.map(({column_id, compare_value, operator}) => {
            // Convert the compare_value array to a string that GraphQL understands
            const formattedValues = compare_value.map(value => `${value}`).join(', ');
            return `{ column_id: "${column_id}", compare_value: [${formattedValues}], operator: ${operator} }`;
        }).join(', ');
    };
    // Format the query parameters
    const formattedQueryParams = query_params ? `query_params: { rules: [${formatQueryParams(query_params)}], operator: or }` : '';
    return `
        query {
          boards(ids:["${boardId}"]){
            columns(types:[status]){
                 id
                 settings_str
            }
            items_count
            groups(ids:["${groupId}"]){
                items_page(limit: ${ITEMS_PER_PAGE} ${cursorQueryPart}, ${formattedQueryParams}) {
                      cursor
                      items{
                        id
                        name
                        created_at
                        group{
                          title
                        }
                        column_values(types:[people,status]){
                          id
                          text
                          type
                        }
                      }
                    }
                }
            }
        }
    `;
}


export type FilterOptionsResponse = {
    data: {
        boards: Board[];
        users: User[];
    };
    account_id: number;
};

type Board = {
    columns: Column[];
    groups: Group[];
};

type Column = {
    settings_str: string;
};

type Group = {
    title: string;
    id: string;
};

type User = {
    name: string;
    id: string;
};

export const getFilterOptions = ({boardId, columnId}: { boardId: string, columnId: string }) => {
    return `
        query{
             boards(ids:["${boardId}"]){
                columns(ids:["${columnId}"]){
                  settings_str
                }
                 groups {
                   id
                   title
                 }
             }
             users(kind:all){
               name
               id
             }
        }
    `;
}


export interface GetBoardStatusColumnsResponse {
    data: {
        boards: {
            columns: {
                id: string;
                title: string;
            }[]
        }[]
    }
}

export const getBoardStatusColumns = ({boardId}: { boardId: string }) => {
    return `
        query{
          boards(ids:["${boardId}"]){
            columns(types:[status]){
                 id
                 title
            }
          }
        }
    `;
}