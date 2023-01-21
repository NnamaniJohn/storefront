import express from "express";
import verifyAuthToken from "../middlewares/auth";
import {OrderHandler} from "../handlers/order";

const orders: express.Router = express.Router();
const orderHandler = new OrderHandler

orders.get('/', orderHandler.index)

orders.get('/:id/show', orderHandler.show)

orders.post('/create', verifyAuthToken, orderHandler.create)

orders.put('/:id/update', verifyAuthToken, orderHandler.edit)

orders.delete('/:id/delete', verifyAuthToken, orderHandler.delete)

orders.post('/:id/products', verifyAuthToken, orderHandler.addProduct)

orders.get('/user/:id/show', verifyAuthToken, orderHandler.userOrder)

export default orders;