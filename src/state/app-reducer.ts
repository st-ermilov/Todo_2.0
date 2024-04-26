import {Dispatch} from "redux";
import {authAPI} from "../api/auth-api";
import {handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "./auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as AppErrorType,
    isInitialize: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case 'APP/SET-INITIALIZE': {
            return {...state, isInitialize: action.isInitialize}
        }
        default:
            return state
    }
}

export function setAppStatusAC(status: RequestStatusType): ActionsType {
    return {type: 'APP/SET-STATUS', status: status}
}

export function setAppErrorAC(error: null | string): ActionsType {
    return {type: 'APP/SET-ERROR', error: error}
}

export function setIsInitializeAC(value: boolean): ActionsType {
    return {type: 'APP/SET-INITIALIZE', isInitialize: value}
}


export function isInitializeTC() {
    return (dispatch: Dispatch) => authAPI.me()
        .then(response => {
            if(response.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else {}
            dispatch(setIsInitializeAC(true))
        })
}

type ActionsType = SetAppStatusActionType | SetAppErrorActionType | SetIsInitializeActionType
export type SetAppStatusActionType = {
    type: 'APP/SET-STATUS'
    status: RequestStatusType
}
export type SetAppErrorActionType = {
    type: 'APP/SET-ERROR'
    error: null | string
}
export type SetIsInitializeActionType = {
    type: 'APP/SET-INITIALIZE',
    isInitialize: boolean
}


