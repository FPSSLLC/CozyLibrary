import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as ExpoCamera from 'expo-camera';

type Props = {
  onScan: (isbn: string) => void;
  onCancel: () => void;
};

export default function BarcodeScannerView({ onScan, onCancel }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // ISBN barcodes are typically EAN_13
    if (type === ExpoCamera.BarCodeScanner.Constants.BarCodeType.ean13) {
      onScan(data);
    }
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No access to camera</ThemedText>
        <Pressable style={styles.button} onPress={onCancel}>
          <ThemedText>Cancel</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCamera.Camera
        style={styles.scanner}
        barCodeScannerSettings={{
          barCodeTypes: [ExpoCamera.BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <ThemedText style={styles.overlayText}>
            Position ISBN barcode within frame
          </ThemedText>
          <Pressable style={styles.button} onPress={onCancel}>
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </Pressable>
        </View>
      </ExpoCamera.Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
  },
});