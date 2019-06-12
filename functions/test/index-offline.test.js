const admin = require('firebase-admin');
const chai = require('chai');
//const test = require('firebase-functions-test');
const sinon = require('sinon');
const assert = chai.assert;
describe('Cloud Functions', () => {
  let myFunctions, adminInitStub;
  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    myFunctions = require('../index');
  });

  after(() => {
    adminInitStub.restore();
  });
  describe('addMessage', () => {
  let oldDatabase;
    before(() => {
      oldDatabase = admin.firestore;
    });

    after(() => {
      admin.firestore = oldDatabase;
    });
    it('should return a writeTime', (done) => {
        const writeTime = '3235235';
        const setParam = { name: 'john' };
        const firestoreStub = sinon.stub();
        const setStub = sinon.stub();
        Object.defineProperty(admin, 'firestore', { get: () => firestoreStub });
        firestoreStub.returns({
          collection: (path) => ({ 
            doc: () => ({
              set: setStub}),
            })
          })
        setStub.withArgs(setParam).returns(Promise.resolve({ writeTime }));

        const req = { query: {text: 'john'} };
        const res = {
            send: (object) => {
              assert.equal(object, writeTime);
              done();
            }
        };
        myFunctions.addMessage(req, res);
    });    
});
});