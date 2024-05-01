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

export const getBoardItems = ({boardId, cursor}: {
    boardId: string,
    cursor?: string
}) => {
    const cursorQueryPart = cursor ? `, cursor: "${cursor}"` : "";

    return `
        query{
          boards(ids:["${boardId}"]){
            columns(types:[status]){
                 id
                 settings_str
            }
            items_count
            items_page(limit:${ITEMS_PER_PAGE} ${cursorQueryPart}){
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