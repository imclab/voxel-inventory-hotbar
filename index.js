// Generated by CoffeeScript 1.7.0
(function() {
  var EventEmitter, InventoryHotbarClient, InventoryHotbarCommon, InventoryWindow, ever,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __modulo = function(a, b) { return (a % b + +b) % b; };

  EventEmitter = (require('events')).EventEmitter;

  InventoryWindow = require('inventory-window');

  ever = require('ever');

  module.exports = function(game, opts) {
    if (game.isClient) {
      return new InventoryHotbarClient(game, opts);
    } else {
      return new InventoryHotbarCommon(game, opts);
    }
  };

  module.exports.pluginInfo = {
    loadAfter: ['voxel-carry', 'voxel-registry']
  };

  InventoryHotbarCommon = (function(_super) {
    __extends(InventoryHotbarCommon, _super);

    function InventoryHotbarCommon(game, opts) {
      var _ref;
      this.game = game;
      if (opts == null) {
        opts = {};
      }
      this.inventory = (function() {
        var _ref1, _ref2, _ref3;
        if ((_ref = (_ref1 = (_ref2 = game.plugins) != null ? (_ref3 = _ref2.get('voxel-carry')) != null ? _ref3.inventory : void 0 : void 0) != null ? _ref1 : opts.inventory) != null) {
          return _ref;
        } else {
          throw 'voxel-inventory-hotbar requires "voxel-carry" plugin or "inventory" option set to inventory instance';
        }
      })();
      this.selectedIndex = 0;
    }

    InventoryHotbarCommon.prototype.enable = function() {};

    InventoryHotbarCommon.prototype.disable = function() {};

    InventoryHotbarCommon.prototype.give = function(itemPile) {
      return this.inventory.give(itemPile);
    };

    InventoryHotbarCommon.prototype.take = function(itemPile) {
      return this.inventory.take(itemPile);
    };

    InventoryHotbarCommon.prototype.takeHeld = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.inventory.takeAt(this.selectedIndex, count);
    };

    InventoryHotbarCommon.prototype.held = function() {
      return this.inventory.get(this.selectedIndex);
    };

    return InventoryHotbarCommon;

  })(EventEmitter);

  InventoryHotbarClient = (function(_super) {
    __extends(InventoryHotbarClient, _super);

    function InventoryHotbarClient(game, opts) {
      var container, registry, windowOpts, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.game = game;
      InventoryHotbarClient.__super__.constructor.call(this, this.game, opts);
      this.wheelEnable = (_ref = opts.wheelEnable) != null ? _ref : false;
      this.wheelScale = (_ref1 = opts.wheelScale) != null ? _ref1 : 1.0;
      registry = (_ref2 = game.plugins) != null ? _ref2.get('voxel-registry') : void 0;
      windowOpts = (_ref3 = opts.windowOpts) != null ? _ref3 : {};
      if (registry) {
        if (windowOpts.registry == null) {
          windowOpts.registry = registry;
        }
      }
      if (windowOpts.inventory == null) {
        windowOpts.inventory = this.inventory;
      }
      if (windowOpts.inventorySize == null) {
        windowOpts.inventorySize = (_ref4 = opts.inventorySize) != null ? _ref4 : this.inventory.size();
      }
      if (windowOpts.width == null) {
        windowOpts.width = (_ref5 = opts.width) != null ? _ref5 : windowOpts.inventorySize;
      }
      this.inventoryWindow = new InventoryWindow(windowOpts);
      this.inventoryWindow.selectedIndex = 0;
      container = this.inventoryWindow.createContainer();
      container.style.position = 'fixed';
      container.style.bottom = '0px';
      container.style.zIndex = 5;
      container.style.right = '33%';
      container.style.left = '33%';
      document.body.appendChild(container);
      this.enable();
    }

    InventoryHotbarClient.prototype.enable = function() {
      this.inventoryWindow.container.style.visibility = '';
      if (this.wheelEnable) {
        ever(document.body).on('mousewheel', this.mousewheel = (function(_this) {
          return function(ev) {
            var delta;
            console.log('mousewheel', ev);
            delta = ev.wheelDelta;
            delta /= _this.wheelScale;
            delta = Math.floor(delta);
            _this.selectedIndex += delta;
            _this.selectedIndex = __modulo(_this.selectedIndex, _this.inventoryWindow.width);
            console.log(_this.selectedIndex);
            return _this.inventoryWindow.setSelected(_this.selectedIndex);
          };
        })(this));
      }
      if (this.game.buttons.bindings != null) {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((function(_this) {
          return function(slot) {
            var key, slotName;
            if (slot === 9) {
              key = '0';
            } else {
              key = '' + (slot + 1);
            }
            slotName = 'slot' + (slot + 1);
            _this.game.buttons.bindings[key] = slotName;
            _this.onSlots = {};
            return _this.game.buttons.down.on(slotName, _this.onSlots[key] = function() {
              _this.selectedIndex = slot;
              return _this.inventoryWindow.setSelected(_this.selectedIndex);
            });
          };
        })(this));
      } else {
        this.keydown = (function(_this) {
          return function(ev) {
            var slot, _ref;
            if (('0'.charCodeAt(0) <= (_ref = ev.keyCode) && _ref <= '9'.charCodeAt(0))) {
              slot = ev.keyCode - '0'.charCodeAt(0);
              if (slot === 0) {
                slot = 10;
              }
              slot -= 1;
              _this.selectedIndex = slot;
              return _this.inventoryWindow.setSelected(_this.selectedIndex);
            }
          };
        })(this);
        ever(document.body).on('keydown', this.keydown);
      }
      return InventoryHotbarClient.__super__.enable.call(this);
    };

    InventoryHotbarClient.prototype.disable = function() {
      var key, _i;
      this.inventoryWindow.container.style.visibility = 'hidden';
      if (this.mousewheel != null) {
        ever(document.body).removeListener('mousewheel', this.mousewheel);
      }
      if (this.game.buttons.bindings != null) {
        for (key = _i = 1; _i <= 10; key = ++_i) {
          delete this.game.buttons.bindings[key - 1];
          this.game.buttons.down.removeListener('slot' + key, this.onSlots[key]);
        }
      } else {
        ever(document.body).removeListener('keydown', this.keydown);
      }
      return InventoryHotbarClient.__super__.disable.call(this);
    };

    InventoryHotbarClient.prototype.refresh = function() {
      return this.inventoryWindow.refresh();
    };

    return InventoryHotbarClient;

  })(InventoryHotbarCommon);

}).call(this);
