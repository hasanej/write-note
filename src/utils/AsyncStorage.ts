import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setIsLogin(isLogin) {
  await AsyncStorage.setItem("isLogin", isLogin);
}

export async function saveUserData(userData) {
  await AsyncStorage.setItem("name", userData.Name);
  await AsyncStorage.setItem("email", userData.Email);
  await AsyncStorage.setItem("token", userData.Token);
}