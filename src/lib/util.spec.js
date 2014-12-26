'use strict';

var assert = require('assert');
var util = require('./util');

describe('util', function () {
  describe('#parse', function () {
    var parse = util.parse;
    it('should return undefined when an empty expression', function () {
      assert.equal(parse()(), undefined);
      assert.equal(parse('')(), undefined);
    });

    it('should return basic type when expr contains basic type values', function () {
      assert.equal(parse('"string"')(), 'string');
      assert.equal(parse('\'string\'')(), 'string');
      assert.equal(parse('0')(), 0);
      assert.equal(parse('true')(), true);
      assert.equal(parse('[0, 1, 2]')()[0], 0);
      //assert.equal(parse('{a: 1}')()['a'], 1);
    });

    it('should return object prerties', function () {
      var ctx = {
        prop: 'PROP',
        child: {
          prop: 'CHILD_PROP'
        },
        basicCollection: [100, 200, 300],
        structuredColletion: [{
          prop: 'SC_PROP'
        }]
      };
      assert.equal(parse('prop')(ctx), 'PROP');
      assert.equal(parse('child.prop')(ctx), 'CHILD_PROP');
      assert.equal(parse('child["prop"]')(ctx), 'CHILD_PROP');
      assert.equal(parse('basicCollection[1]')(ctx), 200);
      assert.equal(parse('structuredColletion[0].prop')(ctx), 'SC_PROP');
    });

    it('should return the result of functions', function () {
      var ctx = {
        myFunc: function (a, b){return a + b;}
      };
      assert.equal(parse('myFunc(1, 2)')(ctx), 3);
    });

    it('should evaluate js expressions', function () {
      var ctx = {a: 1, b: 2};
      assert.equal(parse('3 * (a + b)')(ctx), 9);
      assert.equal(parse('(a - 1) ? true : false')(ctx), false);
    });

  });

});

