import './ScrollBar.css'
import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {bind, clear} from 'size-sensor'

ScrollBar_function.propTypes = {
    noResize: PropTypes.bool,
    maxHeight: PropTypes.number,
    disableVertical: PropTypes.bool,
    disableHorizontal: PropTypes.bool
};

ScrollBar_function.defaultProps = {
    noResize: true,
    maxHeight: 250,
    disableVertical: false,
    disableHorizontal: false
};

const VERTICAL_DIRECTION = 'vertical';
const HORIZONTAL_DIRECTION = 'horizontal';

function ScrollBar_function(props) {
    let cursorDown = false;
    let direction = null;
    const maxHeight = (props.maxHeight) + 17;
    const scrollbarWrapRef = React.createRef();
    const scrollbarVerticalThumbRef = React.createRef();
    const scrollbarHorizontalThumbRef = React.createRef();
    const memoizedStyle = {
        movementY: 0,
        movementX: 0,
        translateY: 0,
        translateX: 0,
        verticalThumbHeight: 0,
        scrollableMaxTranslateY: 0,
        scrollableMaxTranslateX: 0,
        verticalThumbHeightPercentage: 0,
        horizontalThumbWidthPercentage: 0,
    };

    function computeVerticalThumbStyle() {
        if (scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = scrollbarWrapRef.current;
        const verticalScrollbarThumb = scrollbarVerticalThumbRef.current;
        const {clientHeight, scrollHeight, scrollTop} = scrollbarWrap;
        if (clientHeight < scrollHeight) {
            const translateY = scrollTop / clientHeight;
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
            scrollbarThumb.setAttribute('style', `transform: translateY(${translateY * 100}%); height: ${thumbHeight}%;`);
        }
        memoizedStyle.translateY = translateY;
    }

    function computeHorizontalThumbStyle() {
        if (scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = scrollbarWrapRef.current;
        const horizontalScrollbarThumb = scrollbarHorizontalThumbRef.current;
        const {clientWidth, scrollWidth, scrollLeft} = scrollbarWrap;
        if (clientWidth < scrollWidth) {
            const translateX = scrollLeft / clientWidth;
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
            scrollbarThumb.setAttribute('style', `transform: translateX(${translateX * 100}%); width: ${thumbWidth}%;`);
        }
        memoizedStyle.translateX = translateX;
    }

    function handleOnScroll() {
        if (scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = scrollbarWrapRef.current;
        if (props.disableVertical === false && scrollbarVerticalThumbRef.current) {
            const translateY = scrollbarWrap.scrollTop / scrollbarWrap.clientHeight;
            setVerticalThumbStyle(scrollbarVerticalThumbRef.current, translateY, memoizedStyle.verticalThumbHeightPercentage);
        }
        if (props.disableHorizontal === false && scrollbarHorizontalThumbRef.current) {
            const translateX = scrollbarWrap.scrollLeft / scrollbarWrap.clientWidth;
            setHorizontalThumbStyle(scrollbarHorizontalThumbRef.current, translateX, memoizedStyle.horizontalThumbWidthPercentage)
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
            return 'sam-scrollbar_horizontal__wrap'
        }
        return 'sam-scrollbar__wrap'
    }

    function dragVerticalThumb(evt) {
        memoizedStyle.movementY += evt.movementY;
        const scrollbar = scrollbarWrapRef.current;
        const translateY = memoizedStyle.movementY / getRolledHeight(scrollbar);
        if (translateY <= memoizedStyle.scrollableMaxTranslateY) {
            scrollbar.scrollTop = scrollbar.clientHeight * translateY;
        } else {
            scrollbar.scrollTop = scrollbar.scrollHeight - scrollbar.clientHeight;
        }
    }

    function dragHorizontalThumb(evt) {
        memoizedStyle.movementX += evt.movementX;
        const scrollbar = scrollbarWrapRef.current;
        const translateX = memoizedStyle.movementX / getRolledWidth(scrollbar);
        if (translateX <= memoizedStyle.scrollableMaxTranslateX) {
            scrollbar.scrollLeft = scrollbar.clientWidth * translateX;
        } else {
            scrollbar.scrollLeft = scrollbar.scrollWidth - scrollbar.clientWidth;
        }
    }

    function getRolledWidth(scrollbar) {
        return scrollbar.clientWidth * (scrollbar.clientWidth / scrollbar.scrollWidth)
    }

    function getRolledHeight(scrollbar) {
        return scrollbar.clientHeight * (scrollbar.clientHeight / scrollbar.scrollHeight)
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
        document.onselect = () => false;
        document.addEventListener('mousemove', mouseDocumentMoveHandler);
    }

    function mouseDocumentMoveHandler(evt) {
        if (cursorDown) {
            if (direction === VERTICAL_DIRECTION) {
                dragVerticalThumb(evt)
            } else {
                dragHorizontalThumb(evt)
            }
        }
    }

    function mouseDocumentUpHandler() {
        cursorDown = false;
        document.onselect = null;
        document.removeEventListener('mousemove', mouseDocumentUpHandler);
    }

    useEffect(() => {
        bind(scrollbarWrapRef.current, computeThumbStyle);
        document.addEventListener('mouseup', mouseDocumentUpHandler);

        return function () {
            scrollbarWrapRef.current && clear(scrollbarWrapRef.current);
            document.removeEventListener('mouseup', mouseDocumentUpHandler);
        }
    });


    useEffect(() => {
        computeThumbStyle();
    });

    return (
        <div className="sam-scrollbar">
            <div ref={scrollbarWrapRef}
                 onScroll={handleOnScroll}
                 style={{maxHeight: maxHeight}}
                 className={getScrollbarWrapClass(props)}>
                {props.children}
            </div>
            {
                props.disableHorizontal === false &&
                <div className="sam-scrollbar__bar is-horizontal">
                    <div ref={scrollbarHorizontalThumbRef}
                         className="sam-scrollbar__thumb"
                         onMouseDown={evt => clickTrackHandler(evt, HORIZONTAL_DIRECTION)}/>
                </div>
            }
            {
                props.disableVertical === false &&
                <div className="sam-scrollbar__bar is-vertical">
                    <div ref={scrollbarVerticalThumbRef}
                         className="sam-scrollbar__thumb"
                         onMouseDown={evt => clickTrackHandler(evt, VERTICAL_DIRECTION)}/>
                </div>
            }
        </div>
    )
}

export default ScrollBar_function;
