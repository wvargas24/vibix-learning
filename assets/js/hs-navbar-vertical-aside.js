__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HSSideNav; });
/* harmony import */ var _utils_slideUp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/slideUp */ "./src/utils/slideUp.js");
/* harmony import */ var _utils_slideDown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/slideDown */ "./src/utils/slideDown.js");
/* harmony import */ var _utils_getParents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/getParents */ "./src/utils/getParents.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var HSSideNav = /*#__PURE__*/function () {
  function HSSideNav(el, settings) {
    _classCallCheck(this, HSSideNav);

    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    if (!this.$el) return;
    this.defaults = {
      defaultWidth: 0,
      mainContainer: 'body',
      autoscrollToActive: true,
      compactClass: '.navbar-vertical-aside-compact-mode',
      compactMinClass: '.navbar-vertical-aside-compact-mini-mode',
      minClass: '.navbar-vertical-aside-mini-mode',
      closedClass: '.navbar-vertical-aside-closed-mode',
      navbarVertical: '.navbar-vertical-content',
      transitionOnClassName: 'navbar-vertical-aside-transition-on',
      mobileOverlayClass: '.navbar-vertical-aside-mobile-overlay',
      toggleInvokerClass: '.js-navbar-vertical-aside-toggle-invoker',
      subMenuClass: '.js-navbar-vertical-aside-submenu',
      subMenuInvokerClass: '.js-navbar-vertical-aside-menu-link',
      subMenuInvokerActiveClass: '.show',
      hasSubMenuClass: '.navbar-vertical-aside-has-menu',
      subMenuAnimationSpeed: 200,
      subMenuOpenEvent: 'hover',
      showClassNames: {
        xs: 'navbar-vertical-aside-show-xs',
        sm: 'navbar-vertical-aside-show-sm',
        md: 'navbar-vertical-aside-show-md',
        lg: 'navbar-vertical-aside-show-lg',
        xl: 'navbar-vertical-aside-show-xl'
      },
      $showedMenu: null,
      onMini: function onMini() {},
      onFull: function onFull() {},
      onInitialized: function onInitialized() {}
    };
    this.dataSettings = this.$el.hasAttribute('data-hs-navbar-vertical-aside') ? JSON.parse(this.$el.getAttribute('data-hs-navbar-vertical-aside')) : {};
    this.settings = Object.assign({}, this.defaults, this.dataSettings, settings);
    this.openedMenus = [];
    this.items = this.$el.querySelectorAll(this.settings.hasSubMenuClass); // this.topLevels = document.querySelector(this.settings.hasSubMenuClass).parentNode.closest(':not(' + this.settings.subMenuClass + ')').querySelectorAll(`:scope > ${this.settings.hasSubMenuClass}`)

    this.$container = document.querySelector(this.settings.mainContainer);
    this.isMini = this.$container.classList.contains(this.settings.minClass.slice(1));
    this.isCompact = this.$container.classList.contains(this.settings.compactClass.slice(1));
    this.initializedClass = '.navbar-vertical-aside-initialized';
  }

  _createClass(HSSideNav, [{
    key: "init",
    value: function init() {
      var _this = this;

      if (!this.$el) return;
      this.setState();

      if (this.settings.autoscrollToActive) {
        var $active = this.$el.querySelector('.active');

        if ($active) {
          if ($active.getBoundingClientRect().y > document.querySelector(this.settings.navbarVertical).getBoundingClientRect().height) {
            setTimeout(function () {
              $active.scrollIntoView({
                behavior: 'smooth'
              });
            }, 100);
          }
        }
      } // Click events


      document.addEventListener('click', function (e) {
        // Toggle aside menu
        if (e.target.closest(_this.settings.toggleInvokerClass)) {
          _this.toggleSidebar();
        }
      }); // Rebuild states for aside menu on resizing

      window.addEventListener('resize', function () {
        if (window.innerWidth !== _this.defaultWidth) {
          _this.setState();
        }
      });
      var collapseElementList = [].slice.call(document.querySelectorAll('.nav-collapse'));
      this.collapseList = collapseElementList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl, {
          toggle: false
        });
      });
      var $mainContainer = document.querySelector(this.settings.mainContainer);
      this.topLevelElements = collapseElementList.filter(function (collapseEl) {
        return Object(_utils_getParents__WEBPACK_IMPORTED_MODULE_2__["default"])(collapseEl, '.nav-collapse').length === 1;
      }); // Toggle sub menus on hover

      var timeOut = null;

      if (this.settings.subMenuOpenEvent === 'hover') {
        this.collapseList.forEach(function (collapse) {
          Array.from([collapse._element, collapse._element.previousElementSibling]).forEach(function ($el) {
            $el.addEventListener('mouseenter', function (e) {
              if (!$mainContainer.classList.contains(_this.settings.minClass.slice(1)) && !_this.isCompact) return;
              clearTimeout(timeOut);

              if (_this.topLevelElements.includes(collapse._element)) {
                collapse.show();
              }
            });
            $el.addEventListener('mouseleave', function (e) {
              if (!$mainContainer.classList.contains(_this.settings.minClass.slice(1)) && !_this.isCompact) return;

              if (_this.topLevelElements.includes($el.parentElement.querySelector('.nav-collapse'))) {
                timeOut = setTimeout(function () {
                  collapse.hide();
                }, 200);
              }
            });
          });
        });
      }

      function prepareParentsTargetID($menu) {
        var id = $menu.getAttribute('id');
        $menu.querySelectorAll('.nav-collapse').forEach(function ($subMenu) {
          if (id && !$subMenu.hasAttribute('hs-parent-area')) {
            $subMenu.setAttribute('hs-parent-area', "#".concat(id));
            prepareParentsTargetID($subMenu);
          }
        });
      }

      prepareParentsTargetID(document.querySelector('#navbarVerticalMenu'));
      this.collapseList.forEach(function (collapse) {
        collapse._element.addEventListener('show.bs.collapse', function (e) {
          var trigeredEl = e.target,
              parentEl = e.target.hasAttribute('hs-parent-area') ? document.querySelector(e.target.getAttribute('hs-parent-area')) : null;
          trigeredEl.previousElementSibling.setAttribute('aria-expanded', true); // Remove animation on mobile

          if (($mainContainer.classList.contains(_this.settings.minClass.slice(1)) || _this.isCompact) && _this.topLevelElements.includes(trigeredEl)) {
            e.preventDefault();

            _this.setPosition(trigeredEl, trigeredEl.previousElementSibling);

            trigeredEl.style.height = 'auto';
            trigeredEl.classList.add('show');
          } // Check if menu is outside of the screen


          setTimeout(function () {
            if (($mainContainer.classList.contains(_this.settings.minClass.slice(1)) || _this.isCompact) && parentEl && parentEl.offsetHeight + parentEl.offsetTop > window.innerHeight) {
              var distance = parentEl.offsetHeight + parentEl.offsetTop - window.innerHeight;
              parentEl.style.top = parentEl.offsetTop - distance + 'px';
              parentEl.style.transition = '.4s';
              setTimeout(function () {
                parentEl.style.transition = 'unset';
              }, 400);
            }
          }, 500); // Close others submenu

          _this.collapseList.forEach(function (collapse) {
            var collapseEl = collapse._element;
            if (collapseEl === trigeredEl) return;
            var triggeredArea = trigeredEl.getAttribute('hs-parent-area'),
                collapseArea = collapseEl.getAttribute('hs-parent-area');

            if (collapseEl && triggeredArea ? collapseArea === triggeredArea : false) {
              collapse.hide();
              collapseEl.classList.remove('nav-collapse-action-mobile');
              collapseEl.previousElementSibling.setAttribute('aria-expanded', false);
            }
          });
        });

        collapse._element.addEventListener('hide.bs.collapse', function (e) {
          var trigeredEl = e.target;
          trigeredEl.classList.remove('nav-collapse-action-mobile');
          trigeredEl.previousElementSibling.setAttribute('aria-expanded', false); // Remove animation on mobile

          if (($mainContainer.classList.contains(_this.settings.minClass.slice(1)) || _this.isCompact) && _this.topLevelElements.includes(trigeredEl)) {
            trigeredEl.style.opacity = 0;
            setTimeout(function () {
              trigeredEl.style.opacity = 1;
            }, 400);
          } // Collapse all sub menus


          trigeredEl.querySelectorAll('.nav-collapse').forEach(function ($menu) {
            var collapse = _this.collapseList.find(function (collapse) {
              return collapse._element === $menu;
            });

            if (collapse) collapse.hide(false);
          });
        });
      }); // Add overlay for mobile

      var $sideNavOverlay = document.createElement('div');
      $sideNavOverlay.classList.add(this.settings.toggleInvokerClass.slice(1), this.settings.mobileOverlayClass.slice(1));
      document.body.appendChild($sideNavOverlay); // Add transition state

      this.$el.addEventListener('transitionend', function () {
        document.querySelector(_this.settings.mainContainer).classList.remove(_this.settings.transitionOnClassName);
      }); // Done initializing

      this.$el.classList.add(this.initializedClass.slice(1));
      document.querySelectorAll(this.settings.toggleInvokerClass).forEach(function (el) {
        return el.style.opacity = 1;
      });
      setTimeout(function () {
        _this.settings.onInitialized();
      });
    }
  }, {
    key: "toggleOnHover",
    value: function toggleOnHover(e, menu) {
      var collapse = this.collapseList.find(function (collapse) {
        return collapse._element.previousElementSibling === e.target && collapse._element === menu;
      });

      if (collapse) {
        collapse.toggle();
      }
    }
  }, {
    key: "setState",
    value: function setState() {
      this.defaultWidth = window.innerWidth;
      var isClosed = this.showResolutionChecking(),
          mini = this.isMini || this.isCompact ? true : false;

      if (isClosed) {
        this.sidebarToggleClass = this.settings.closedClass;
        this.$container.classList.add(this.settings.closedClass.slice(1));

        if (!mini) {
          this.$container.classList.remove(this.settings.minClass.slice(1));
        }
      } else {
        this.sidebarToggleClass = this.settings.minClass;
        this.$container.classList.remove(this.settings.closedClass.slice(1));
      } // If mini mode, add save active item and remove show class to hide it


      if (mini) {
        this.settings.$showedMenu = document.querySelector('.nav-collapse.show');

        if (this.settings.$showedMenu) {
          this.settings.$showedMenu.classList.remove('show');
        }
      }
    }
  }, {
    key: "showResolutionChecking",
    value: function showResolutionChecking() {
      if (this.$container.classList.contains(this.settings.showClassNames.xs) && window.innerWidth <= 0) {
        return true;
      } else if (this.$container.classList.contains(this.settings.showClassNames.sm) && window.innerWidth <= 576) {
        return true;
      } else if (this.$container.classList.contains(this.settings.showClassNames.md) && window.innerWidth <= 768) {
        return true;
      } else if (this.$container.classList.contains(this.settings.showClassNames.lg) && window.innerWidth <= 992) {
        return true;
      } else if (this.$container.classList.contains(this.settings.showClassNames.xl) && window.innerWidth <= 1200) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "toggleSubMenu",
    value: function toggleSubMenu($invoker) {
      var _this2 = this;

      if (!$invoker) return null; // Prepare variables

      var collapseOthers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true,
          $menu = $invoker.querySelector(this.settings.subMenuClass),
          $mainContainer = document.querySelector(this.settings.mainContainer),
          allExcludeTarget = _toConsumableArray($invoker.parentNode.querySelectorAll(":scope > ".concat(this.settings.hasSubMenuClass))).filter(function ($item) {
        return $item !== $invoker;
      }),
          onAction = $mainContainer.classList.contains(this.settings.transitionOnClassName),
          topLevel = !$invoker.parentNode.classList.contains(this.settings.subMenuClass.slice(1)),
          mini = $mainContainer.classList.contains(this.settings.minClass.slice(1)) || $mainContainer.classList.contains(this.settings.compactMinClass.slice(1)) ? true : false,
          parentMenu = $invoker; // Close excluded targets


      if (collapseOthers && onAction || collapseOthers && topLevel && mini) {
        allExcludeTarget.reduce(function (acc, $item) {
          return acc = [].concat(_toConsumableArray(acc), _toConsumableArray($item.querySelectorAll(_this2.settings.subMenuClass)));
        }, []).forEach(function ($item) {
          $item.style.display = 'none';
          $item.parentNode.classList.remove(_this2.settings.subMenuInvokerActiveClass.slice(1));
        });
      } else if (collapseOthers) {
        allExcludeTarget.reduce(function (acc, $item) {
          return acc = [].concat(_toConsumableArray(acc), _toConsumableArray($item.querySelectorAll(_this2.settings.subMenuClass)));
        }, []).forEach(function ($item) {
          Object(_utils_slideUp__WEBPACK_IMPORTED_MODULE_0__["default"])($item, _this2.settings.subMenuAnimationSpeed).parentNode.classList.remove(_this2.settings.subMenuInvokerActiveClass.slice(1));
        });
      } // Close sub menu immediately


      if (onAction || topLevel && mini) {
        $menu.style.transition = 'unset';

        if (window.getComputedStyle($menu).display === 'none') {
          $menu.style.display = 'block';
        } else {
          $menu.style.display = 'none';
        }
      } // Close sub menu with animation
      else {
          while (parentMenu.parentNode.classList.contains(this.settings.subMenuClass.slice(1))) {
            parentMenu = parentMenu.parentNode;
          }

          if (window.getComputedStyle($menu).display === 'none') {
            Object(_utils_slideDown__WEBPACK_IMPORTED_MODULE_1__["default"])($menu, this.settings.subMenuAnimationSpeed);
          } else {
            Object(_utils_slideUp__WEBPACK_IMPORTED_MODULE_0__["default"])($menu, this.settings.subMenuAnimationSpeed);
          }

          if (mini) {
            setTimeout(function () {
              if (parentMenu.offsetHeight + parentMenu.offsetTop > window.innerHeight) {
                var distance = parentMenu.offsetHeight + parentMenu.offsetTop - window.innerHeight;
                parentMenu.style.top = parentMenu.offsetTop - distance + 'px';
                parentMenu.style.transition = '.4s';
              }
            }, this.settings.subMenuAnimationSpeed);
          }
        } // Toggle Class


      $invoker.classList.contains(this.settings.subMenuInvokerActiveClass.slice(1)) ? $invoker.classList.remove(this.settings.subMenuInvokerActiveClass.slice(1)) : $invoker.classList.add(this.settings.subMenuInvokerActiveClass.slice(1)); // Smart position

      if ($menu.offsetParent) {
        this.setPosition($menu, $invoker);
        document.querySelector('.navbar-vertical-container').addEventListener('scroll', function () {
          _this2.setPosition($menu, $invoker);
        }, 1000);
      }

      return $invoker;
    }
  }, {
    key: "toggleSidebar",
    value: function toggleSidebar() {
      console.log(123); // Get opened menus

      var notHidden = function notHidden(els) {
        return _toConsumableArray(els).filter(function ($el) {
          return window.getComputedStyle($el).display !== 'none';
        });
      };

      var $mainContainer = document.querySelector(this.settings.mainContainer);
      $mainContainer.classList.add(this.settings.transitionOnClassName); // Toggle class

      $mainContainer.classList.contains(this.sidebarToggleClass.slice(1)) ? $mainContainer.classList.remove(this.sidebarToggleClass.slice(1)) : $mainContainer.classList.add(this.sidebarToggleClass.slice(1)); // Toggle aside

      if ($mainContainer.classList.contains(this.sidebarToggleClass.slice(1))) {
        $mainContainer.classList.add(this.settings.minClass.slice(1));
      } else {
        $mainContainer.classList.remove(this.settings.minClass.slice(1));
      } // Additional for plugin


      if (!this.showResolutionChecking() && $mainContainer.classList.contains(this.settings.minClass.slice(1)) || this.showResolutionChecking() && $mainContainer.classList.contains(this.settings.closedClass.slice(1))) {
        this.settings.onMini();
        window.localStorage.setItem('hs-navbar-vertical-aside-mini', false);
      } else {
        this.settings.onFull();
        window.localStorage.removeItem('hs-navbar-vertical-aside-mini');
      } // Close/Open sub menus


      if ($mainContainer.classList.contains(this.settings.minClass.slice(1)) || this.isCompact) {
        var $menu = document.querySelector('.nav-collapse.show');
        if (!$menu) return;
        $menu.classList.remove('show');
        $menu.classList.add('nav-collapse-action-mobile');
        var collapse = this.collapseList.find(function (collapse) {
          return collapse._element === $menu;
        });
        collapse.hide();
      } else {
        // If the mini mod is enabled, when expand the sidebar, a menu will open with an active item
        if (this.settings.$showedMenu) {
          this.settings.$showedMenu.classList.add('show');
          this.settings.$showedMenu = null;
        }

        document.querySelectorAll('.nav-collapse-action-mobile').forEach(function ($item) {
          $item.classList.remove('nav-collapse-action-mobile');
          $item.classList.add('show');
          document.querySelectorAll('.nav-collapse.show').forEach(function ($menu) {
            $menu.classList.add('show');
          });
        });
        document.querySelectorAll('.nav-collapse').forEach(function ($item) {
          $item.style.top = 0;
        });
      }
    }
  }, {
    key: "setPosition",
    value: function setPosition($menu, $invoker) {
      $menu.classList.add('nav-collapse-action-mobile');
      $menu.style.top = $invoker.getBoundingClientRect().top + 'px';
      setTimeout(function () {
        if ($menu.offsetHeight + $menu.offsetTop > window.innerHeight) {
          var distance = $menu.offsetHeight + $menu.offsetTop - window.innerHeight;
          $menu.style.top = $invoker.offsetTop - distance + 'px';
        }
      });
    }
  }]);

  return HSSideNav;
}();



//# sourceURL=webpack://HSSideNav/./src/hs-navbar-vertical-aside.js?