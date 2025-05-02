import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Input from '../../components/Input';
import {clearAuthError, login} from '../../store/slices/authSlice';
import {
  COLORS,
  horizontalScale,
  moderateScale,
  SIZES,
  verticalScale,
} from '../../utils/Theme';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {loading, error} = useSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email: '', password: ''});

  const validate = () => {
    const err = {email: '', password: ''};
    let ok = true;

    if (!emailRegex.test(email.trim())) {
      err.email = 'Please enter a valid email (e.g. abc@de.co)';
      ok = false;
    }
    if (password.trim().length < 6) {
      err.password = 'Password must be at least 6 characters';
      ok = false;
    }
    setErrors(err);
    return ok;
  };

  useEffect(() => {
    if (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.message || 'Invalid email or password.';
      Alert.alert('Login failed', message, [{text: 'OK'}]);
    }
  }, [error]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(login({email: email.trim(), password}));
  };

  const onEmailChange = txt => {
    setEmail(txt);
    if (errors.email) setErrors(e => ({...e, email: ''}));
  };
  const onPassChange = txt => {
    setPassword(txt);
    if (errors.password) setErrors(e => ({...e, password: ''}));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Login</Text>

        <View>
          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={onEmailChange}
            placeholder="Enter your email…"
            error={errors.email}
          />

          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={onPassChange}
            placeholder="Password"
            error={errors.password}
          />
        </View>

        <View>
          <TouchableOpacity
            style={[styles.loginBtn, loading && {opacity: 0.6}]}
            activeOpacity={0.7}
            disabled={loading}
            onPress={handleSubmit}>
            <Text style={styles.loginTxt}>
              {loading ? 'Loading…' : 'Login'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupTxt}>
            Don't have an account yet?{' '}
            <Text
              style={{color: COLORS['brand-primaryBlue']}}
              onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS['primary-black'],
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(12),
    gap: verticalScale(50),
  },
  heading: {
    color: COLORS['brand-primaryPurple'],
    alignSelf: 'center',
    fontSize: SIZES.xxLarge,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  signupTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.xMedium,
    alignSelf: 'center',
  },
});