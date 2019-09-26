"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./ScrollBar.css");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _sizeSensor = require("size-sensor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VERTICAL_DIRECTION = 'vertical';
var HORIZONTAL_DIRECTION = 'horizontal';

var ScrollBar =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ScrollBar, _React$PureComponent);

  function ScrollBar(props) {
    var _this;

    _classCallCheck(this, ScrollBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollBar).call(this, props));
    _this.direction = null;
    _this.cursorDown = false;
    _this.maxHeight = props.maxHeight + 17;
    _this.scrollbarWrapRef = _react.default.createRef();
    _this.scrollbarVerticalThumbRef = _react.default.createRef();
    _this.scrollbarHorizontalThumbRef = _react.default.createRef();
    _this.memoizedStyle = {
      movementY: 0,
      movementX: 0,
      translateY: 0,
      translateX: 0,
      verticalThumbHeight: 0,
      scrollableMaxTranslateY: 0,
      scrollableMaxTranslateX: 0,
      verticalThumbHeightPercentage: 0,
      horizontalThumbWidthPercentage: 0
    };
    _this.computeThumbStyle = _this.computeThumbStyle.bind(_assertThisInitialized(_this));
    _this.handleOnScroll = _this.handleOnScroll.bind(_assertThisInitialized(_this));
    _this.mouseDocumentMoveHandler = _this.mouseDocumentMoveHandler.bind(_assertThisInitialized(_this));
    _this.mouseDocumentUpHandler = _this.mouseDocumentUpHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ScrollBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;

      if (!this.props.noResize) {
        (0, _sizeSensor.bind)(this.scrollbarWrapRef.current, this.computeThumbStyle);
      }

      document.addEventListener('mouseup', this.mouseDocumentUpHandler);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.computeThumbStyle();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", {
        className: "sam-scrollbar"
      }, _react.default.createElement("div", {
        ref: this.scrollbarWrapRef,
        onScroll: this.handleOnScroll,
        style: {
          maxHeight: this.maxHeight
        },
        className: this.getScrollbarWrapClass(this.props)
      }, this.props.children), this.props.disableHorizontal === false && _react.default.createElement("div", {
        className: "sam-scrollbar__bar is-horizontal"
      }, _react.default.createElement("div", {
        ref: this.scrollbarHorizontalThumbRef,
        className: "sam-scrollbar__thumb",
        onMouseDown: function onMouseDown(evt) {
          return _this2.clickTrackHandler(evt, HORIZONTAL_DIRECTION);
        }
      })), this.props.disableVertical === false && _react.default.createElement("div", {
        className: "sam-scrollbar__bar is-vertical"
      }, _react.default.createElement("div", {
        ref: this.scrollbarVerticalThumbRef,
        className: "sam-scrollbar__thumb",
        onMouseDown: function onMouseDown(evt) {
          return _this2.clickTrackHandler(evt, VERTICAL_DIRECTION);
        }
      })));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      this.scrollbarWrapRef.current && (0, _sizeSensor.clear)(this.scrollbarWrapRef.current);
      document.removeEventListener('mouseup', this.mouseDocumentUpHandler);
    }
  }, {
    key: "handleOnScroll",
    value: function handleOnScroll() {
      if (this.scrollbarWrapRef.current === null) {
        return;
      }

      var scrollbarWrap = this.scrollbarWrapRef.current;

      if (this.props.disableVertical === false && this.scrollbarVerticalThumbRef.current) {
        var translateY = scrollbarWrap.scrollTop / scrollbarWrap.clientHeight;
        this.setVerticalThumbStyle(this.scrollbarVerticalThumbRef.current, translateY, this.memoizedStyle.verticalThumbHeightPercentage);
      }

      if (this.props.disableHorizontal === false && this.scrollbarHorizontalThumbRef.current) {
        var translateX = scrollbarWrap.scrollLeft / scrollbarWrap.clientWidth;
        this.setHorizontalThumbStyle(this.scrollbarHorizontalThumbRef.current, translateX, this.memoizedStyle.horizontalThumbWidthPercentage);
      }

      this.props.onScroll && this.props.onScroll(this.scrollbarWrapRef.current);
    }
  }, {
    key: "computeThumbStyle",
    value: function computeThumbStyle() {
      if (this.props.disableVertical === false) {
        this.computeVerticalThumbStyle();
      }

      if (this.props.disableHorizontal === false) {
        this.computeHorizontalThumbStyle();
      }
    }
  }, {
    key: "computeVerticalThumbStyle",
    value: function computeVerticalThumbStyle() {
      if (this.scrollbarWrapRef.current === null) {
        return;
      }

      var scrollbarWrap = this.scrollbarWrapRef.current;
      var verticalScrollbarThumb = this.scrollbarVerticalThumbRef.current;
      var clientHeight = scrollbarWrap.clientHeight,
          scrollHeight = scrollbarWrap.scrollHeight,
          scrollTop = scrollbarWrap.scrollTop;

      if (clientHeight < scrollHeight) {
        var translateY = scrollTop / clientHeight;
        this.memoizedStyle.verticalThumbHeightPercentage = clientHeight / scrollHeight * 100;
        this.memoizedStyle.scrollableMaxTranslateY = (scrollHeight - clientHeight) / clientHeight;
        this.setVerticalThumbStyle(verticalScrollbarThumb, translateY, this.memoizedStyle.verticalThumbHeightPercentage);
      } else {
        this.memoizedStyle.scrollableMaxTranslateY = 0;
        this.memoizedStyle.verticalThumbHeightPercentage = 0;
        this.setVerticalThumbStyle(verticalScrollbarThumb, 0, 0);
      }
    }
  }, {
    key: "setVerticalThumbStyle",
    value: function setVerticalThumbStyle(scrollbarThumb, translateY, thumbHeight) {
      if (scrollbarThumb) {
        scrollbarThumb.setAttribute('style', "transform: translateY(".concat(translateY * 100, "%); height: ").concat(thumbHeight, "%;"));
      }

      this.memoizedStyle.translateY = translateY;
    }
  }, {
    key: "computeHorizontalThumbStyle",
    value: function computeHorizontalThumbStyle() {
      if (this.scrollbarWrapRef.current === null) {
        return;
      }

      var scrollbarWrap = this.scrollbarWrapRef.current;
      var horizontalScrollbarThumb = this.scrollbarHorizontalThumbRef.current;
      var clientWidth = scrollbarWrap.clientWidth,
          scrollWidth = scrollbarWrap.scrollWidth,
          scrollLeft = scrollbarWrap.scrollLeft;

      if (clientWidth < scrollWidth) {
        var translateX = scrollLeft / clientWidth;
        this.memoizedStyle.horizontalThumbWidthPercentage = clientWidth / scrollWidth * 100;
        this.memoizedStyle.scrollableMaxTranslateX = (scrollWidth - clientWidth) / clientWidth;
        this.setHorizontalThumbStyle(horizontalScrollbarThumb, translateX, this.memoizedStyle.horizontalThumbWidthPercentage);
      } else {
        this.memoizedStyle.scrollableMaxTranslateX = 0;
        this.memoizedStyle.horizontalThumbWidthPercentage = 0;
        this.setHorizontalThumbStyle(horizontalScrollbarThumb, 0, 0);
      }
    }
  }, {
    key: "setHorizontalThumbStyle",
    value: function setHorizontalThumbStyle(scrollbarThumb, translateX, thumbWidth) {
      if (scrollbarThumb) {
        scrollbarThumb.setAttribute('style', "transform: translateX(".concat(translateX * 100, "%); width: ").concat(thumbWidth, "%;"));
      }

      this.memoizedStyle.translateX = translateX;
    }
  }, {
    key: "getScrollbarWrapClass",
    value: function getScrollbarWrapClass(props) {
      if (props.disableVertical === false && props.disableHorizontal) {
        return 'sam-scrollbar_vertical__wrap';
      } else if (props.disableVertical && props.disableHorizontal === false) {
        return 'sam-scrollbar_horizontal__wrap';
      }

      return 'sam-scrollbar__wrap';
    }
  }, {
    key: "dragVerticalThumb",
    value: function dragVerticalThumb(evt) {
      this.memoizedStyle.movementY += evt.movementY;
      var scrollbar = this.scrollbarWrapRef.current;
      var translateY = this.memoizedStyle.movementY / this.getRolledHeight(scrollbar);

      if (translateY <= this.memoizedStyle.scrollableMaxTranslateY) {
        scrollbar.scrollTop = scrollbar.clientHeight * translateY;
      } else {
        scrollbar.scrollTop = scrollbar.scrollHeight - scrollbar.clientHeight;
      }
    }
  }, {
    key: "dragHorizontalThumb",
    value: function dragHorizontalThumb(evt) {
      this.memoizedStyle.movementX += evt.movementX;
      var scrollbar = this.scrollbarWrapRef.current;
      var translateX = this.memoizedStyle.movementX / this.getRolledWidth(scrollbar);

      if (translateX <= this.memoizedStyle.scrollableMaxTranslateX) {
        scrollbar.scrollLeft = scrollbar.clientWidth * translateX;
      } else {
        scrollbar.scrollLeft = scrollbar.scrollWidth - scrollbar.clientWidth;
      }
    }
  }, {
    key: "getRolledWidth",
    value: function getRolledWidth(scrollbar) {
      return scrollbar.clientWidth * (scrollbar.clientWidth / scrollbar.scrollWidth);
    }
  }, {
    key: "getRolledHeight",
    value: function getRolledHeight(scrollbar) {
      return scrollbar.clientHeight * (scrollbar.clientHeight / scrollbar.scrollHeight);
    }
  }, {
    key: "clickTrackHandler",
    value: function clickTrackHandler(evt, direct) {
      evt.stopPropagation();
      this.cursorDown = true;
      this.direction = direct;

      if (this.direction === VERTICAL_DIRECTION) {
        this.memoizedStyle.movementY = this.memoizedStyle.translateY * this.getRolledHeight(this.scrollbarWrapRef.current);
      } else {
        this.memoizedStyle.movementX = this.memoizedStyle.translateX * this.getRolledWidth(this.scrollbarWrapRef.current);
      }

      document.onselect = function () {
        return false;
      };

      document.addEventListener('mousemove', this.mouseDocumentMoveHandler);
    }
  }, {
    key: "mouseDocumentMoveHandler",
    value: function mouseDocumentMoveHandler(evt) {
      evt.preventDefault();

      if (this.cursorDown) {
        if (this.direction === VERTICAL_DIRECTION) {
          this.dragVerticalThumb(evt);
        } else {
          this.dragHorizontalThumb(evt);
        }
      }
    }
  }, {
    key: "mouseDocumentUpHandler",
    value: function mouseDocumentUpHandler() {
      this.cursorDown = false;
      document.onselect = null;
      document.removeEventListener('mousemove', this.mouseDocumentUpHandler);
    }
  }]);

  return ScrollBar;
}(_react.default.PureComponent);

exports.default = ScrollBar;
ScrollBar.propTypes = {
  noResize: _propTypes.default.bool,
  maxHeight: _propTypes.default.number,
  disableVertical: _propTypes.default.bool,
  disableHorizontal: _propTypes.default.bool,
  onScroll: _propTypes.default.func
};
ScrollBar.defaultProps = {
  noResize: true,
  maxHeight: 250,
  disableVertical: false,
  disableHorizontal: false
};