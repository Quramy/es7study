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

console.log('push');
model.favorites.push('Ecma Script');
console.log('push');
model.favorites.push('ActionScript');

console.log('splice');
model.favorites.splice(0, 1);
