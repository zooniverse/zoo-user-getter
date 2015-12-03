// Generated by CoffeeScript 1.10.0
(function() {
  var $, UserStringGetter,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jqueryify');

  module.exports = UserStringGetter = (function() {
    UserStringGetter.prototype.ANONYMOUS = "(anonymous)";

    UserStringGetter.prototype.UNAVAILABLE = "(unavailable)";

    UserStringGetter.prototype.currentUserID = UserStringGetter.ANONYMOUS;

    UserStringGetter.prototype.zooniverseCurrentUserChecker = null;

    UserStringGetter.prototype.returnAnonymous = function() {
      return this.ANONYMOUS;
    };

    function UserStringGetter(zooniverseCurrentUserCheckerFunction) {
      this.zooniverseCurrentUserCheckerFunction = zooniverseCurrentUserCheckerFunction;
      this.getUserIDorIPAddress = bind(this.getUserIDorIPAddress, this);
      this.rememberCurrentUserID = bind(this.rememberCurrentUserID, this);
      this.forgetCurrentUserID = bind(this.forgetCurrentUserID, this);
      this.setCurrentUserIDFromCallback = bind(this.setCurrentUserIDFromCallback, this);
      this.returnAnonymous = bind(this.returnAnonymous, this);
      if (this.zooniverseCurrentUserCheckerFunction instanceof Function) {
        this.zooniverseCurrentUserChecker = this.zooniverseCurrentUserCheckerFunction;
      } else {
        this.zooniverseCurrentUserChecker = this.returnAnonymous;
      }
    }

    UserStringGetter.prototype.setCurrentUserIDFromCallback = function() {
      var newValueForCurrentUser;
      if (this.zooniverseCurrentUserChecker !== null && this.zooniverseCurrentUserChecker instanceof Function && this.zooniverseCurrentUserChecker() !== null) {
        newValueForCurrentUser = this.zooniverseCurrentUserChecker();
        if ((newValueForCurrentUser != null) && newValueForCurrentUser !== this.ANONYMOUS) {
          console.log("checkZoo method: The callback user getter function returned " + newValueForCurrentUser);
          console.log("checkZoo method setting current UserID in getter to that value.");
          this.currentUserID = this.zooniverseCurrentUserChecker();
          return true;
        }
      }
      return false;
    };

    UserStringGetter.prototype.forgetCurrentUserID = function() {
      console.log("at app request, set currentUserID back to " + this.ANONYMOUS);
      return this.currentUserID = this.ANONYMOUS;
    };

    UserStringGetter.prototype.rememberCurrentUserID = function(newUserID) {
      console.log("at app request, set currentUserID to " + newUserID);
      return this.currentUserID = newUserID;
    };

    UserStringGetter.prototype.getClientOrigin = function() {
      var eventualIP;
      eventualIP = new $.Deferred;
      $.get('https://api.ipify.org').then((function(_this) {
        return function(ip) {
          return eventualIP.resolve({
            ip: ip,
            address: ip
          });
        };
      })(this)).fail((function(_this) {
        return function() {
          return eventualIP.resolve({
            ip: '?.?.?.?',
            address: _this.ANONYMOUS
          });
        };
      })(this));
      return eventualIP.promise();
    };

    UserStringGetter.prototype.getNiceOriginString = function(data) {
      if ((data.ip != null) && (data.address != null)) {
        if (data.ip === '?.?.?.?') {
          return this.ANONYMOUS;
        } else if (data.ip === data.address) {
          return "(" + data.ip + ")";
        } else {
          return "(" + data.address + " [" + data.ip + "])";
        }
      } else {
        return this.ANONYMOUS;
      }
    };

    UserStringGetter.prototype.getUserIDorIPAddress = function() {
      var eventualUserID;
      eventualUserID = new $.Deferred;
      if (this.currentUserID !== this.ANONYMOUS) {
        eventualUserID.resolve(this.currentUserID);
      } else {
        if (this.setCurrentUserIDFromCallback()) {
          eventualUserID.resolve(this.currentUserID);
        } else {
          this.getClientOrigin().then((function(_this) {
            return function(data) {
              if (data != null) {
                console.log("service returned: ");
                console.log(data);
                _this.currentUserID = _this.getNiceOriginString(data);
                return console.log("getUserID method set currentUserID to " + _this.currentUserID);
              }
            };
          })(this)).always((function(_this) {
            return function() {
              return eventualUserID.resolve(_this.currentUserID);
            };
          })(this));
        }
      }
      return eventualUserID.promise();
    };

    return UserStringGetter;

  })();

}).call(this);
