import './ScrollBar.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bind, clear} from 'size-sensor'

const VERTICAL_DIRECTION = 'vertical';
const HORIZONTAL_DIRECTION = 'horizontal';

export default class ScrollBar extends React.PureComponent <> {

    constructor(props) {
        super(props);

        this.direction = null;
        this.cursorDown = false;
        this.maxHeight = (props.maxHeight) + 17;
        this.scrollbarWrapRef = React.createRef();
        this.scrollbarVerticalThumbRef = React.createRef();
        this.scrollbarHorizontalThumbRef = React.createRef();
        this.memoizedStyle = {
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
        this.computeThumbStyle = this.computeThumbStyle.bind(this)
        this.handleOnScroll = this.handleOnScroll.bind(this);
        this.mouseDocumentMoveHandler = this.mouseDocumentMoveHandler.bind(this);
        this.mouseDocumentUpHandler = this.mouseDocumentUpHandler.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.props.noResize) {
            bind(this.scrollbarWrapRef.current, this.computeThumbStyle);
        }
        document.addEventListener('mouseup', this.mouseDocumentUpHandler);
    }

    componentDidUpdate() {
        this.computeThumbStyle();
    }

    render() {
        return (
            <div className="sam-scrollbar">
                <div ref={this.scrollbarWrapRef}
                     onScroll={this.handleOnScroll}
                     style={{maxHeight: this.maxHeight}}
                     className={this.getScrollbarWrapClass(this.props)}>
                    {this.props.children}
                </div>
                {
                    this.props.disableHorizontal === false &&
                    <div className="sam-scrollbar__bar is-horizontal">
                        <div ref={this.scrollbarHorizontalThumbRef}
                             className="sam-scrollbar__thumb"
                             onMouseDown={evt => this.clickTrackHandler(evt, HORIZONTAL_DIRECTION)}/>
                    </div>
                }
                {
                    this.props.disableVertical === false &&
                    <div className="sam-scrollbar__bar is-vertical">
                        <div ref={this.scrollbarVerticalThumbRef}
                             className="sam-scrollbar__thumb"
                             onMouseDown={evt => this.clickTrackHandler(evt, VERTICAL_DIRECTION)}/>
                    </div>
                }
            </div>
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.scrollbarWrapRef.current && clear(this.scrollbarWrapRef.current);
        document.removeEventListener('mouseup', this.mouseDocumentUpHandler);
    }

    handleOnScroll() {
        if (this.scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = this.scrollbarWrapRef.current;
        if (this.props.disableVertical === false && this.scrollbarVerticalThumbRef.current) {
            const translateY = scrollbarWrap.scrollTop / scrollbarWrap.clientHeight;
            this.setVerticalThumbStyle(this.scrollbarVerticalThumbRef.current, translateY, this.memoizedStyle.verticalThumbHeightPercentage);
        }
        if (this.props.disableHorizontal === false && this.scrollbarHorizontalThumbRef.current) {
            const translateX = scrollbarWrap.scrollLeft / scrollbarWrap.clientWidth;
            this.setHorizontalThumbStyle(this.scrollbarHorizontalThumbRef.current, translateX, this.memoizedStyle.horizontalThumbWidthPercentage)
        }
        this.props.onScroll && this.props.onScroll(this.scrollbarWrapRef.current);
    }

    computeThumbStyle() {
        if (this.props.disableVertical === false) {
            this.computeVerticalThumbStyle();
        }
        if (this.props.disableHorizontal === false) {
            this.computeHorizontalThumbStyle();
        }
    }

    computeVerticalThumbStyle() {
        if (this.scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = this.scrollbarWrapRef.current;
        const verticalScrollbarThumb = this.scrollbarVerticalThumbRef.current;
        const {clientHeight, scrollHeight, scrollTop} = scrollbarWrap;
        if (clientHeight < scrollHeight) {
            const translateY = scrollTop / clientHeight;
            this.memoizedStyle.verticalThumbHeightPercentage = clientHeight / scrollHeight * 100;
            this.memoizedStyle.scrollableMaxTranslateY = (scrollHeight - clientHeight) / clientHeight;
            this.setVerticalThumbStyle(verticalScrollbarThumb, translateY, this.memoizedStyle.verticalThumbHeightPercentage);
        } else {
            this.memoizedStyle.scrollableMaxTranslateY = 0;
            this.memoizedStyle.verticalThumbHeightPercentage = 0;
            this.setVerticalThumbStyle(verticalScrollbarThumb, 0, 0);
        }
    }

    setVerticalThumbStyle(scrollbarThumb, translateY, thumbHeight) {
        if (scrollbarThumb) {
            scrollbarThumb.setAttribute('style', `transform: translateY(${translateY * 100}%); height: ${thumbHeight}%;`);
        }
        this.memoizedStyle.translateY = translateY;
    }

    computeHorizontalThumbStyle() {
        if (this.scrollbarWrapRef.current === null) {
            return;
        }

        const scrollbarWrap = this.scrollbarWrapRef.current;
        const horizontalScrollbarThumb = this.scrollbarHorizontalThumbRef.current;
        const {clientWidth, scrollWidth, scrollLeft} = scrollbarWrap;
        if (clientWidth < scrollWidth) {
            const translateX = scrollLeft / clientWidth;
            this.memoizedStyle.horizontalThumbWidthPercentage = clientWidth / scrollWidth * 100;
            this.memoizedStyle.scrollableMaxTranslateX = (scrollWidth - clientWidth) / clientWidth;
            this.setHorizontalThumbStyle(horizontalScrollbarThumb, translateX, this.memoizedStyle.horizontalThumbWidthPercentage);
        } else {
            this.memoizedStyle.scrollableMaxTranslateX = 0;
            this.memoizedStyle.horizontalThumbWidthPercentage = 0;
            this.setHorizontalThumbStyle(horizontalScrollbarThumb, 0, 0);
        }
    }

    setHorizontalThumbStyle(scrollbarThumb, translateX, thumbWidth) {
        if (scrollbarThumb) {
            scrollbarThumb.setAttribute('style', `transform: translateX(${translateX * 100}%); width: ${thumbWidth}%;`);
        }
        this.memoizedStyle.translateX = translateX;
    }

    getScrollbarWrapClass(props) {
        if (props.disableVertical === false && props.disableHorizontal) {
            return 'sam-scrollbar_vertical__wrap';
        } else if (props.disableVertical && props.disableHorizontal === false) {
            return 'sam-scrollbar_horizontal__wrap'
        }
        return 'sam-scrollbar__wrap'
    }

    dragVerticalThumb(evt) {
        this.memoizedStyle.movementY += evt.movementY;
        const scrollbar = this.scrollbarWrapRef.current;
        const translateY = this.memoizedStyle.movementY / this.getRolledHeight(scrollbar);
        if (translateY <= this.memoizedStyle.scrollableMaxTranslateY) {
            scrollbar.scrollTop = scrollbar.clientHeight * translateY;
        } else {
            scrollbar.scrollTop = scrollbar.scrollHeight - scrollbar.clientHeight;
        }
    }

    dragHorizontalThumb(evt) {
        this.memoizedStyle.movementX += evt.movementX;
        const scrollbar = this.scrollbarWrapRef.current;
        const translateX = this.memoizedStyle.movementX / this.getRolledWidth(scrollbar);
        if (translateX <= this.memoizedStyle.scrollableMaxTranslateX) {
            scrollbar.scrollLeft = scrollbar.clientWidth * translateX;
        } else {
            scrollbar.scrollLeft = scrollbar.scrollWidth - scrollbar.clientWidth;
        }
    }

    getRolledWidth(scrollbar) {
        return scrollbar.clientWidth * (scrollbar.clientWidth / scrollbar.scrollWidth)
    }

    getRolledHeight(scrollbar) {
        return scrollbar.clientHeight * (scrollbar.clientHeight / scrollbar.scrollHeight)
    }

    clickTrackHandler(evt, direct) {
        evt.stopPropagation();
        this.cursorDown = true;
        this.direction = direct;
        if (this.direction === VERTICAL_DIRECTION) {
            this.memoizedStyle.movementY = this.memoizedStyle.translateY * this.getRolledHeight(this.scrollbarWrapRef.current);
        } else {
            this.memoizedStyle.movementX = this.memoizedStyle.translateX * this.getRolledWidth(this.scrollbarWrapRef.current);
        }
        document.onselect = () => false;
        document.addEventListener('mousemove', this.mouseDocumentMoveHandler);
    }

    mouseDocumentMoveHandler(evt) {
        evt.preventDefault();
        if (this.cursorDown) {
            if (this.direction === VERTICAL_DIRECTION) {
                this.dragVerticalThumb(evt)
            } else {
                this.dragHorizontalThumb(evt)
            }
        }
    }

    mouseDocumentUpHandler() {
        this.cursorDown = false;
        document.onselect = null;
        document.removeEventListener('mousemove', this.mouseDocumentUpHandler);
    }
}


ScrollBar.propTypes = {
    noResize: PropTypes.bool,
    maxHeight: PropTypes.number,
    disableVertical: PropTypes.bool,
    disableHorizontal: PropTypes.bool,
    onScroll: PropTypes.func
};

ScrollBar.defaultProps = {
    noResize: true,
    maxHeight: 250,
    disableVertical: false,
    disableHorizontal: false
};
