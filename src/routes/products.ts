import express from "express"
import verifyAuthToken from "../middlewares/auth";
import {ProductHandler} from "../handlers/product";

const products: express.Router = express.Router();
const productHandler = new ProductHandler

products.get('/', productHandler.index)

products.get('/:id/show', productHandler.show)

products.post('/create', verifyAuthToken, productHandler.create)

products.put('/:id/update', verifyAuthToken, productHandler.edit)

products.delete('/:id/delete', verifyAuthToken, productHandler.delete)

export default products;