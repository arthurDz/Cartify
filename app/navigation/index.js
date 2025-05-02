import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigation() {
  const {accessToken} = useSelector(state => state.auth);
  const isLoggedIn = !!accessToken;  

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}