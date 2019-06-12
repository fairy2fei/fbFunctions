const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const admin = require('firebase-admin');
const test = require('firebase-functions-test')();

describe('Cloud Functions', () => {
  let myFunctions, adminInitStub;
  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    myFunctions = require('../index');
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  describe('makeUpperCase', () => {
    it('should upper case john and write it to /uppercase', () => {
      const childParam = 'uppercase';
      const setParam = 'JOHN';
      const childStub = sinon.stub();
      const setStub = sinon.stub();
      const snap = {
        val: () => 'john',
        ref: {
          parent: {
            child: childStub,
          }
        }
      };
      childStub.withArgs(childParam).returns({ set: setStub });
      setStub.withArgs(setParam).returns(true);

      const wrapped = test.wrap(myFunctions.makeUppercase);

      return assert.equal(wrapped(snap), true);
    })
  });

  describe('addMessage', () => {
    let oldDatabase;
    before(() => {
      oldDatabase = admin.database;
    });

    after(() => {
      admin.database = oldDatabase;
    });

    it('should return a 303 redirect', (done) => {
      const refParam = '/doc';
      const pushParam = { name: 'john' };
      const databaseStub = sinon.stub();
      const refStub = sinon.stub();
      const pushStub = sinon.stub();

      Object.defineProperty(admin, 'database', { get: () => databaseStub });
      databaseStub.returns({ ref: refStub });
      refStub.withArgs(refParam).returns({ push: pushStub });
      pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: 'redirectRef' }));

      const req = { query: {text: 'john'} };
      const res = {
        redirect: (code, url) => {
          assert.equal(code, 303);
          assert.equal(url, 'redirectRef');
          done();
        }
      };

      myFunctions.addMessage(req, res);
    });
  });
})