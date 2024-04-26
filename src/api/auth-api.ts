import axios, {AxiosResponse} from 'axios'
import {TodolistType} from "./todolists-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'a805cb90-1ec3-43aa-b08b-e6c92ac3fb7b',
    }
})

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export const authAPI = {
    login(authInfo: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('auth/login', authInfo);
    },
    logout(){
        return instance.delete<ResponseType<{ userId?: number }>>('auth/login');
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me')
    }
}