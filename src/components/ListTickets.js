import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class ListTickets extends Component {

  static navigationOptions = {
    title: 'List Tickets',
  };

  constructor(props) {

    super(props);
    this.state = { eid: [] };

  }

  componentDidMount() {

    const { navigation } = this.props;
    this.setState({ eid: parseInt(JSON.stringify(this.props.route.params.eid)) })

  }

  async logout() {

    await AsyncStorage.setItem('@token', '');
    await AsyncStorage.setItem('@isLoggedIn', '0');
    this.props.navigation.navigate('Login');
  }

  render() {

    return (


      <View style={styles.container}>

        <View style={styles.heading}>

          <Text style={styles.heading}>{this.props.route.params.title}</Text>

        </View>

        <Button
          title="Scan QR Code"
          onPress={() => this.props.navigation.navigate('ScanBarcode', { eid: this.state.eid })} />

      </View>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderTopWidth: 1,
    borderBottomColor: '#000000',
    height: 44,
  },
  heading: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    padding: 15

  }
});


export default ListTickets;
