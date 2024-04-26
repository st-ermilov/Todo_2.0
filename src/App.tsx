import React from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import TodolistsList from "./pages/TodolistsList/TodolistsList";
import {CircularProgress, LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {isInitializeTC, RequestStatusType} from "./state/app-reducer";
import {ErrorSnackBar} from "./components/ErrorSnackBar";
import {Login} from "./pages/Login/Login";
import {logoutTC} from "./state/auth-reducer";

function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialize = useSelector<AppRootStateType, boolean>(state => state.app.isInitialize)
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    function logoutHandler() {
        console.log(1)
        dispatch(logoutTC())
    }

    React.useEffect(() => {
        dispatch(isInitializeTC())
    }, [])

    if (!isInitialize) {
        return <div style={{
            height: '100vh', width: '100vw',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <CircularProgress/>
        </div>
    }

    console.log(status)
    return (
        <div className="App">
            <ErrorSnackBar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit" onClick={logoutHandler}>{isLoggedIn ? 'Logout' : 'Login'}</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                {isLoggedIn ? <TodolistsList/> : <Login/>}
            </Container>
        </div>
    );
}

export default App;
