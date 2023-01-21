import express from "express";
import verifyAuthToken from "../middlewares/auth";
import {UserHandler} from "../handlers/user";


const users: express.Router = express.Router();
const userHandler = new UserHandler

users.get('/', verifyAuthToken, userHandler.index)

users.get('/:id/show', verifyAuthToken, userHandler.show)

users.post('/create', verifyAuthToken, userHandler.create)

users.put('/:id/update', verifyAuthToken, userHandler.edit)

users.delete('/:id/delete', verifyAuthToken, userHandler.delete)

users.post('/sign_in', userHandler.signIn)

export default users;