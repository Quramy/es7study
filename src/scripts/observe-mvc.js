'use strict';

let modelProto = {
  addListener: (prop, cb) => {
    Object.observe(this, changes => {
      changes.forEach(change => {
        if(change.name === prop){
          cb();
        }
      });
    });
  }
};

let compile = (tmpl, cb) => {
  let builder = [], mode, tmp = tmpl.split(/(<%=\s+|\s+%>)/);
  let targetProps = [];
  tmp && tmp.forEach(part => {
    if(part.startsWith('<%=')){
      mode = true;
    }else if(part.endsWith('%>')){
      mode = false;
    }else{
      if(!mode){
        builder.push(model => part);
      }else{
        targetProps.indexOf(part) < 0 && targetProps.push(part);
        builder.push(model => model[part]);
      }
    }
  });
  cb && cb(model => builder.map(it => it(model)).join(''), targetProps);
};

let viewProto = {
  template: '',
  el: null,
  init: () => {},
  __init: () => {
    this.init();
    return this;
  },
  render: () => {
    let self = this;
    this.el = $(this.template);
    this.el.find('*').each(() => {
      let $self = $(this);
      compile($self.text(), (linkFn, targetProps) => {
        targetProps.length && targetProps.forEach(prop => {
          self.model.addListener(prop, () => {
            $self.text(linkFn(self.model));
          });
        })
        $self.text(linkFn(self.model));
      });

      if($self[0].nodeName === 'INPUT' && $self.attr('data-model-prop')){
        let prop = $self.attr('data-model-prop');
        $self.on('input', event => {
          self.model[prop] = $self.val();
        });
        $self.val(self.model[prop]);
        self.model.addListener(prop, () =>{
          $self.val(self.model[prop]);
        });
      }
    });
    return this;
  },
  model: {},
};

let View = {
  create: opt => {
    let obj = Object.create(viewProto);
    for(let key in opt){
      obj[key] = opt[key];
    }
    return obj.__init();
  }
};

let Model = {
  create: opt => {
    let obj = Object.create(modelProto);
    for(let key in opt){
      obj[key] = opt[key];
    }
    return obj;
  }
};

$(() => {
  let myModel = Model.create({
    name: 'Quramy',
    age: 30
  });

  let myView = View.create({
    template: 
        '<div>' 
      + '  <input type="text" data-model-prop="name" /> <br />'
      + '  <input type="text" data-model-prop="age" /> <br />'
      + '  <span>name: <%= name %></span> <br />'
      + '  <span>age: <%= age %></span>'
      + '</div>'
      ,
    model: myModel
  });

  $('#app').html(myView.render().el);

});
