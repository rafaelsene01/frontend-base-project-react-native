import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnderAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    refresh: false,
    page: 1,
  };

  async componentDidMount() {
    this.loadPage();
  }

  loadPage = async (page = 1) => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars } = this.state;

    if (page !== 1) this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
    });
  };

  loadMore = async () => {
    const { page } = this.state;
    const nextPage = page + 1;

    this.loadPage(nextPage);
  };

  refreshList = async () => {
    this.setState({ refresh: true });

    await this.loadPage();

    this.setState({ refresh: false });
  };

  handleNavidate = item => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { item });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refresh } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavidate(item)}>
              <OwnderAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.refreshList}
          refreshing={refresh}
        />
        {loading && <ActivityIndicator />}
      </Container>
    );
  }
}
