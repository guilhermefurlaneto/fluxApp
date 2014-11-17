/* global describe, it, afterEach, document, sinon, expect */
'use strict';

// env setup
var React = require('react/addons');
var fluxApp = require('../../lib');

describe('Actions', function() {

  var renderedComponent;

  function renderComponent(spec) {
    var elem = document.createElement('div');
    var Component = React.createClass(spec);
    document.body.appendChild(elem);
    return React.render(<Component />, elem);
  }

  afterEach(function() {
    if (renderedComponent) {
      var elem = renderedComponent.getDOMNode().parentNode;
      React.unmountComponentAtNode(elem);
      document.body.removeChild(elem);
    }

    fluxApp._stores = {};
    fluxApp._actions = {};
  });

  it('should expose a getActions method', function() {
    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      render: function() {
        expect(this.getActions).to.be.a('function');

        return (
          <h1>Hello</h1>
        );
      }
    });
  });

  it('should expose a getAction method', function() {
    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      render: function() {
        expect(this.getActions).to.be.a('function');

        return (
          <h1>Hello</h1>
        );
      }
    });
  });

  describe('getActions', function() {
    it('should return the actions registered', function() {
      fluxApp.createActions('testing', {
        methodA: function() {},
        methodB: function() {}
      });

      renderedComponent = renderComponent({
        mixins: [fluxApp.mixins.component],

        render: function() {
          expect(this.getActions).to.be.a('function');
          var actions = this.getActions('testing');

          expect(actions).to.be.a('object');
          expect(actions.methodA).to.be.a('function');
          expect(actions.methodB).to.be.a('function');

          return (
            <h1>Hello</h1>
          );
        }
      });
    });
  });

  describe('getAction', function() {
    it('should return the action requested', function() {
      fluxApp.createActions('testing', {
        methodA: function() {},
        methodB: function() {}
      });

      renderedComponent = renderComponent({
        mixins: [fluxApp.mixins.component],

        render: function() {
          expect(this.getAction).to.be.a('function');
          var action = this.getAction('testing', 'methodA');

          expect(action).to.be.a('function');

          return (
            <h1>Hello</h1>
          );
        }
      });
    });
  });


  it('should get notified when a before action occurs', function(done) {
    var spy = sinon.spy();

    fluxApp.createActions('test', {
      method: function() {
        return new Promise(function(resolve){
          setImmediate(function() {
            resolve('something');
          });
        });
      }
    });

    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      flux: {
        actions: {
          onTestMethodBefore: 'test.method:before'
        }
      },

      onTestMethodBefore: spy,

      render: function() {
        return (
          <h1>Hello</h1>
        );
      }
    });

    var promise = fluxApp.getActions('test').method();

    promise.then(function() {
      expect(spy.called).to.equal(true);
      done();
    });
  });

  it('should get notified when a after action occurs', function(done) {
    var spy = sinon.spy();

    fluxApp.createActions('test', {
      method: function() {
        return new Promise(function(resolve){
          setImmediate(function() {
            resolve('something');
          });
        });
      }
    });

    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      flux: {
        actions: {
          onTestMethodAfter: 'test.method:after'
        }
      },

      onTestMethodAfter: spy,

      render: function() {
        return (
          <h1>Hello</h1>
        );
      }
    });

    var promise = fluxApp.getActions('test').method();

    promise.then(function() {
      expect(spy.called).to.equal(true);
      done();
    });
  });

  it('should get notified when failed action occurs (SYNC)', function(done) {
    var spy = sinon.spy();

    fluxApp.createActions('test', {
      method: function() {
        throw new Error('sync failed');
      }
    });

    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      flux: {
        actions: {
          onTestMethodFailed: 'test.method:failed'
        }
      },

      onTestMethodFailed: spy,

      render: function() {
        return (
          <h1>Hello</h1>
        );
      }
    });

    var promise = fluxApp.getActions('test').method();

    promise.then(function() {}, function() {
      expect(spy.called).to.equal(true);
      done();
    });
  });

  it('should get notified when failed action occurs', function(done) {
    var spy = sinon.spy();

    fluxApp.createActions('test', {
      method: function() {
        return new Promise(function(resolve, reject){
          setImmediate(function() {
            reject(new Error('something'));
          });
        });
      }
    });

    renderedComponent = renderComponent({
      mixins: [fluxApp.mixins.component],

      flux: {
        actions: {
          onTestMethodFailed: 'test.method:failed'
        }
      },

      onTestMethodFailed: spy,

      render: function() {
        return (
          <h1>Hello</h1>
        );
      }
    });

    var promise = fluxApp.getActions('test').method();

    promise.then(function() {}, function() {
      expect(spy.called).to.equal(true);
      done();
    });
  });
});
