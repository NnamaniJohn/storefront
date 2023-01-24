import { Order, OrderStore } from '../order';
import {User, UserStore} from "../user";
import {Product, ProductStore} from "../product";

const store = new OrderStore()
let usr: User
let product: Product

describe("Order Model", () => {
    beforeAll(async (): Promise<void> => {
        const ustore = new UserStore()
        usr = await ustore.create({
            firstname: 'Paul',
            lastname: 'Sam',
            password: 'password'
        });

        const pstore = new ProductStore()
        product = await pstore.create({
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        });
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(store.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('create method should add a Order', async () => {
        const result = await store.create({
            status: 'active',
            user_id: usr.id as number
        });

        expect({
            id: result.id,
            status: result.status,
            user_id: result.user_id as number
        }).toEqual({
            id: 1,
            status: 'active',
            user_id: usr.id as number
        });
    });

    it('index method should return a list of Orders', async () => {
        const result = await store.index();
        expect([{
            id: result[0].id,
            status: result[0].status,
            user_id: result[0].user_id as number
        }]).toEqual([{
            id: 1,
            status: 'active',
            user_id: usr.id as number
        }]);
    });

    it('show method should return the correct Order', async () => {
        const result = await store.show(1);
        expect({
            id: result.id,
            status: result.status,
            user_id: result.user_id as number
        }).toEqual({
            id: 1,
            status: 'active',
            user_id: usr.id as number
        });
    });

    it('addProduct method should add a product to Order', async () => {
        const result = await store.addProduct(20, '1', String(product.id));
        expect(result).toEqual({
            id: 1,
            quantity: 20,
            order_id: '1',
            product_id: String(product.id)
        });
    });

    it('listProducts method should list products in Order', async () => {
        const result = await store.listProducts('1');
        expect(result).toEqual([{
            id: 1,
            quantity: 20,
            order_id: '1',
            product_id: String(product.id)
        }]);
    });

    it('removeProduct method should remove a product from Order', async () => {
        await store.removeProduct('1', String(product.id));
        const result = await store.listProducts('1');
        expect(result).toEqual([]);
    });

    it('userOrder method should return the correct user Order', async () => {
        const result = await store.userOrder(usr.id as number);
        expect({
            id: result.id,
            status: result.status,
            user_id: result.user_id as number
        }).toEqual({
            id: 1,
            status: 'active',
            user_id: usr.id as number
        });
    });

    it('update method should edit a Order', async () => {
        // const all = await store.index();
        const result = await store.update({
            id: 1,
            status: 'completed',
            user_id: usr.id as number
        });
        expect({
            id: result.id,
            status: result.status,
            user_id: result.user_id as number
        }).toEqual({
            id: 1,
            status: 'completed',
            user_id: usr.id as number
        });
    });

    it('delete method should remove the Order', async () => {
        store.delete(1);
        const result = await store.index()

        expect(result).toEqual([]);
    });

    afterAll(async (): Promise<void> => {
        const ustore = new UserStore()
        await  ustore.delete(usr.id as number);
        const pstrore = new ProductStore()
        await pstrore.delete(product.id as number)
    });
});