import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {colors, scale} from '../styles/App.style';
import DialogPerson from '../resources/images/common/person.svg';

interface SpeechBubbleProps {
    localesHelper: LocalesHelper;
    bubbleContent: any;
    stylingOptions?: {
        general?: {
            position?: {top: number, left: number}
            height?: number,
            width?: number,
        },
        bubble?:{
          borderWidth: number,
          borderRadius: number,
          padding: number,
        },
        arrow?:{
          position?: {left: number, bottom: number},
          size?: number,
        },
        icon?: {
          position?: {top: number, left: number},
          size?: number,
        }
    };
};

class SpeechBubble extends Component<SpeechBubbleProps> {

  renderArrow() {
    return (
      <View style={{
        position: "absolute",
        left: this.props.stylingOptions?.arrow?.position?.left || scale(125),
        bottom: this.props.stylingOptions?.arrow?.position?.bottom || 0,
        }}>
        <View style={{
          position:'absolute',
          left: scale(-3),
          borderRightWidth: this.props.stylingOptions?.arrow?.size + 5 || scale(45),
          borderRightColor: colors.primary,
          borderBottomWidth: this.props.stylingOptions?.arrow?.size + 5 || scale(50),
          borderBottomColor: 'transparent',
        }}></View>
        <View style={{
          position: "absolute",
          borderRightWidth: this.props.stylingOptions?.arrow?.size || scale(40),
          borderRightColor: colors.lightGrey,
          borderLeftWidth: 0,
          borderLeftColor: 'transparent',
      
          borderTopWidth: 0,
          borderTopColor: 'transparent',
      
          borderBottomWidth: this.props.stylingOptions?.arrow?.size || scale(45),
          borderBottomColor: 'transparent',
        }}></View>
      </View>
    )
  }

  renderIcon() {
    let size = this.props.stylingOptions?.icon?.size || 80;
    return(
      <View style={{
        marginTop: this.props.stylingOptions?.arrow?.size + 30 || 40,
        paddingLeft: this.props.stylingOptions?.icon?.position?.left || '50%'
      }}>
        <DialogPerson width={size} height={size}/>
      </View>
      )
  }

  renderBubble(){
    return(
      <View style={{
        backgroundColor: colors.lightGrey,
        borderColor: colors.primary,
        borderStyle: 'solid',
        borderWidth: this.props.stylingOptions?.bubble?.borderWidth || 2,
        borderRadius: this.props.stylingOptions?.bubble?.borderRadius || 25,
        padding: this.props.stylingOptions?.bubble?.padding || 10,
      }}>
        { this.renderArrow() }
        { this.props.bubbleContent }
        </View>
    )
  }

  render() {
    return (
      <View
      style={{
        position: 'absolute',
        top: this.props.stylingOptions?.general?.position?.top || 10,
        left: this.props.stylingOptions?.general?.position?.left || (scale(375) - this.props.stylingOptions?.general?.width) / 2,
        width: this.props.stylingOptions?.general?.width || scale(337.5),
        alignContent: 'center',
      }}>
        { this.renderBubble() }
        { this.renderIcon() }

      </View>
    );
  }
}

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(SpeechBubble);

