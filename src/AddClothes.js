import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

const AddClothes = ({ navigation }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const savePhotoToStorage = async (photoUri) => {
    try {
      let photos = [];
      const storedPhotos = await AsyncStorage.getItem('user_photos');
      if (storedPhotos !== null) {
        photos = JSON.parse(storedPhotos);
      }

      if (!Array.isArray(photoUri)) {
        photoUri = [photoUri];
      }

      photos = photos.concat(photoUri);

      const jsonValue = JSON.stringify(photos);
      await AsyncStorage.setItem('user_photos', jsonValue);
    } catch (error) {
      console.error('Fotoğrafı kaydetme hatası:', error);
    }
  };

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
      setPreviewImage(result.assets[0].uri);
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
      setPreviewImage(result.assets[0].uri);
    }
  };

  const handleConfirmPhoto = async () => {
    if (previewImage) {
      savePhotoToStorage(previewImage);
      Alert.alert('Başarılı', 'Fotoğraf kaydedildi.');
      setPreviewImage(null);
    }
  };

  const handleCancelPhoto = () => {
    if (previewImage) {
      Alert.alert(
        'Onay',
        'Bu fotoğrafı silmek istediğinize emin misiniz?',
        [
          {
            text: 'Hayır',
            style: 'cancel',
          },
          {
            text: 'Evet',
            onPress: () => setPreviewImage(null),
          },
        ],
        { cancelable: false }
      );
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
          <Image source={{ uri: previewImage }} style={styles.image} resizeMode="contain" />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPhoto}>
              <Text style={styles.buttonText}>Onayla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPhoto}>
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: 'dimgray',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default AddClothes;
