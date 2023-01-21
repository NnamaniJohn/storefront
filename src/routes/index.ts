import express from "express";
import users from "./users";
import products from "./products";
import orders from "./orders";

const routes: express.Router = express.Router();

routes.use('/users', users);

routes.use('/products', products);

routes.use('/orders', orders);

export default routes;