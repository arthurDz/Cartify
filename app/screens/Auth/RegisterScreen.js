import React, {useState, useEffect} from 'react';
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
import {signUp, clearAuthError} from '../../store/slices/authSlice';

import {
  COLORS,
  horizontalScale,
  moderateScale,
  SIZES,
  verticalScale,
} from '../../utils/Theme';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {loading, error} = useSelector(s => s.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({name: '', email: '', password: ''});

  const validate = () => {
    const err = {name: '', email: '', password: ''};
    let ok = true;

    if (name.trim().length === 0) {
      err.name = 'Name is required';
      ok = false;
    }
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

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(
      signUp({
        email: email.trim(),
        name: name.trim(),
        password,
        avatar: 'https://i.pravatar.cc/150?img=6',
      }),
    ).then(res => {
      if (!res.error) navigation.goBack();
    });
  };

  useEffect(() => {
    if (error) {
      const msg =
        typeof error === 'string'
          ? error
          : error?.message || 'Unable to create account.';
      Alert.alert('Sign‑up failed', msg, [{text: 'OK'}]);
    }
  }, [error]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleName = txt => {
    setName(txt);
    if (errors.name) setErrors(e => ({...e, name: ''}));
  };
  const handleEmail = txt => {
    setEmail(txt);
    if (errors.email) setErrors(e => ({...e, email: ''}));
  };
  const handlePassword = txt => {
    setPassword(txt);
    if (errors.password) setErrors(e => ({...e, password: ''}));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Register</Text>

        <View>
          <Input
            label="Name"
            value={name}
            onChangeText={handleName}
            placeholder="Enter your name"
            error={errors.name}
          />

          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmail}
            placeholder="Enter your email"
            error={errors.email}
          />

          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={handlePassword}
            placeholder="Password"
            error={errors.password}
          />
        </View>

        <View>
          <TouchableOpacity
            style={[styles.signupBtn, loading && {opacity: 0.6}]}
            activeOpacity={0.7}
            disabled={loading}
            onPress={handleSubmit}>
            <Text style={styles.signupTxt}>
              {loading ? 'Loading…' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.loginTxt}>
            Already have an account?{' '}
            <Text
              style={{color: COLORS['brand-primaryBlue']}}
              onPress={() => navigation.navigate('Login')}>
              Login
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
  signupBtn: {
    backgroundColor: COLORS['brand-primaryPurple'],
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  signupTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  loginTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.xMedium,
    alignSelf: 'center',
  },
});