import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebViewApp } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('item').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('item').html_url;

    return <WebViewApp source={{ uri: repository }} />;
  }
}
