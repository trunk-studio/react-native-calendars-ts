// use TouchableOpacity from react-native-gesture-handler to prevent missing touch event.
// ref: https://stackoverflow.com/a/58019997/8865942
import {TouchableOpacity} from 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  onDayPress = () => {
    if (this.props.marking.disableTouchEvent) return;
    console.log('this.props.date=>', this.props.date);
    this.props.onPress(this.props.date);
  };
  onDayLongPress = () => {
    if (this.props.marking.disableTouchEvent) return;
    this.props.onLongPress(this.props.date);
  };

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      'state',
      'children',
      'marking',
      'onPress',
      'onLongPress',
    ]);
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      };
    }
    const isDisabled =
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled';

    let dot;
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (isDisabled) {
        dotStyle.push(this.style.disabledDot);
      }
      if (marking.dotColor) {
        dotStyle.push({backgroundColor: marking.dotColor});
      }
      textStyle.push(this.style.dotTextColor);
      dot = <View style={dotStyle} />;
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
      if (marking.marked) {
        textStyle.push(this.style.selectedDotTextColor);
      }
      if (marking.disabled) {
        textStyle.push(this.style.disabledText);
        containerStyle.push({backgroundColor: 'white'});
      }
      if (this.props.state === 'today') {
        textStyle.push(this.style.todayText);
        containerStyle.push({backgroundColor: 'white'});
      }
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      // containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
      dotStyle.push(this.style.todayDot);
    }
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={marking.activeOpacity}
        disabled={marking.disableTouchEvent || isDisabled}>
        <Text allowFontScaling={false} style={textStyle}>
          {String(this.props.children)}
        </Text>
        {dot}
      </TouchableOpacity>
    );
  }
}

export default Day;
