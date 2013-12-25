// Generated by CoffeeScript 1.6.3
(function() {
  var EventEmitter, InventoryHotbar, InventoryWindow, ever,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (require('events')).EventEmitter;

  InventoryWindow = require('inventory-window');

  ever = require('ever');

  module.exports = function(game, opts) {
    return new InventoryHotbar(game, opts);
  };

  InventoryHotbar = (function(_super) {
    __extends(InventoryHotbar, _super);

    function InventoryHotbar(game, opts) {
      var container, windowOpts, _ref, _ref1, _ref2, _ref3;
      this.game = game;
      if (opts == null) {
        opts = {};
      }
      this.inventory = (function() {
        if ((_ref = opts.inventory) != null) {
          return _ref;
        } else {
          throw 'voxel-inventory-hotbar requires "inventory" option set to inventory instance';
        }
      })();
      windowOpts = (_ref1 = opts.windowOpts) != null ? _ref1 : {};
      if (windowOpts.inventory == null) {
        windowOpts.inventory = this.inventory;
      }
      if (windowOpts.inventorySize == null) {
        windowOpts.inventorySize = (_ref2 = opts.inventorySize) != null ? _ref2 : this.inventory.size();
      }
      if (windowOpts.width == null) {
        windowOpts.width = (_ref3 = opts.width) != null ? _ref3 : windowOpts.inventorySize;
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

    InventoryHotbar.prototype.enable = function() {
      var _this = this;
      this.inventoryWindow.container.style.visibility = '';
      this.keydown = function(ev) {
        var slot, _ref;
        if (('0'.charCodeAt(0) <= (_ref = ev.keyCode) && _ref <= '9'.charCodeAt(0))) {
          slot = ev.keyCode - '0'.charCodeAt(0);
          if (slot === 0) {
            slot = 10;
          }
          slot -= 1;
          return _this.inventoryWindow.setSelected(slot);
        }
      };
      return ever(document.body).on('keydown', this.keydown);
    };

    InventoryHotbar.prototype.disable = function() {
      this.inventoryWindow.container.style.visibility = 'hidden';
      return ever(document.body).removeListener('keydown', this.keydown);
    };

    InventoryHotbar.prototype.give = function(itemPile) {
      return this.inventory.give(itemPile);
    };

    InventoryHotbar.prototype.take = function(itemPile) {
      return this.inventory.take(itemPile);
    };

    InventoryHotbar.prototype.takeHeld = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.inventory.takeAt(this.inventoryWindow.selectedIndex, count);
    };

    InventoryHotbar.prototype.held = function() {
      return this.inventory.get(this.inventoryWindow.selectedIndex);
    };

    InventoryHotbar.prototype.refresh = function() {
      return this.inventoryWindow.refresh();
    };

    return InventoryHotbar;

  })(EventEmitter);

}).call(this);
