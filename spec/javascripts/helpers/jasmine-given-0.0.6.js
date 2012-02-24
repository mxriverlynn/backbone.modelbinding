(function() {

  (function(jasmine) {
    var mostRecentlyUsed, o, stringifyExpectation;
    stringifyExpectation = function(expectation) {
      var matches;
      matches = expectation.toString().replace(/\n/g, '').match(/function\s?\(\)\s?{\s*(return\s+)?(.*?)(;)?\s*}/i);
      if (matches && matches.length >= 3) {
        return matches[2];
      } else {
        return "";
      }
    };
    beforeEach(function() {
      return this.addMatchers({
        toHaveReturnedFalseFromThen: function(context, n) {
          var exception, result;
          result = false;
          exception = void 0;
          try {
            result = this.actual.call(context);
          } catch (e) {
            exception = e;
          }
          this.message = function() {
            var msg;
            msg = "Then clause " + (n > 1 ? " #" + n : "") + " `" + (stringifyExpectation(this.actual)) + "` failed by ";
            if (exception) {
              msg += "throwing: " + exception.toString();
            } else {
              msg += "returning false";
            }
            return msg;
          };
          return result === false;
        }
      });
    });
    window.When = window.Given = function() {
      var assignResultTo, mostRecentlyUsed, setupFunction;
      setupFunction = o(arguments).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      assignResultTo = o(arguments).firstThat(function(arg) {
        return o(arg).isString();
      });
      mostRecentlyUsed = window.Given;
      return beforeEach(function() {
        var context, result;
        context = jasmine.getEnv().currentSpec;
        result = setupFunction.call(context);
        if (assignResultTo) {
          if (!context[assignResultTo]) {
            return context[assignResultTo] = result;
          } else {
            throw new Error("Unfortunately, the variable '" + assignResultTo + "' is already assigned to: " + context[assignResultTo]);
          }
        }
      });
    };
    window.Then = function(expectationFunction) {
      var expectations, mostRecentlyUsed, subsequentThen;
      mostRecentlyUsed = window.Then;
      expectations = [expectationFunction];
      subsequentThen = function(additionalExpectation) {
        expectations.push(additionalExpectation);
        return this;
      };
      it("then " + (stringifyExpectation(expectations)), function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < expectations.length) {
          expect(expectations[i]).not.toHaveReturnedFalseFromThen(jasmine.getEnv().currentSpec, i + 1);
          _results.push(i++);
        }
        return _results;
      });
      return {
        Then: subsequentThen,
        And: subsequentThen
      };
    };
    mostRecentlyUsed = window.Given;
    window.And = function() {
      return mostRecentlyUsed.apply(this, jasmine.util.argsToArray(arguments));
    };
    return o = function(thing) {
      return {
        isFunction: function() {
          return Object.prototype.toString.call(thing) === "[object Function]";
        },
        isString: function() {
          return Object.prototype.toString.call(thing) === "[object String]";
        },
        firstThat: function(test) {
          var i;
          i = 0;
          while (i < thing.length) {
            if (test(thing[i]) === true) return thing[i];
            i++;
          }
        }
      };
    };
  })(jasmine);

}).call(this);
