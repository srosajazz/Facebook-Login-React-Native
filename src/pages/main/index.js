import 'config/ReactotronConfig';
import React, { Component } from 'react';

import {
  StatusBar,
  View,
  TouchableHighlight,
  Text,
  Image,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import { facebookLogin } from 'services/auth';

import styles from './styles';

export default class App extends Component {
  state = {
    error: null,
    loading: false,
    user: null,
  };

  handleLoginWithFacebook = async () => {
    this.setState({ loading: true });

    const response = await facebookLogin();

    if (response.error) {
      this.setState({ error: response.error, loading: false });
      return false;
    }

    this.setState({ user: response.user, loading: false, error: '' });
    return true;
  };

  handleLogout = async () => {
    this.setState({ user: null });
    await AsyncStorage.removeItem('@Facebook:accessData');
  };

  toggleInfo = () => {
    const { loading, user } = this.state;
    return user ? (
      <View style={styles.userInfo}>
        <Image source={{ uri: user.picture.data.url }} style={styles.avatar} />
        <Text style={styles.id}>{`ID: ${user.id}`}</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableHighlight onPress={this.handleLogout} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableHighlight>
      </View>
    ) : (
      <TouchableHighlight onPress={this.handleLoginWithFacebook} style={styles.buttonContainer}>
        {!loading ? (
          <Text style={styles.buttonText}>Entrar com o Facebook</Text>
        ) : (
          <ActivityIndicator size="small" color={styles.spinner.color} />
        )}
      </TouchableHighlight>
    );
  };

  render() {
    const { error } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image source={require('images/logo.png')} style={styles.logo} />
        <View style={styles.box}>
          {!!error && <Text style={styles.error}>{error}</Text>}
          {this.toggleInfo()}
        </View>
      </View>
    );
  }
}
