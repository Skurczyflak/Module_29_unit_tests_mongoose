const Employee = require('../employees.model.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {

    it('should throw an error if no "firstName" or "lastName" or "department" arg', async () => {
        const emp = new Employee({}); // create new Employee, but don't set `firstName` attr value

      emp.validateSync(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    })

    it('should throw an error if "firstName" or "lastName" or "department" is not a string', () => {

      const cases = [{}, []];
      for(let name of cases) {
        const emp = new Employee({ firstName: name, lastName: name, department: name });

        emp.validateSync(err => {
          expect(err.errors.firstName).to.exist;
          expect(err.errors.lastName).to.exist;
          expect(err.errors.department).to.exist;
        });

      }
    })

});

after(() => {
  mongoose.models = {};
});