import React, {useCallback} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {
    changeTodolistFilterAC, createTodolistTC, fetchTodoListsThunk,
    FilterValuesType, removeTodolistTC,
    setTodolistsAC,
    TodolistDomainType, updateTodolistTitleTC
} from "../../state/todolists-reducer";
import {
    addTaskTC,
    removeTaskTC,
    TasksStateType,
    updateTaskTC,
} from "../../state/tasks-reducer";
import {TaskStatuses, todolistsAPI} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "../../components/Todolist";
import {Navigate} from "react-router-dom";

function TodolistsList() {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch();


    React.useEffect(() => {
        const thunk = fetchTodoListsThunk()
        dispatch(thunk)
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskTC(id, todolistId);
        dispatch(thunk)
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = addTaskTC(title, todolistId)
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTaskTC(id, {status}, todolistId);
        dispatch(thunk);
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = updateTaskTC(id,{title: newTitle},todolistId,);
        dispatch(thunk);
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id);
        dispatch(thunk);
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = updateTodolistTitleTC(id, title);
        dispatch(thunk);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const thunk = createTodolistTC(title);
        dispatch(thunk);
    }, []);

    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (<>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}

export default TodolistsList;
