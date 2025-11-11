const Employee = require('../employees.model');
const Department = require('../department.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('CRUD operations for Employee', () => {

    before(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
        } catch(err) {
            console.error(err);
        }
    });

    describe('Reading data', () => {

        before(async () =>{

            const testDepOne = new Department({ name: 'Menegment' });
            await testDepOne.save();

            const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: testDepOne._id });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: testDepOne._id });
            await testEmpTwo.save();
        })

        it('should return all the data with find method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
        });

        it('should return proper document by various params with findOne method.', async () => {
            const employee = await Employee.findOne({ firstName: 'John' });
            const expectedFirstName = 'John';
            expect(employee.firstName).to.be.equal(expectedFirstName);
        });

        it('should return all the data with "find" method and "populate "department"', async () => {
            const employees = await Employee.find().populate('department');
            expect(employees[0].department).to.be.instanceOf(Department);
        })


        after(async () => {
            await Employee.deleteMany();
            await Department.deleteMany();
        });

    });

    describe('Creating data', () => {
        it('should insert new document with insertOne method.', async () => {

            const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Menegment' });
            await employee.save();
            const savedEmployee = await Employee.findOne({ firstName: 'John' });
            expect(savedEmployee).to.not.be.null;

        });

        after(async () => {
            await Employee.deleteMany();
        });

    });

    describe('Updating data', () => {

        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Menegment' });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'Menegment' });
            await testEmpTwo.save();
        });

        it('should properly update one document with updateOne method.', async () => {
            await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: 'Johny' }});
            const employee = await Employee.findOne({ firstName: 'Johny' });
            expect(employee).to.not.be.null;
        });

        it('should properly update one document with save method.', async () => {

            const employee = await Employee.findOne({ firstName: 'John' });
            employee.firstName = 'Johny';
            await employee.save();
            const updatedEmployee = await Employee.findOne({ firstName: 'Johny' });
            expect(updatedEmployee).to.not.be.null;

        });

        it('should properly update multiple documents with updateMany method.', async () => {
            await Employee.updateMany({}, { $set: { firstName: 'Johny' }});
            const employees = await Employee.find({ firstName: 'Johny' });
            expect(employees.length).to.be.equal(2);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });

    });

    describe('Removing data', () => {

        before(async () =>{
            const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Menegment' });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'Menegment' });
            await testEmpTwo.save();
        })

        it('should properly remove one document with deleteOne method.', async () => {
            await Employee.deleteOne({ firstName: 'John' });
            const employee = await Employee.findOne({ firstName: 'John' });
            expect(employee).to.be.null;
        });

        it('should properly remove multiple documents with deleteMany method.', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });

        after(async () => {
            await Employee.deleteMany();
        });

    });

    after(() => {
        mongoose.models = {};
    });
});