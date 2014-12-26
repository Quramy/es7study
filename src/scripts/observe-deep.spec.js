'use strict';

let assert = chai.assert;

describe('watchfy()', () => {
  it('add to model method to regist a listener', () => {
    assert.equal(typeof watchfy({}).addUpdateListener, 'function');
  });
});

describe('watchfy#addUpdateListener', () => {

  it('model.someProp が変更されたらListenerが発火する', done => {
    let model = watchfy({
      someProp: ''
    }).addUpdateListener('someProp', val => {
      assert.equal(val, 'new value');
      done();
    });
    model.someProp = 'new value';
  });

  it('modelにsomePropを追加したらListenerが発火する', done => {
    let model = watchfy({}).addUpdateListener('someProp', val => {
      assert.equal(val, 'new value');
      done();
    });
    model.someProp = 'new value';
  });
  
  it('nestしたmodelのパラメータが変更されたらListenerが発火する', done => {
    let model = watchfy({
      child: {
        prop: ''
      }
    }).addUpdateListener('child.prop', val => {
      assert.equal(val, 'new value');
      done();
    });
    model.child.prop = 'new value';
  });

});
