import { User, UserStore } from '../user';

const store = new UserStore()

describe("User Model", () => {

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

    it('create method should add a user', async () => {
        const result = await store.create({
            firstname: 'Paul',
            lastname: 'Sam',
            password: 'password'
        });
        expect({
            firstname: result.firstname,
            lastname: result.lastname,
        }).toEqual({
            firstname: 'Paul',
            lastname: 'Sam',
        });
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect([{
            firstname: result[0].firstname,
            lastname: result[0].lastname,
        }]).toEqual([{
            firstname: 'Paul',
            lastname: 'Sam',
        }]);
    });

    it('show method should return the correct user', async () => {
        const all = await store.index();
        const result = await store.show(all[0].id as number);
        expect({
            firstname: result.firstname,
            lastname: result.lastname,
        }).toEqual({
            firstname: 'Paul',
            lastname: 'Sam',
        });
    });

    it('authenticate method should return null', async () => {
        const result = await store.authenticate({
            firstname: 'Paul',
            lastname: 'Sam',
            password: 'password'
        });
        expect({
            firstname: result ? result.firstname : null,
            lastname: result ? result.lastname : null,
        }).toEqual({
            firstname: 'Paul',
            lastname: 'Sam',
        });
    });

    it('update method should edit a user', async () => {
        const all = await store.index();
        const result = await store.update({
            id: all[0].id as number,
            firstname: 'Paul',
            lastname: 'Gold',
            password: 'password'
        });
        expect({
            firstname: result.firstname,
            lastname: result.lastname,
        }).toEqual({
            firstname: 'Paul',
            lastname: 'Gold',
        });
    });

    it('delete method should remove the user', async () => {
        const all = await store.index();
        await store.delete(all[0].id as number);
        const result = await store.index()

        expect(result).toEqual([]);
    });
});