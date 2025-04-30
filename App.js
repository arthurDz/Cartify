import 'react-native-gesture-handler'; 
import React from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './app/store';
import RootNavigation from './app/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}