import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {AppFonts, scale, TextSize} from '../styles/App.style';

interface PropsType {
  localesHelper: LocalesHelper;
}

class Info extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']}>
        <View style={{margin: 25, marginBottom: 50}}>
          <Text style={{fontFamily: AppFonts.regular, fontSize: scale(TextSize.small)}}>
            {this.props.localesHelper.localeString('info.later')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(Info);
