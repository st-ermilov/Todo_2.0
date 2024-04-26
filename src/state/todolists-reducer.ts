import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunkDispatch} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {handleServerNetworkError} from "../utils/error-utils";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
      {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
];
export const todolistsReducer =
    (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
        switch (action.type) {
            case "REMOVE-TODOLIST": {
                return state.filter((tl) => tl.id !== action.id);
            }
            case "ADD-TODOLIST": {
                return [
                    {
                        ...action.todolist, filter: "all", entityStatus: "idle"
                    },
                    ...state,
                ];
            }
            case "CHANGE-TODOLIST-TITLE": {
                return state.map(item => item.id === action.id ? {...item, title: action.title} : item);
            }
            case "CHANGE-TODOLIST-FILTER": {
                return state.map(item => item.id === action.id ? {...item, filter: action.filter} : item)
            }
            case "SET-TODOLISTS":
                return action.todoLists.map((todoList) => ({
                    ...todoList,
                    filter: "all",
                    entityStatus: 'idle'
                }));
            case 'CHANGE-TODOLIST-ENTITY-STATUS': {
                return state.map(item => item.id === action.id ? {...item, entityStatus: action.status} : item)
            }
            default:
                return state;
        }
    };

// actions
export const removeTodolistAC = (todolistId: string) => {
    return {type: "REMOVE-TODOLIST", id: todolistId} as const;
};
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: "ADD-TODOLIST", todolist: todolist} as const;
};
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title} as const;
};
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter} as const;
};
export const setTodolistsAC = (todoLists: Array<TodolistType>) => {
    return {type: "SET-TODOLISTS", todoLists: todoLists} as const;
};
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status}) as const

// thunks
export const fetchTodoListsThunk = () => {
    return (dispatch: AppThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then(({data}) => {
                dispatch(setTodolistsAC(data))
                dispatch(setAppStatusAC("succeeded"))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then(response => {
            const action = removeTodolistAC(todolistId)
            dispatch(action)
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        })
}
export const createTodolistTC = (title: string) => {
    return (dispatch: AppThunkDispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTodolist(title)
            .then(response => {
                const action = addTodolistAC(response.data.data.item)
                dispatch(action)
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}
export const updateTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}

// types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodolistsAC>;


type ActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
};