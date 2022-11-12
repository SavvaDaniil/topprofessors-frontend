import React from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../../store/UserContext";
//import LoginPage from "../../../views/Login/LoginPage";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const PrivateRouting = () => {
    const {user} = React.useContext(UserContext);
    //console.log(user);
    //console.log("user.isAuthed: " + user.isAuthed);

    return user.isAuthed ? <MainLayout /> : <Navigate to="/login" />
}

export default PrivateRouting;