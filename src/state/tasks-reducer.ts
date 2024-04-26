import {
    AddTodolistActionType, ClearTodosDataActionType,
    RemoveTodolistActionType, SetTodoListsActionType,
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunkDispatch} from "./store";
import {
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    SetIsInitializeActionType
} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: TasksStateType = {};


export const tasksReducer = (
    state: TasksStateType = initialState,
    action: ActionsType
): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {...state, [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId)}
        }
        case "ADD-TASK": {
            const currentTasks = state[action.task.todolistId] || []; // Инициализируем как пустой массив, если не существует
            return {...state, [action.task.todolistId]: [action.task, ...currentTasks]};
            // return {...state, [action.task.todolistId]: [action.task, ...state[action.task.todolistId]]}
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: [],
            };
        }
        case "REMOVE-TODOLIST": {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copy = {...state}
            action.todoLists.forEach(item => {
                copy[item.id] = []
            })
            return copy
        }
        case "CLEAR-DATA":
            return {}
        default:
            return state;
    }
};

// actions
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: "REMOVE-TASK", taskId: taskId, todolistId: todolistId} as const;
};
export const addTaskAC = (task: TaskType) => {
    return ({type: "ADD-TASK", task}) as const;
};
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    model,
    todolistId,
    taskId
} as const)

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {type: 'SET-TASKS', todolistId: todolistId, tasks: tasks} as const
}

// thunks
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: AppThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTasks(todolistId)
            .then(response => {
                const tasks = response.data.items
                dispatch(setTasksAC(todolistId, tasks))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC(task)
                dispatch(action)
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: AppThunkDispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(response => {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }


// types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsActionType
    | ReturnType<typeof setTasksAC>
    | SetIsInitializeActionType
    | ClearTodosDataActionType

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

