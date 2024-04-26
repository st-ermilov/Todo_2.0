import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {store} from './state/store';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {Login} from "./pages/Login/Login";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <Navigate to={'/404'}/>

    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/404",
        element: <ErrorPage/>
    },
]);

root.render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
