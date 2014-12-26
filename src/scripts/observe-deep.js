'use strict';

var watchfy = model => {

  let listeners = {};

  model.addUpdateListener = (prop, listener) => {
    if(!listeners[prop]){
      listeners[prop] = [];
    }
    listeners[prop].push(listener);
    return model;
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
        if(change.type === 'add' || change.type === 'update'){
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

  return model;

};

