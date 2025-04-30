import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../components/Input';
import { COLORS, horizontalScale, moderateScale, SIZES, verticalScale } from '../../utils/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {loading, error} = useSelector(s => s.auth);

  const [email, setEmail] = useState('john@mail.com');
  const [password, setPassword] = useState('changeme');

  const handleSubmit = () => {
    if (!email || !password) return;
    dispatch(login({email, password}));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            color: COLORS['brand-primaryPurple'],
            alignSelf: 'center',
            fontSize: SIZES.xxLarge,
            fontWeight: '600',
          }}>
          Login
        </Text>
        <View>
          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email..."
          />

          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.7}
            onPress={handleSubmit}>
            <Text style={styles.loginTxt}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.signupTxt}>
            Don't have an account yet?{' '}
            <Text
              style={{
                color: COLORS['brand-primaryBlue'],
              }}
              onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS['primary-black'],
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(12),
    gap: verticalScale(50),
  },
  loginBtn: {
    backgroundColor: COLORS['brand-primaryPurple'],
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  loginTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.large,
    fontWeight: '600'
  },
  signupTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.xMedium,
    alignSelf: 'center'
  },
});