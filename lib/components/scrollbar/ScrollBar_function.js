"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./ScrollBar.css");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _sizeSensor = require("size-sensor");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ScrollBar_function.propTypes = {
  noResize: _propTypes.default.bool,
  maxHeight: _propTypes.default.number,
  disableVertical: _propTypes.default.bool,
  disableHorizontal: _propTypes.default.bool
};
ScrollBar_function.defaultProps = {
  noResize: true,
  maxHeight: 250,
  disableVertical: false,
  disableHorizontal: false
};
var VERTICAL_DIRECTION = 'vertical';
var HORIZONTAL_DIRECTION = 'horizontal';

function ScrollBar_function(props) {
  var cursorDown = false;
  var direction = null;
  var maxHeight = props.maxHeight + 17;

  var scrollbarWrapRef = _react.default.createRef();

  var scrollbarVerticalThumbRef = _react.default.createRef();

  var scrollbarHorizontalThumbRef = _react.default.createRef();

  var memoizedStyle = {
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

  function computeVerticalThumbStyle() {
    if (scrollbarWrapRef.current === null) {
      return;
    }

    var scrollbarWrap = scrollbarWrapRef.current;
    var verticalScrollbarThumb = scrollbarVerticalThumbRef.current;
    var clientHeight = scrollbarWrap.clientHeight,
        scrollHeight = scrollbarWrap.scrollHeight,
        scrollTop = scrollbarWrap.scrollTop;

    if (clientHeight < scrollHeight) {
      var translateY = scrollTop / clientHeight;
      memoizedStyle.verticalThumbHeightPercentage = clientHeight / scrollHeight * 100;
      memoizedStyle.scrollableMaxTranslateY = (scrollHeight - clientHeight) / clientHeight;
      setVerticalThumbStyle(verticalScrollbarThumb, translateY, memoizedStyle.verticalThumbHeightPercentage);
    } else {
      memoizedStyle.scrollableMaxTranslateY = 0;
      memoizedStyle.verticalThumbHeightPercentage = 0;
      setVerticalThumbStyle(verticalScrollbarThumb, 0, 0);
    }
  }

  function setVerticalThumbStyle(scrollbarThumb, translateY, thumbHeight) {
    if (scrollbarThumb) {
      scrollbarThumb.setAttribute('style', "transform: translateY(".concat(translateY * 100, "%); height: ").concat(thumbHeight, "%;"));
    }

    memoizedStyle.translateY = translateY;
  }

  function computeHorizontalThumbStyle() {
    if (scrollbarWrapRef.current === null) {
      return;
    }

    var scrollbarWrap = scrollbarWrapRef.current;
    var horizontalScrollbarThumb = scrollbarHorizontalThumbRef.current;
    var clientWidth = scrollbarWrap.clientWidth,
        scrollWidth = scrollbarWrap.scrollWidth,
        scrollLeft = scrollbarWrap.scrollLeft;

    if (clientWidth < scrollWidth) {
      var translateX = scrollLeft / clientWidth;
      memoizedStyle.horizontalThumbWidthPercentage = clientWidth / scrollWidth * 100;
      memoizedStyle.scrollableMaxTranslateX = (scrollWidth - clientWidth) / clientWidth;
      setHorizontalThumbStyle(horizontalScrollbarThumb, translateX, memoizedStyle.horizontalThumbWidthPercentage);
    } else {
      memoizedStyle.scrollableMaxTranslateX = 0;
      memoizedStyle.horizontalThumbWidthPercentage = 0;
      setHorizontalThumbStyle(horizontalScrollbarThumb, 0, 0);
    }
  }

  function setHorizontalThumbStyle(scrollbarThumb, translateX, thumbWidth) {
    if (scrollbarThumb) {
      scrollbarThumb.setAttribute('style', "transform: translateX(".concat(translateX * 100, "%); width: ").concat(thumbWidth, "%;"));
    }

    memoizedStyle.translateX = translateX;
  }

  function handleOnScroll() {
    if (scrollbarWrapRef.current === null) {
      return;
    }

    var scrollbarWrap = scrollbarWrapRef.current;

    if (props.disableVertical === false && scrollbarVerticalThumbRef.current) {
      var translateY = scrollbarWrap.scrollTop / scrollbarWrap.clientHeight;
      setVerticalThumbStyle(scrollbarVerticalThumbRef.current, translateY, memoizedStyle.verticalThumbHeightPercentage);
    }

    if (props.disableHorizontal === false && scrollbarHorizontalThumbRef.current) {
      var translateX = scrollbarWrap.scrollLeft / scrollbarWrap.clientWidth;
      setHorizontalThumbStyle(scrollbarHorizontalThumbRef.current, translateX, memoizedStyle.horizontalThumbWidthPercentage);
    }
  }

  function computeThumbStyle() {
    if (props.disableVertical === false) {
      computeVerticalThumbStyle();
    }

    if (props.disableHorizontal === false) {
      computeHorizontalThumbStyle();
    }
  }

  function getScrollbarWrapClass(props) {
    if (props.disableVertical === false && props.disableHorizontal) {
      return 'sam-scrollbar_vertical__wrap';
    } else if (props.disableVertical && props.disableHorizontal === false) {
      return 'sam-scrollbar_horizontal__wrap';
    }

    return 'sam-scrollbar__wrap';
  }

  function dragVerticalThumb(evt) {
    memoizedStyle.movementY += evt.movementY;
    var scrollbar = scrollbarWrapRef.current;
    var translateY = memoizedStyle.movementY / getRolledHeight(scrollbar);

    if (translateY <= memoizedStyle.scrollableMaxTranslateY) {
      scrollbar.scrollTop = scrollbar.clientHeight * translateY;
    } else {
      scrollbar.scrollTop = scrollbar.scrollHeight - scrollbar.clientHeight;
    }
  }

  function dragHorizontalThumb(evt) {
    memoizedStyle.movementX += evt.movementX;
    var scrollbar = scrollbarWrapRef.current;
    var translateX = memoizedStyle.movementX / getRolledWidth(scrollbar);

    if (translateX <= memoizedStyle.scrollableMaxTranslateX) {
      scrollbar.scrollLeft = scrollbar.clientWidth * translateX;
    } else {
      scrollbar.scrollLeft = scrollbar.scrollWidth - scrollbar.clientWidth;
    }
  }

  function getRolledWidth(scrollbar) {
    return scrollbar.clientWidth * (scrollbar.clientWidth / scrollbar.scrollWidth);
  }

  function getRolledHeight(scrollbar) {
    return scrollbar.clientHeight * (scrollbar.clientHeight / scrollbar.scrollHeight);
  }

  function clickTrackHandler(evt, direct) {
    evt.stopPropagation();
    cursorDown = true;
    direction = direct;

    if (direction === VERTICAL_DIRECTION) {
      memoizedStyle.movementY = memoizedStyle.translateY * getRolledHeight(scrollbarWrapRef.current);
    } else {
      memoizedStyle.movementX = memoizedStyle.translateX * getRolledWidth(scrollbarWrapRef.current);
    }

    document.onselect = function () {
      return false;
    };

    document.addEventListener('mousemove', mouseDocumentMoveHandler);
  }

  function mouseDocumentMoveHandler(evt) {
    if (cursorDown) {
      if (direction === VERTICAL_DIRECTION) {
        dragVerticalThumb(evt);
      } else {
        dragHorizontalThumb(evt);
      }
    }
  }

  function mouseDocumentUpHandler() {
    cursorDown = false;
    document.onselect = null;
    document.removeEventListener('mousemove', mouseDocumentUpHandler);
  }

  (0, _react.useEffect)(function () {
    (0, _sizeSensor.bind)(scrollbarWrapRef.current, computeThumbStyle);
    document.addEventListener('mouseup', mouseDocumentUpHandler);
    return function () {
      scrollbarWrapRef.current && (0, _sizeSensor.clear)(scrollbarWrapRef.current);
      document.removeEventListener('mouseup', mouseDocumentUpHandler);
    };
  });
  (0, _react.useEffect)(function () {
    computeThumbStyle();
  });
  return _react.default.createElement("div", {
    className: "sam-scrollbar"
  }, _react.default.createElement("div", {
    ref: scrollbarWrapRef,
    onScroll: handleOnScroll,
    style: {
      maxHeight: maxHeight
    },
    className: getScrollbarWrapClass(props)
  }, props.children), props.disableHorizontal === false && _react.default.createElement("div", {
    className: "sam-scrollbar__bar is-horizontal"
  }, _react.default.createElement("div", {
    ref: scrollbarHorizontalThumbRef,
    className: "sam-scrollbar__thumb",
    onMouseDown: function onMouseDown(evt) {
      return clickTrackHandler(evt, HORIZONTAL_DIRECTION);
    }
  })), props.disableVertical === false && _react.default.createElement("div", {
    className: "sam-scrollbar__bar is-vertical"
  }, _react.default.createElement("div", {
    ref: scrollbarVerticalThumbRef,
    className: "sam-scrollbar__thumb",
    onMouseDown: function onMouseDown(evt) {
      return clickTrackHandler(evt, VERTICAL_DIRECTION);
    }
  })));
}

var _default = ScrollBar_function;
exports.default = _default;