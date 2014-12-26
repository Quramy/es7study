'use strict';

var model = {
  name: 'Quramy',
  age: 30,
  favorites: [],
  option: {}
};

let sample01 = x => {
  Object.observe(model, changes => {
    changes.forEach(change => {
      var hoge;
      switch(change.type) {
        case 'update':
          hoge = model[change.name];
          console.log(change.type, change.name, hoge, change.oldValue, change);
        break;
        default:
          console.log(change);
      }
    });
  });
};

sample01();

model.age = 31;

model.sex = 'male';

delete model.sex;

model.favorites.push('JavaScript');

model.option.job = 'Developer';

Object.observe(model.favorites, changes => {
  changes.forEach(change => {
    console.log(change);
  });
});
/*
console.log('push');
model.favorites.push('Ecma Script');
console.log('push');
model.favorites.push('ActionScript');

console.log('splice');
model.favorites.splice(0, 1);

*/
setTimeout(()=>{console.log('***** sample2 *****')}, 0);

var sample02 = {
  someString: '',
  childObj01: {
    hoge: 'foo',
    ccObj: {
      bar: 'bar'
    }
  },
  childCollection: []
};

let watchfy = model => {

  let listeners = {};

  model.addUpdateListener = (prop, listener) => {
    if(!listeners[prop]){
      listeners[prop] = [];
    }
    listeners[prop].push(listener);
  };

  let invoke = (name, nv, ov) => {
    if(!listeners[name] || !listeners[name].length) return;
    listeners[name].forEach( listener => {
      typeof listener === 'function' && listener(nv, ov);
    });
  };

  let watchfyRecursive = (model, name, propKey) => {

    Object.observe(model, changes => {
      changes.forEach(change => {
        let propName = propKey ? propKey + '.' + change.name: change.name;
        if(change.type === 'add'){
          watchfyRecursive(change.object[change.name], change.name, propName);
        }else if(change.type === 'update'){
          invoke(propName, change.object[change.name], change.oldValue);
          if(typeof change.object === 'object'){
            watchfyRecursive(change.object[change.name], change.name, propName);
          }
        }else if(change.type === 'delete'){
        }
      });
    });

    for(let prop in model){
      if(typeof model[prop] === 'object'){
        watchfyRecursive(model[prop], prop, propKey ? propKey + '.' + prop: prop);
      }
    }

  };

  watchfyRecursive(model);

};

watchfy(sample02);

sample02.addUpdateListener('childObj01.hoge', (n, o) => {
  console.log('Old value:', o, ' changes to', n);
});

sample02.addUpdateListener('childObj01.ccObj.bar', (n, o) => {
  console.log('Old value:', o, ' changes to', n);
});

