import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity,Image, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkLogin from '../api/checkLogin';
import getToken from '../api/getToken';
import LoginApi from '../api/LoginApi';

class Login extends Component {

    static navigationOptions = {
        title: 'Log In'
    };

    constructor(props) {
        super(props);
        this.state = {
            url: 'https://yessbossticket.com/', // Set the URL to a static value
            user: '',
            pass: '',
        }
    }

    _validate() {
        const { url, user, pass } = this.state;
        if (url == '') {
            alert('Enter Url ');
            return false;
        }

        if (user == '') {
            alert('Enter User');
            return false;
        }

        if (pass == '') {
            alert('Enter Password');
            return false;
        }
    }

    _onLogin = async () => {

        this._validate();

        const { navigate } = this.props.navigation;

        const { url, user, pass } = this.state;


        await LoginApi(url, user, pass)
            .then((resjson) => {

                if (resjson.status === 'SUCCESS' && this.saveToStorage(resjson.token)) {
                    alert(resjson.msg);
                    navigate('Events');
                } else if (resjson.status === 'FAIL') {
                    alert(resjson.msg);
                }

            })
            .catch((err) => { console.log(err) });

    }

    async saveToStorage(token) {

        if (token) {

            await AsyncStorage.setItem('@token', token);
            await AsyncStorage.setItem('@isLoggedIn', '1');
            await AsyncStorage.setItem('@url', this.state.url);

            return true;
        }

        return false;

    }



    render() {
        const { url, user, pass } = this.state;

        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/icon.jpg')} // Replace 'your-logo.png' with the actual image path
                    style={styles.logo}
                />
                <TextInput
                    style={styles.input}
                    placeholder="User"
                    autoCapitalize='none'
                    onChangeText={user => this.setState({ user })}
                    value={user}
                    placeholderTextColor="#666666"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    autoCapitalize='none'
                    onChangeText={pass => this.setState({ pass })}
                    value={pass}
                    secureTextEntry
                    keyboardType="default"
                    placeholderTextColor="#666666"
                />


                <TouchableOpacity style={styles.btn} onPress={this._onLogin.bind(this)}>
                    <Text style={styles.btn_text}>
                        Log In
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#000'
    },
    logo: {
        width: 200, // Adjust the width as needed
        height: 200, // Adjust the height as needed
        marginBottom: 20, // Adjust the margin as needed
    },
    input: {
        height: 40,
        width: 250,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#333333'
    },
    btn: {
        height: 40,
        width: 120,
        backgroundColor: 'red',
        borderColor: '#e86c60',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
        borderRadius: 5
    }

});

export default Login;
