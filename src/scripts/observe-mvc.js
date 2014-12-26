'use strict';
(function () {

  let Base = (() => {
    let extend = base => {
      return opt => {
        let obj = Object.create(base);
        for(let key in opt){
          obj[key] = opt[key];
        }
        obj.extend = extend(obj);
        return obj;
      };
    };
    return {
      extend: extend({})
    };
  })();

  let Model = Base.extend({
    addListener: (prop, cb) => {
      let listener;
      Object.observe(this, listener = changes => {
        changes.forEach(change => {
          if(change.name === prop){
            cb(change.object[prop], change.oldValue);
          }
        });
      });
      return (() => {
        return Object.unobserve(this, listener);
      }).bind(this);
    },
    collectionRemoveListener: (prop, cb) => {
      let listener;
      Object.observe(this[prop], listener = changes => {
        let removes = [];
        changes.forEach(change => {
          if(change.name.match(/\d+/)){
            if(change.object.indexOf(change.oldValue) === -1){
              removes.push(change.oldValue);
            }
          }
        });
        cb(removes);
      });
    },
    collectionAddListener: (prop, cb) => {
    },
    collectionUpdateListener: () => {
    },
  });

  let compile = (tmpl, cb) => {
    let builder = [], mode, tmp = tmpl.split(/({%=\s+|\s+%})/);
    let targetProps = [];
    tmp && tmp.forEach(part => {
      if(part.startsWith('{%=')){
        mode = true;
      }else if(part.endsWith('%}')){
        mode = false;
      }else{
        if(!mode){
          builder.push(model => part);
        }else{
          let parsed = util.parse(part);
          builder.push(parsed);
          parsed.depends.forEach(prop => {
            (targetProps.indexOf(prop) === -1) && targetProps.push(prop)
          });
        }
      }
    });
    cb && cb(model => builder.map(it => it(model)).join(''), targetProps);
  };

  let elementHandlers = [];

  let textGenerator = function* (p){
    let cur = p.firstChild;
    while(cur){
      if(cur.nodeName === '#text' && cur.nodeValue.trim() !== ''){
        yield cur;
      }
      cur = cur.nextSibling;
    }
  };

  let View = Base.extend({
    template: '',
    el: null,
    init: () => {},
    __init: () => {
      this.init();
      return this;
    },

    render: () => {
      let self = this;
      let travaerse = $self => {
        $self.children().each(() => {
          let $elm = $(this);
          elementHandlers.forEach( handler => {
            handler.handle && handler.handle($elm, self);
          });
          travaerse($elm);
        });
      };
      this.el = $(this.template);
      elementHandlers.forEach( handler => {
        handler.handle && handler.handle(self.el, self);
      });
      travaerse(this.el);
      return this;
    },
    controller: {},
    model: Model.extend({}),
  });

  elementHandlers.push({
    name: 'inputHandler',
    handle: ($elm, view) => {
      if($elm[0].nodeName === 'INPUT' && $elm.attr('data-model-prop')){
        let prop = $elm.attr('data-model-prop');
        $elm.on('input', event => {
          view.model[prop] = $elm.val();
        });
        $elm.val(view.model[prop]);
        view.model.addListener(prop, v => $elm.val(v));
      }
    }
  });

  elementHandlers.push({
    name: 'repeatHanlder',
    handle: ($elm, view) => {
      let nameExpr = $elm.attr('data-repeat-as');
      let collectoinExpr = $elm.attr('data-repeat');
      if(collectoinExpr && nameExpr && view.model[collectoinExpr]){
        let collectoin = view.model[collectoinExpr];
        console.log(collectoin);
        let ChildView = View.extend({
          template: $elm.html()
        });
        $elm.empty();
        collectoin.forEach(item => {
          let childProps = {};
          childProps[nameExpr] = item
          let childModel = view.model.extend(childProps);
          let iView = ChildView.extend({
            model: childModel
          });
          iView.render();
          $elm.append(iView.el);
        });
      }
    }
  });

  elementHandlers.push({
    name: 'clickHandler',
    handle: ($elm, view) => {
      let ctrl;
      if(ctrl = $elm.attr('data-click')){
        $elm.on('click', event => {
          view.controller[ctrl] && view.controller[ctrl].bind(view)(event);
        });
      }
    }
  });

  elementHandlers.push({
    name: 'textBindingHanlder',
    handle: ($elm, view) => {
      for(let itr of textGenerator($elm[0])){
        (node => {
          node && compile(node.nodeValue, (linkFn, targetProps) => {
            targetProps.length && targetProps.forEach(prop => {
              view.model.addListener(prop, () => {
                node.nodeValue = linkFn(view.model);
              });
            })
            node.nodeValue = linkFn(view.model);
          });
        })(itr);
      }
    }
  });

  window.MVC = {
    View: View,
    Model: Model,
    elementHandlers: elementHandlers
  };

})();
