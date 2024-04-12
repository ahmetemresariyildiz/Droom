import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const AddClothes = ({ onBack, navigation }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleChoosePhotoFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Kamera izni reddedildi!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPreviewImage(result.uri);
      // Fotoğrafı gardroba eklemek için bir işlev çağrısı yapılabilir
      // Örneğin:
      // onAddToWardrobe(result.uri);
    }
  };

  const handleChoosePhotoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Galeri izni reddedildi!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPreviewImage(result.uri);
      // Fotoğrafı gardroba eklemek için bir işlev çağrısı yapılabilir
      // Örneğin:
      // onAddToWardrobe(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kıyafet Ekle</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleChoosePhotoFromCamera}>
        <Text style={styles.buttonText}>Kamera ile Kıyafet Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleChoosePhotoFromGallery}>
        <Text style={styles.buttonText}>Galeriden Kıyafet Seç</Text>
      </TouchableOpacity>
      {previewImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: previewImage }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
<AddClothes onConfirm={handleAddToWardrobe} />
export default AddClothes;
