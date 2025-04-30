import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/Input';
import {
  COLORS,
  horizontalScale,
  moderateScale,
  SIZES,
  verticalScale,
} from '../../utils/Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {signUp} from '../../store/slices/authSlice';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(s => s.auth);
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    dispatch(
      signUp({
        email,
        name,
        password,
        avatar: 'https://i.pravatar.cc/150?img=6', // API requires it
      }),
    ).then(res => {
      if (!res.error) navigation.goBack();
    });
  };

  if (loading) {
    return <Text>Loading…</Text>;
  }

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
          Regsiter
        </Text>
        <View>
          <Input
            label="Name"
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
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
            style={styles.signupBtn}
            activeOpacity={0.7}
            onPress={handleSubmit}>
            <Text style={styles.signupTxt}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={styles.loginTxt}>
            Already have an account yet?{' '}
            <Text
              style={{
                color: COLORS['brand-primaryBlue'],
              }}
              onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS['primary-black'],
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(12),
    gap: verticalScale(50),
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
    fontWeight: '600'
  },
  loginTxt: {
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: SIZES.xMedium,
    alignSelf: 'center',
  },
});
