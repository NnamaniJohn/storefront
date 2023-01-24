import { Product, ProductStore } from '../product';

const store = new ProductStore()

describe("Product Model", () => {
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

    it('create method should add a product', async () => {
        const result = await store.create({
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        });
        expect({
            name: result.name,
            price: result.price,
            category: result.category
        }).toEqual({
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        });
    });

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect([{
            name: result[0].name,
            price: result[0].price,
            category: result[0].category
        }]).toEqual([{
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        }]);
    });

    it('show method should return the correct product', async () => {
        const all = await store.index();
        const result = await store.show(all[0].id as number);
        expect({
            name: result.name,
            price: result.price,
            category: result.category
        }).toEqual({
            name: 'Apple',
            price: 200,
            category: 'Fruits'
        });
    });

    it('update method should edit a product', async () => {
        const all = await store.index();
        const result = await store.update({
            id: all[0].id as number,
            name: 'Orange',
            price: 200,
            category: 'Fruits'
        });
        expect({
            name: result.name,
            price: result.price,
            category: result.category
        }).toEqual({
            name: 'Orange',
            price: 200,
            category: 'Fruits'
        });
    });

    it('delete method should remove the product', async () => {
        const all = await store.index();
        await store.delete(all[0].id as number);
        const result = await store.index()

        expect(result).toEqual([]);
    });
});