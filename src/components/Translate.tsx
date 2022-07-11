import React, {Component} from 'react';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {Linking, StyleSheet, Text, View} from 'react-native';

import {colors} from '../styles/App.style';

interface PropsType extends WithTranslation {
  stringToTranslate: string;
  links?: string[];
  linkNames?: string[];
  textOptions?: Record<string, unknown>;
}

class Translate extends Component<PropsType> {
  translateComponents = {
    bold: <Text style={[this.props.textOptions, {fontWeight: 'bold'}]} />
  };
  values = {};
  constructor(props: PropsType) {
    super(props);
    this.initialization();
  }

  initialization(): void {
    this.props.links.forEach((link, index) => {
      const keyName = 'goTo' + index;
      this.translateComponents[keyName] = (
        <Text
          onPress={() => {
            Linking.openURL(this.props.links[index]);
          }}
          style={{color: colors.link}}
        />
      );
    });

    this.props.linkNames.forEach((linkName, index) => {
      const keyName = 'address' + index;
      console.log(keyName);
      this.values[keyName] = linkName;
    });
  }

  render() {
    return (
      <View>
        <Trans
          style={this.props.textOptions}
          parent={Text}
          i18nKey={this.props.stringToTranslate}
          values={this.values}
          components={this.translateComponents}
        />
      </View>
    );
  }
}

export default withTranslation()(Translate);
