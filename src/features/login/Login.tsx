import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics'

import * as Navigation from 'navigation/Navigation';
import {setIsLogin, saveUserData} from 'utils/AsyncStorage';

import {Button} from 'components/Button';
import {CustomTextInput} from 'components/CustomTextInput';
import {PasswordInput} from 'components/PasswordInput';

import images from 'assets/images';
import strings from 'assets/strings';

import styles from './styles';

import {useLoginMutation} from 'app/api/LoginApi';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const [login, {isLoading: isLoadingLogin, isSuccess, data, isError, error}] = useLoginMutation();

  useEffect(() => {
    checkIsLogin();
  });

  useEffect(() => {
    if (isSuccess && data?.code == 0) {
      setIsLogin("true").then(() => {
        saveUserData(data.data).then(() => {
          Navigation.replace('NoteList');
        });
      });
    }
  });

  /**
   * This is a concept for biometric login, in the real project
   * there will be asymmetric key implementation (public and private key)
   * which is integrated with the app's backend
   */
  const openBiometrics = async() => {
    const biometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

    const dummyData = {
      Name: "Biometric User",
      Email: "This is a concept for biometric verification",
      Token: "Biometric-Concept"
    }

    biometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
      .then((resultObject) => {
        const {success} = resultObject

        if (success) {
          setIsLogin("true").then(() => {
            saveUserData(dummyData).then(() => {
              Navigation.replace('NoteList');
            });
          });
        } else {
          console.log('User cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.log('Biometrics failed');
      })
  }

  // Usually this function is put in the Splash Screen, but in this case it's only to show the concept
  const checkIsLogin = async() => {
    const isLogin = await AsyncStorage.getItem("isLogin");

    if (isLogin === "true" && isLogin !== null) {
      Navigation.replace('NoteList');
    }
  }

  const validateForm = () => {
    if (email == "" && password == "") {
      setErrorEmail(true);
      setErrorPassword(true);
    } else {
      if (email == "") {
        setErrorEmail(true);
        setErrorPassword(false);
      } else if (password == "") {
        setErrorEmail(false);
        setErrorPassword(true);
      } else {
        setErrorEmail(false);
        setErrorPassword(false);

        onLogin();
      }
    }
  }

  const onLogin = () => {
    login({email, password});
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={images.logo}
        resizeMode='contain'
      />

      <Text style={styles.welcomeText}>{strings.welcome}</Text>

      <CustomTextInput
        onChangeText={(email) => setEmail(email)}
        placeholder={strings.email}
        isError={errorEmail}
        errorMessage={strings.required_field}
      />

      <PasswordInput
        onChangeText={(password) => setPassword(password)}
        placeholder={strings.password}
        isError={errorPassword}
        errorMessage={strings.required_field}
      />

      {
        (isError || data?.code == 1) &&
          <View style={styles.containerError}>
            <Text style={styles.textError}>
              {isError ? error?.data.Message : data?.message}
            </Text>
          </View>
      }

      <View style={styles.containerButton}>
        <View style={styles.containerButtonLogin}>
          <Button
            testID={'loginButton'}
            disabled={isLoadingLogin}
            caption={isLoadingLogin ? strings.please_wait : strings.login}
            onPress={validateForm}
          />
        </View>

        <TouchableOpacity onPress={openBiometrics}>
          <Image
            style={styles.iconBiometric}
            source={images.biometric}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login;