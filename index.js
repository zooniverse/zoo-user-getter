// Generated by CoffeeScript 1.8.0
(function() {
  module.exports = (function(_this) {
    return function(zooniverseCurrentUserCheckerFunction) {
      var $, ANONYMOUS, checkZooniverseCurrentUser, currentUserID, getClientOrigin, getNiceOriginString, getUserIDorIPAddress, returnAnonymous, zooniverseCurrentUserChecker;
      $ = require('jqueryify');
      ANONYMOUS = "(anonymous)";
      currentUserID = ANONYMOUS;
      zooniverseCurrentUserChecker = null;
      returnAnonymous = function() {
        return ANONYMOUS;
      };
      if (zooniverseCurrentUserCheckerFunction instanceof Function) {
        zooniverseCurrentUserChecker = zooniverseCurrentUserCheckerFunction;
      } else {
        zooniverseCurrentUserChecker = returnAnonymous;
      }
      checkZooniverseCurrentUser = function() {
        if (zooniverseCurrentUserChecker && zooniverseCurrentUserChecker instanceof Function && zooniverseCurrentUserChecker() !== null) {
          currentUserID = zooniverseCurrentUserChecker();
        } else {
          currentUserID = ANONYMOUS;
        }
        return currentUserID;
      };
      getClientOrigin = function() {
        var eventualIP;
        eventualIP = new $.Deferred;
        $.get('https://api.ipify.org').then((function(_this) {
          return function(ip) {
            console.log('returned IP was ' + ip);
            return eventualIP.resolve({
              ip: ip,
              address: ip
            });
          };
        })(this)).fail((function(_this) {
          return function() {
            return eventualIP.resolve({
              ip: '?.?.?.?',
              address: ANONYMOUS
            });
          };
        })(this));
        return eventualIP.promise();
      };
      getNiceOriginString = function(data) {
        if ((data.ip != null) && (data.address != null)) {
          if (data.ip === '?.?.?.?') {
            return ANONYMOUS;
          } else if (data.ip === data.address) {
            return "(" + data.ip + ")";
          } else {
            return "(" + data.address + " [" + data.ip + "])";
          }
        } else {
          return ANONYMOUS;
        }
      };
      getUserIDorIPAddress = function() {
        var checkUserNow, eventualUserID;
        eventualUserID = new $.Deferred;
        if (zooniverseCurrentUserChecker === !null) {
          checkUserNow = checkZooniverseCurrentUser();
          if (checkUserNow && currentUserID !== checkUserNow) {
            eventualUserID.resolve(currentUserID);
          } else if ((currentUserID != null) && currentUserID !== ANONYMOUS) {
            eventualUserID.resolve(currentUserID);
          } else {
            getClientOrigin().then(function(data) {
              if (data != null) {
                return currentUserID = getNiceOriginString(data);
              }
            }).always(function() {
              return eventualUserID.resolve(currentUserID);
            });
          }
        } else {
          eventualUserID.resolve(ANONYMOUS);
        }
        return eventualUserID.promise();
      };
      if (typeof window !== "undefined" && window !== null) {
        window.UserGetter = module.exports;
      }
      return module.exports;
    };
  })(this);

}).call(this);