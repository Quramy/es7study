'use strict';

var myModel;

$(() => {

  myModel = MVC.Model.extend({
    name: 'Quramy',
    age: 30,
    favorites: [
      'javascript',
      'ECMA Script'
    ]
  });

  let myView = MVC.View.extend({
    template: 
        '<div>' 
      + '  <input type="text" data-model-prop="name" /> <br />'
      + '  <input type="text" data-model-prop="age" /> <br />'
      + '  <span>name: {%= name %}</span> <br />'
      + '  <span>age: {%= age %}</span>'
      + '  <button data-click="addAge">increment age</button>'
      + '  <ul data-repeat="favorites" data-repeat-as="favorite">'
      + '    <li>favorite: <span>{%= favorite %}</span></li>'
      + '  </ul>'
      + '</div>'
      ,
    model: myModel,
    controller: {
      addAge: () => {
        this.model.age++;
      }
    }
  });

  $('#app').html(myView.render().el);

});


