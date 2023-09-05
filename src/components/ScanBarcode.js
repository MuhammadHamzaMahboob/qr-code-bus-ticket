import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScanBarcode(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [validTicket, setValidTicket] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [seat, setSeat] = useState('');
  const [checkinTime, setCheckinTime] = useState('');
  const [eCal, setECal] = useState('');
  const [storedToken, setStoredToken] = useState('true');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const reset = () => {
    setStoredToken('');
    setValidTicket(null);
    setCustomerName('');
    setSeat('');
    setCheckinTime('');
    setECal('');
  };

  const onBarCodeScanned = async ({ type, data }) => {
    if (data === storedToken) {
      return;
    }

    // Get the token and URL from AsyncStorage
    const token = await AsyncStorage.getItem('@token');
    const url = await AsyncStorage.getItem('@url');
    const eid = JSON.stringify(props.route.params.eid);

    // Validate Ticket
    try {
      const response = await fetch(`${url}wp-json/meup/v1/validate_ticket/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          qrcode: data,
          eid,
        }),
      });

      const resjson = await response.json();

      if (resjson.status === 'FAIL') {
        Alert.alert(
          'FAIL',
          resjson.msg,
          [
            {
              text: 'Continue',
              onPress: reset,
            },
          ],
        );
      } else if (resjson.status === 'SUCCESS') {
        Alert.alert(
          'SUCCESS',
          resjson.msg,
          [
            {
              text: 'Continue',
              onPress: reset,
            },
          ],
        );
      }

      setValidTicket(resjson.status);
      setCustomerName(resjson.name_customer);
      setSeat(resjson.seat);
      setCheckinTime(resjson.checkin_time);
      setECal(resjson.e_cal);
      setStoredToken(data);
    } catch (error) {
      alert('Error occurred, please scan again');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.scanAgainButton}>
          <Text onPress={() => setScanned(false)}>Tap to Scan Again</Text>
        </View>
      )}
      <View style={styles.result}>
        <View style={styles.resultLeft}>
          {validTicket === 'SUCCESS' && (
            <View style={styles.success}>
              <Text style={styles.validText}>V</Text>
            </View>
          )}
          {validTicket === 'FAIL' && (
            <View style={styles.fail}>
              <Text style={styles.validText}>X</Text>
            </View>
          )}
        </View>
        <View style={styles.resultRight}>
          {customerName && (
            <Text style={styles.label}>
              Guest: <Text style={styles.value}> {customerName}</Text>
            </Text>
          )}
          {seat && (
            <Text style={styles.label}>
              Seat: <Text style={styles.value}> {seat}</Text>
            </Text>
          )}
          {eCal && (
            <Text style={styles.label}>
              Date-Time: <Text style={styles.value}> {eCal}</Text>
            </Text>
          )}
          {checkinTime && (
            <Text style={styles.label}>
              Check-in: <Text style={styles.value}> {checkinTime}</Text>
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:"#000"
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  result: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'flex-start',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLeft: {
    flex: 1,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultRight: {
    flex: 4,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
  },
  success: {
    backgroundColor: '#90ba3e',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fail: {
    backgroundColor: 'red',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  validText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#ccc',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
