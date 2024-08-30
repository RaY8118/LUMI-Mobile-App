import React, { useState } from 'react';
import { Button, View, Image, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const DocumentPickerScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle document picking
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Filter for JPEG images
      });

      if (result.type === 'success') {
        // Check if the picked document is indeed a JPEG
        if (result.mimeType === 'image/*') {
          setImageUri(result.uri);
          setError(null);
        } else {
          setError('Selected file is not a JPEG image');
        }
      } else if (result.type === 'cancel') {
        setError('Document selection canceled');
      } else {
        setError('Unknown error occurred');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setError('Error picking document');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a JPG image" onPress={pickDocument} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default DocumentPickerScreen;
