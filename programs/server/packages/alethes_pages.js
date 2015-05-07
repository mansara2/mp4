(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var Random = Package.random.Random;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/alethes:pages/lib/pages.coffee.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Pages,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

this.__Pages = Pages = (function() {
  Pages.prototype.settings = {
    dataMargin: [true, Number, 3],
    divWrapper: [true, Match.OneOf(Match.Optional(String), Match.Optional(Boolean)), "pagesCont"],
    fields: [true, Object, {}],
    filters: [true, Object, {}],
    itemTemplate: [true, String, "_pagesItemDefault"],
    navShowEdges: [true, Boolean, false],
    navShowFirst: [true, Boolean, true],
    navShowLast: [true, Boolean, true],
    resetOnReload: [true, Boolean, false],
    paginationMargin: [true, Number, 3],
    perPage: [true, Number, 10],
    route: [true, String, "/page/"],
    router: [true, Match.Optional(String), void 0],
    routerTemplate: [true, String, "pages"],
    routerLayout: [true, Match.Optional(String), void 0],
    sort: [true, Object, {}],
    auth: [false, Match.Optional(Function), void 0],
    availableSettings: [false, Object, {}],
    fastRender: [false, Boolean, false],
    homeRoute: [false, Match.OneOf(String, Array, Boolean), "/"],
    infinite: [false, Boolean, false],
    infiniteItemsLimit: [false, Number, Infinity],
    infiniteTrigger: [false, Number, .9],
    infiniteRateLimit: [false, Number, 1],
    navTemplate: [false, String, "_pagesNavCont"],
    onDeniedSetting: [
      false, Function, function(k, v, e) {
        return typeof console !== "undefined" && console !== null ? console.log("Changing " + k + " not allowed.") : void 0;
      }
    ],
    pageSizeLimit: [false, Number, 60],
    pageTemplate: [false, String, "_pagesPageCont"],
    rateLimit: [false, Number, 1],
    routeSettings: [false, Match.Optional(Function), void 0],
    table: [false, Match.OneOf(Boolean, Object), false],
    tableItemTemplate: [false, String, "_pagesTableItem"],
    tableTemplate: [false, String, "_pagesTable"],
    templateName: [false, Match.Optional(String), void 0]
  };

  Pages.prototype._nInstances = 0;

  Pages.prototype.collections = {};

  Pages.prototype.instances = {};

  Pages.prototype.methods = {
    "CountPages": function(sub) {
      var n;
      n = sub.get("nPublishedPages");
      if (n != null) {
        return n;
      }
      n = Math.ceil(this.Collection.find({
        $and: [sub.get("filters"), sub.get("realFilters") || {}]
      }).count() / (sub.get("perPage")));
      return n || 1;
    },
    "Set": function(k, v, sub) {
      var changes, _k, _v;
      if (this.settings[k] == null) {
        this.error(4003, "Invalid option: " + k + ".");
      }
      check(k, String);
      check(v, this.settings[k][1]);
      check(sub, Match.Where(function(sub) {
        var _ref;
        return ((_ref = sub.connection) != null ? _ref.id : void 0) != null;
      }));
      if (!this.availableSettings[k] || (_.isFunction(this.availableSettings[k]) && !this.availableSettings[k](v, sub))) {
        this.error(4002, "Changing " + k + " not allowed.");
      }
      changes = 0;
      if (v != null) {
        changes = this._set(k, v, {
          cid: sub.connection.id
        });
      } else if (!_.isString(k)) {
        for (_k in k) {
          _v = k[_k];
          changes += this.set(_k, _v, {
            cid: sub.connection.id
          });
        }
      }
      return changes;
    },
    "Unsubscribe": function() {
      var i, k, subs, _i, _len, _ref;
      subs = [];
      _ref = this.subscriptions;
      for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
        i = _ref[k];
        if (i.connection.id === arguments[arguments.length - 1].connection.id) {
          i.stop();
        } else {
          subs.push(i);
        }
      }
      this.subscriptions = subs;
      return true;
    }
  };

  function Pages(collection, settings) {
    if (settings == null) {
      settings = {};
    }
    if (!(this instanceof Meteor.Pagination)) {
      throw new Meteor.Error(4000, "The Meteor.Pagination instance has to be initiated with `new`");
    }
    this.init = true;
    this.subscriptions = [];
    this.userSettings = {};
    this._currentPage = 1;
    this.setCollection(collection);
    this.setInitial(settings);
    this.setDefaults();
    this.setRouter();
    this[(Meteor.isServer ? "server" : "client") + "Init"]();
    this.registerInstance();
    this;
  }

  Pages.prototype.error = function(code, msg) {
    if (code == null) {
      msg = code;
    }
    throw new Meteor.Error(code, msg);
  };

  Pages.prototype.serverInit = function() {
    var self;
    this.setMethods();
    self = this;
    Meteor.onConnection((function(_this) {
      return function(connection) {
        return connection.onClose(function() {
          return delete _this.userSettings[connection.id];
        });
      };
    })(this));
    return Meteor.publish(this.id, function(page) {
      return self.publish.call(self, page, this);
    });
  };

  Pages.prototype.clientInit = function() {
    this.requested = {};
    this.received = {};
    this.queue = [];
    this.setTemplates();
    this.countPages();
    Tracker.autorun((function(_this) {
      return function() {
        if (typeof Meteor.userId === "function") {
          Meteor.userId();
        }
        return _this.reload();
      };
    })(this));
    if (this.infinite) {
      return this.setInfiniteTrigger();
    }
  };

  Pages.prototype.reload = function() {
    return this.unsubscribe((function(_this) {
      return function() {
        return _this.call("CountPages", function(e, total) {
          var p;
          _this.sess("totalPages", total);
          p = _this.currentPage();
          if ((p == null) || _this.resetOnReload || p > total) {
            p = 1;
          }
          _this.sess("currentPage", false);
          return _this.sess("currentPage", p);
        });
      };
    })(this));
  };

  Pages.prototype.unsubscribe = function(cb) {
    return this.call("Unsubscribe", (function(_this) {
      return function() {
        delete _this.initPage;
        _this.subscriptions = [];
        _this.requested = {};
        _this.received = {};
        _this.queue = [];
        return typeof cb === "function" ? cb() : void 0;
      };
    })(this));
  };

  Pages.prototype.setDefaults = function() {
    var k, v, _ref, _results;
    _ref = this.settings;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      if (v[2] != null) {
        _results.push(this[k] != null ? this[k] : this[k] = v[2]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Pages.prototype.syncSettings = function(cb) {
    var S, k, v, _ref;
    S = {};
    _ref = this.settings;
    for (k in _ref) {
      v = _ref[k];
      if (v[0]) {
        S[k] = this[k];
      }
    }
    return this.set(S, cb != null ? {
      cb: cb.bind(this)
    } : null);
  };

  Pages.prototype.setMethods = function() {
    var f, n, nm, self, _ref;
    nm = {};
    self = this;
    _ref = this.methods;
    for (n in _ref) {
      f = _ref[n];
      nm[this.getMethodName(n)] = (function(f) {
        return function() {
          var arg, k, r, v;
          arg = (function() {
            var _results;
            _results = [];
            for (k in arguments) {
              v = arguments[k];
              _results.push(v);
            }
            return _results;
          }).apply(this, arguments);
          arg.push(this);
          this.get = (function(self, k) {
            return self.get(k, this.connection.id);
          }).bind(this, self);
          r = f.apply(self, arg);
          return r;
        };
      })(f);
    }
    return Meteor.methods(nm);
  };

  Pages.prototype.getMethodName = function(name) {
    return "" + this.id + "/" + name;
  };

  Pages.prototype.call = function() {
    var args, last;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    check(args, Array);
    if (args.length < 1) {
      this.error(4001, "Method name not provided in a method call.");
    }
    args[0] = this.getMethodName(args[0]);
    last = args.length - 1;
    if (_.isFunction(args[last])) {
      args[last] = args[last].bind(this);
    }
    return Meteor.call.apply(this, args);
  };

  Pages.prototype.sess = function(k, v) {
    if (typeof Session === "undefined" || Session === null) {
      return;
    }
    k = "" + this.id + "." + k;
    if (arguments.length === 2) {
      return Session.set(k, v);
    } else {
      return Session.get(k);
    }
  };

  Pages.prototype.get = function(setting, connectionId) {
    var _ref, _ref1;
    return (_ref = (_ref1 = this.userSettings[connectionId]) != null ? _ref1[setting] : void 0) != null ? _ref : this[setting];
  };

  Pages.prototype.set = function() {
    var ch, k, opts, _k, _v;
    k = arguments[0], opts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ch = 0;
    switch (opts.length) {
      case 0:
        if (_.isObject(k)) {
          for (_k in k) {
            _v = k[_k];
            ch += this._set(_k, _v);
          }
        }
        break;
      case 1:
        if (_.isObject(k)) {
          if (_.isFunction(opts[0])) {
            opts[0] = {
              cb: opts[0]
            };
          }
          for (_k in k) {
            _v = k[_k];
            ch += this._set(_k, _v, opts[0]);
          }
        } else {
          check(k, String);
          ch = this._set(k, opts[0]);
        }
        break;
      case 2:
        if (_.isFunction(opts[1])) {
          opts[1] = {
            cb: opts[1]
          };
        }
        ch = this._set(k, opts[0], opts[1]);
        break;
      case 3:
        check(opts[1], Object);
        check(opts[2], Function);
        opts[2] = {
          cb: opts[2]
        };
        ch = this._set(k, opts[1], opts[2]);
    }
    if (Meteor.isClient && ch) {
      this.reload();
    }
    return ch;
  };

  Pages.prototype.setInitial = function(settings) {
    this.setInitDone = false;
    this.set(settings);
    return this.setInitDone = true;
  };

  Pages.prototype.sanitizeRegex = function(v) {
    var lis;
    if (_.isRegExp(v)) {
      v = v.toString();
      lis = v.lastIndexOf("/");
      v = {
        $regex: v.slice(1, lis),
        $options: v.slice(1 + lis)
      };
    }
    return v;
  };

  Pages.prototype.sanitizeRegexObj = function(obj) {
    var k, v;
    if (_.isRegExp(obj)) {
      return this.sanitizeRegex(obj);
    }
    for (k in obj) {
      v = obj[k];
      if (_.isRegExp(v)) {
        obj[k] = this.sanitizeRegex(v);
      } else if ("object" === typeof v) {
        obj[k] = this.sanitizeRegexObj(v);
      }
    }
    return obj;
  };

  Pages.prototype._set = function(k, v, opts) {
    var ch, oldV, _base, _name, _ref, _ref1, _ref2;
    if (opts == null) {
      opts = {};
    }
    check(k, String);
    ch = 1;
    if (Meteor.isServer || (this[k] == null) || ((_ref = this.settings[k]) != null ? _ref[0] : void 0) || opts.init) {
      if ((((_ref1 = this.settings[k]) != null ? _ref1[1] : void 0) != null) && ((_ref2 = this.settings[k]) != null ? _ref2[1] : void 0) !== true) {
        check(v, this.settings[k][1]);
      }
      this.sanitizeRegexObj(v);
      oldV = this.get(k, opts != null ? opts.cid : void 0);
      if (this.valuesEqual(v, oldV)) {
        return 0;
      }
      if (Meteor.isClient) {
        this[k] = v;
        if (this.setInitDone) {
          this.call("Set", k, v, function(e, r) {
            if (e) {
              this[k] = oldV;
              return this.onDeniedSetting.call(this, k, v, e);
            }
            return typeof opts.cb === "function" ? opts.cb(ch) : void 0;
          });
        }
      } else {
        if (opts.cid) {
          if (ch != null) {
            if ((_base = this.userSettings)[_name = opts.cid] == null) {
              _base[_name] = {};
            }
            this.userSettings[opts.cid][k] = v;
          }
        } else {
          this[k] = v;
        }
        if (typeof opts.cb === "function") {
          opts.cb(ch);
        }
      }
    } else {
      this.onDeniedSetting.call(this, k, v);
    }
    return ch;
  };

  Pages.prototype.valuesEqual = function(v1, v2) {
    if (_.isFunction(v1)) {
      return _.isFunction(v2) && v1.toString() === v2.toString();
    } else {
      return _.isEqual(v1, v2);
    }
  };

  Pages.prototype.setId = function(name) {
    var n;
    if (this.templateName) {
      name = this.templateName;
    }
    while (name in Pages.prototype.instances) {
      n = name.match(/[0-9]+$/);
      if (n != null) {
        name = name.slice(0, name.length - n[0].length) + (parseInt(n) + 1);
      } else {
        name = name + "2";
      }
    }
    this.id = "pages_" + name;
    return this.name = name;
  };

  Pages.prototype.registerInstance = function() {
    Pages.prototype._nInstances++;
    return Pages.prototype.instances[this.name] = this;
  };

  Pages.prototype.setCollection = function(collection) {
    var e;
    if (typeof collection === "object") {
      Pages.prototype.collections[collection._name] = collection;
      this.Collection = collection;
    } else {
      try {
        this.Collection = new Mongo.Collection(collection);
        Pages.prototype.collections[collection] = this.Collection;
      } catch (_error) {
        e = _error;
        this.Collection = Pages.prototype.collections[collection];
        this.Collection instanceof Mongo.Collection || this.error(4000, "The '" + collection + "' collection was created outside of <Meteor.Pagination>. Pass the collection object instead of the collection's name to the <Meteor.Pagination> constructor.");
      }
    }
    this.setId(this.Collection._name);
    return this.PaginatedCollection = new Mongo.Collection(this.id);
  };

  Pages.prototype.linkTo = function(page) {
    var params, _ref;
    if ((_ref = Router.current()) != null ? _ref.params : void 0) {
      params = Router.current().params;
      params.page = page;
      return Router.routes["" + this.name + "_page"].path(params);
    }
  };

  Pages.prototype.setRouter = function() {
    var init, l, pr, self, t, _ref;
    if (this.router === "iron-router") {
      if (this.route.indexOf(":page") === -1) {
        if (this.route[0] !== "/") {
          this.route = "/" + this.route;
        }
        if (this.route[this.route.length - 1] !== "/") {
          this.route += "/";
        }
        pr = this.route = "" + this.route + ":page";
      }
      t = this.routerTemplate;
      l = (_ref = this.routerLayout) != null ? _ref : void 0;
      self = this;
      init = true;
      Router.map(function() {
        var hr, k, _i, _len, _ref1, _results;
        if (!self.infinite) {
          this.route("" + self.name + "_page", {
            path: pr,
            template: t,
            layoutTemplate: l,
            onBeforeAction: function() {
              var page;
              page = parseInt(this.params.page);
              if (self.init) {
                self.sess("oldPage", page);
                self.sess("currentPage", page);
              }
              if (self.routeSettings != null) {
                self.routeSettings(this);
              }
              Tracker.nonreactive((function(_this) {
                return function() {
                  return self.onNavClick(page);
                };
              })(this));
              return this.next();
            }
          });
        }
        if (self.homeRoute) {
          if (_.isString(self.homeRoute)) {
            self.homeRoute = [self.homeRoute];
          }
          _ref1 = self.homeRoute;
          _results = [];
          for (k = _i = 0, _len = _ref1.length; _i < _len; k = ++_i) {
            hr = _ref1[k];
            _results.push(this.route("" + self.name + "_home" + k, {
              path: hr,
              template: t,
              layoutTemplate: l,
              onBeforeAction: function() {
                if (self.routeSettings != null) {
                  self.routeSettings(this);
                }
                if (self.init) {
                  self.sess("oldPage", 1);
                  self.sess("currentPage", 1);
                }
                return this.next();
              }
            }));
          }
          return _results;
        }
      });
      if (Meteor.isServer && this.fastRender) {
        self = this;
        FastRender.route(pr, function(params) {
          return this.subscribe(self.id, parseInt(params.page));
        });
        return FastRender.route(this.homeRoute, function() {
          return this.subscribe(self.id, 1);
        });
      }
    }
  };

  Pages.prototype.setPerPage = function() {
    return this.perPage = this.pageSizeLimit < this.perPage ? this.pageSizeLimit : this.perPage;
  };

  Pages.prototype.setTemplates = function() {
    var i, name, tn, _i, _len, _ref;
    name = this.templateName || this.name;
    if (this.table && this.itemTemplate === "_pagesItemDefault") {
      this.itemTemplate = this.tableItemTemplate;
    }
    _ref = [this.navTemplate, this.pageTemplate, this.itemTemplate, this.tableTemplate];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      tn = this.id + i;
      Template[tn] = new Blaze.Template("Template." + tn, Template[i].renderFunction);
      Template[tn].helpers(_TemplateHelpers[i]);
      Template[tn].events(_TemplateEvents[i]);
      Template[tn].helpers({
        pagesData: this
      });
    }
    return Template[name].helpers({
      pagesData: this,
      pagesNav: Template[this.id + this.navTemplate],
      pages: Template[this.id + this.pageTemplate]
    });
  };

  Pages.prototype.countPages = _.throttle(function() {
    return this.call("CountPages", (function(e, r) {
      this.sess("totalPages", r);
      if (this.sess("currentPage") > r) {
        return this.sess("currentPage", 1);
      }
    }).bind(this));
  }, 500);

  Pages.prototype.publish = function(page, sub) {
    var c, cid, filters, get, handle, handle2, init, n, options, r, self, set, skip, _ref, _ref1;
    check(page, Number);
    check(sub, Match.Where(function(s) {
      return s.ready != null;
    }));
    cid = sub.connection.id;
    get = sub.get = (function(cid, k) {
      return this.get(k, cid);
    }).bind(this, cid);
    set = sub.set = (function(cid, k, v) {
      return this.set(k, v, {
        cid: cid
      });
    }).bind(this, cid);
    if ((_ref = this.userSettings[cid]) != null) {
      delete _ref.realFilters;
    }
    if ((_ref1 = this.userSettings[cid]) != null) {
      delete _ref1.nPublishedPages;
    }
    this.setPerPage();
    skip = (page - 1) * get("perPage");
    if (skip < 0) {
      skip = 0;
    }
    filters = get("filters");
    options = {
      sort: get("sort"),
      fields: get("fields"),
      skip: skip,
      limit: get("perPage")
    };
    if (this.auth != null) {
      r = this.auth.call(this, skip, sub);
      if (!r) {
        set("nPublishedPages", 0);
        sub.ready();
        return this.ready();
      } else if (_.isNumber(r)) {
        set("nPublishedPages", r);
        if (page > r) {
          sub.ready();
          return this.ready();
        }
      } else if (_.isArray(r) && r.length === 2) {
        if (_.isFunction(r[0].fetch)) {
          c = r;
        } else {
          filters = r[0];
          options = r[1];
        }
      } else if (_.isFunction(r.fetch)) {
        c = r;
      }
    }
    if (!EJSON.equals({}, filters) && !EJSON.equals(get("filters"), filters)) {
      set("realFilters", filters);
    }
    if (c == null) {
      c = this.Collection.find(filters, options);
    }
    init = true;
    self = this;
    handle = c.observe({
      addedAt: (function(sub, doc, at) {
        var e, id;
        try {
          doc["_" + this.id + "_p"] = page;
          doc["_" + this.id + "_i"] = at;
          id = doc._id;
          delete doc._id;
          if (!init) {
            sub.added(this.id, id, doc);
            return (this.Collection.find(get("filters"), {
              sort: get("sort"),
              fields: get("fields"),
              skip: skip,
              limit: get("perPage")
            })).forEach((function(_this) {
              return function(o, i) {
                if (i >= at) {
                  return sub.changed(_this.id, o._id, _.object([["_" + _this.id + "_i", i + 1]]));
                }
              };
            })(this));
          }
        } catch (_error) {
          e = _error;
        }
      }).bind(this, sub)
    });
    handle2 = c.observeChanges({
      movedBefore: (function(sub, id, before) {
        var at, ref;
        at = -1;
        ref = false;
        (this.Collection.find(get("filters"), {
          sort: get("sort"),
          fields: get("fields"),
          skip: skip,
          limit: get("perPage")
        })).forEach((function(_this) {
          return function(o, i) {
            if (ref) {
              return sub.changed(_this.id, o._id, _.object([["_" + _this.id + "_i", i + 1]]));
            } else if (o._id === before) {
              ref = true;
              return at = i;
            }
          };
        })(this));
        return sub.changed(this.id, id, _.object([["_" + this.id + "_i", at]]));
      }).bind(this, sub),
      changed: (function(sub, id, fields) {
        var e;
        try {
          return sub.changed(this.id, id, fields);
        } catch (_error) {
          e = _error;
        }
      }).bind(this, sub),
      removed: (function(sub, id) {
        var e;
        try {
          return sub.removed(this.id, id);
        } catch (_error) {
          e = _error;
        }
      }).bind(this, sub)
    });
    n = 0;
    c.forEach((function(doc, index, cursor) {
      n++;
      doc["_" + this.id + "_p"] = page;
      doc["_" + this.id + "_i"] = index;
      return sub.added(this.id, doc._id, doc);
    }).bind(this));
    init = false;
    sub.onStop(function() {
      handle.stop();
      return handle2.stop();
    });
    this.ready();
    this.subscriptions.push(sub);
    return c;
  };

  Pages.prototype.loading = function(p) {
    if (!this.fastRender && p === this.currentPage()) {
      return this.sess("ready", false);
    }
  };

  Pages.prototype.now = function() {
    return (new Date()).getTime();
  };

  Pages.prototype.log = function(msg) {
    return console.log("" + this.name + " " + msg);
  };

  Pages.prototype.logRequest = function(p) {
    this.timeLastRequest = this.now();
    this.requesting = p;
    return this.requested[p] = 1;
  };

  Pages.prototype.logResponse = function(p) {
    delete this.requested[p];
    return this.received[p] = 1;
  };

  Pages.prototype.clearQueue = function() {
    return this.queue = [];
  };

  Pages.prototype.neighbors = function(page) {
    var d, np, pp, _i, _ref;
    this.n = [];
    if (this.dataMargin === 0) {
      return this.n;
    }
    for (d = _i = 1, _ref = this.dataMargin; 1 <= _ref ? _i <= _ref : _i >= _ref; d = 1 <= _ref ? ++_i : --_i) {
      np = page + d;
      if (np <= this.sess("totalPages")) {
        this.n.push(np);
      }
      pp = page - d;
      if (pp > 0) {
        this.n.push(pp);
      }
    }
    return this.n;
  };

  Pages.prototype.queueNeighbors = function(page) {
    var p, _i, _len, _ref, _results;
    _ref = this.neighbors(page);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (!this.received[p] && !this.requested[p]) {
        _results.push(this.queue.push(p));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Pages.prototype.paginationNavItem = function(label, page, disabled, active) {
    if (active == null) {
      active = false;
    }
    return {
      p: label,
      n: page,
      active: active ? "active" : "",
      disabled: disabled ? "disabled" : ""
    };
  };

  Pages.prototype.paginationNeighbors = function() {
    var from, i, k, n, p, page, to, total, _i, _j, _len;
    page = this.currentPage();
    total = this.sess("totalPages");
    from = page - this.paginationMargin;
    to = page + this.paginationMargin;
    if (from < 1) {
      to += 1 - from;
      from = 1;
    }
    if (to > total) {
      from -= to - total;
      to = total;
    }
    if (from < 1) {
      from = 1;
    }
    if (to > total) {
      to = total;
    }
    n = [];
    if (this.navShowFirst || this.navShowEdges) {
      n.push(this.paginationNavItem("«", 1, page === 1));
    }
    n.push(this.paginationNavItem("<", page - 1, page === 1));
    for (p = _i = from; from <= to ? _i <= to : _i >= to; p = from <= to ? ++_i : --_i) {
      n.push(this.paginationNavItem(p, p, page > total, p === page));
    }
    n.push(this.paginationNavItem(">", page + 1, page >= total));
    if (this.navShowLast || this.navShowEdges) {
      n.push(this.paginationNavItem("»", total, page >= total));
    }
    for (k = _j = 0, _len = n.length; _j < _len; k = ++_j) {
      i = n[k];
      n[k]['_p'] = this;
    }
    return n;
  };

  Pages.prototype.onNavClick = function(n) {
    if (n <= this.sess("totalPages") && n > 0) {
      Tracker.nonreactive((function(_this) {
        return function() {
          var cp;
          cp = _this.sess("currentPage");
          if (_this.received[cp]) {
            return _this.sess("oldPage", cp);
          }
        };
      })(this));
      return this.sess("currentPage", n);
    }
  };

  Pages.prototype.setInfiniteTrigger = function() {
    return $(window).scroll((_.throttle(function() {
      var l, oh, t;
      t = this.infiniteTrigger;
      oh = document.body.offsetHeight;
      if (t > 1) {
        l = oh - t;
      } else if (t > 0) {
        l = oh * t;
      } else {
        return;
      }
      if ((window.innerHeight + window.scrollY) >= l) {
        if (this.lastPage < this.sess("totalPages")) {
          return this.sess("currentPage", this.lastPage + 1);
        }
      }
    }, this.infiniteRateLimit * 1000)).bind(this));
  };

  Pages.prototype.checkQueue = _.throttle(function() {
    var cp, i, k, neighbors, v, _ref, _results, _results1;
    cp = this.currentPage();
    neighbors = this.neighbors(cp);
    if (!this.received[cp]) {
      this.clearQueue();
      this.requestPage(cp);
      cp = String(cp);
      _ref = this.requested;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        if (k !== cp) {
          if (this.subscriptions[k] != null) {
            this.subscriptions[k].stop();
            delete this.subscriptions[k];
          }
          _results.push(delete this.requested[k]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else if (this.queue.length) {
      _results1 = [];
      while (this.queue.length > 0) {
        i = this.queue.shift();
        if (__indexOf.call(neighbors, i) >= 0) {
          this.requestPage(i);
          break;
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    }
  }, 500);

  Pages.prototype.currentPage = function() {
    if (Meteor.isClient && (this.sess("currentPage") != null)) {
      return this.sess("currentPage");
    } else {
      return this._currentPage;
    }
  };

  Pages.prototype.isReady = function() {
    return this.sess("ready");
  };

  Pages.prototype.ready = function(p) {
    if (p === true || p === this.currentPage() && (typeof Session !== "undefined" && Session !== null)) {
      return this.sess("ready", true);
    }
  };

  Pages.prototype.checkInitPage = function() {
    var _ref, _ref1, _ref2;
    if (this.init) {
      if (this.router) {
        if ((_ref = Router.current()) != null) {
          if ((_ref1 = _ref.route) != null) {
            _ref1.getName();
          }
        }
        try {
          this.initPage = parseInt((_ref2 = Router.current().route.params(location.href)) != null ? _ref2.page : void 0) || 1;
          this.init = false;
        } catch (_error) {
          return;
        }
      } else {
        this.initPage = 1;
        this.init = false;
      }
    }
    this.sess("oldPage", this.initPage);
    return this.sess("currentPage", this.initPage);
  };

  Pages.prototype.getPage = function(page) {
    var c, n, total;
    if (Meteor.isClient) {
      if (page == null) {
        page = this.currentPage();
      }
      page = parseInt(page);
      if (page === NaN) {
        return;
      }
      total = this.sess("totalPages");
      if (total === 0) {
        return this.ready(true);
      }
      if (page <= total) {
        this.requestPage(page);
        this.queueNeighbors(page);
        this.checkQueue();
      }
      if (this.infinite) {
        n = this.PaginatedCollection.find({}, {
          fields: this.fields,
          sort: this.sort
        }).count();
        c = this.PaginatedCollection.find({}, {
          fields: this.fields,
          sort: this.sort,
          skip: this.infiniteItemsLimit !== Infinity && n > this.infiniteItemsLimit ? n - this.infiniteItemsLimit : 0,
          limit: this.infiniteItemsLimit
        });
      } else {
        c = this.PaginatedCollection.find(_.object([["_" + this.id + "_p", page]]), {
          fields: this.fields,
          sort: _.object([["_" + this.id + "_i", 1]])
        });
        c.observeChanges({
          added: (function(_this) {
            return function() {
              return _this.countPages();
            };
          })(this),
          removed: (function(_this) {
            return function() {
              return _this.countPages();
            };
          })(this)
        });
      }
      return c.fetch();
    }
  };

  Pages.prototype.requestPage = function(page) {
    if (!page || this.requested[page] || this.received[page]) {
      return;
    }
    this.logRequest(page);
    return Meteor.defer((function(page) {
      return this.subscriptions[page] = Meteor.subscribe(this.id, page, {
        onReady: (function(page) {
          return this.onPage(page);
        }).bind(this, page),
        onError: (function(_this) {
          return function(e) {
            return _this.error(e.message);
          };
        })(this)
      });
    }).bind(this, page));
  };

  Pages.prototype.onPage = function(page) {
    this.logResponse(page);
    this.ready(page);
    if (this.infinite) {
      this.lastPage = page;
    }
    this.countPages();
    return this.checkQueue();
  };

  return Pages;

})();

Meteor.Pagination = Pages;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['alethes:pages'] = {};

})();

//# sourceMappingURL=alethes_pages.js.map
