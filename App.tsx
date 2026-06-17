import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppDataProvider } from './src/hooks/useAppData';
import { FAB } from './src/components/FAB';
import { LogSheet } from './src/components/LogSheet';
import { Toast } from './src/components/Toast';
import { Colors } from './src/constants/theme';

export default function App() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSuccess = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
          <AppNavigator />
          <FAB onPress={() => setSheetVisible(true)} />
          <LogSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            onSuccess={handleSuccess}
          />
          <Toast
            message={toastMessage}
            visible={toastVisible}
            onHide={() => setToastVisible(false)}
          />
        </View>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
