import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddClothes = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const savePhotoToStorage = async (photos) => {
    try {
      let storedPhotos = [];
      const storedPhotosData = await AsyncStorage.getItem('user_photos');
      if (storedPhotosData !== null) {
        storedPhotos = JSON.parse(storedPhotosData);
      }

      storedPhotos = storedPhotos.concat(photos);
      const jsonValue = JSON.stringify(storedPhotos);
      await AsyncStorage.setItem('user_photos', jsonValue);
      return true;
    } catch (error) {
      console.error('Fotoğrafı kaydetme hatası:', error);
      return false;
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
      allowsEditing: false,
      quality: 1,
    });

    if (result && !result.cancelled && result.assets) {
      setSelectedImages([result.assets[0].uri]);
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
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1,
    });

    if (result && !result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      setSelectedImages(uris);
    }
  };

  const handleConfirmPhoto = async () => {
    if (selectedImages.length > 0) {
      Alert.alert(
        'Onay',
        'Seçili fotoğrafları eklemek istediğinize emin misiniz?',
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Evet',
            onPress: async () => {
              const success = await savePhotoToStorage(selectedImages);
              if (success) {
                Alert.alert('Başarılı', 'Fotoğraflar kaydedildi.');
                setSelectedImages([]);
              } else {
                Alert.alert('Hata', 'Fotoğraflar kaydedilirken bir sorun oluştu.');
              }
            },
          },
        ]
      );
    }
  };

  const handleCancelPhoto = () => {
    if (selectedImages.length > 0) {
      Alert.alert(
        'Onay',
        'Seçilen fotoğrafları silmek istediğinize emin misiniz?',
        [
          {
            text: 'Hayır',
            style: 'cancel',
          },
          {
            text: 'Evet',
            onPress: () => setSelectedImages([]),
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
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleChoosePhotoFromCamera}>
          <Ionicons name="camera-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleChoosePhotoFromGallery}>
          <Ionicons name="images-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {selectedImages.length > 0 && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            {selectedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} resizeMode="contain" />
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPhoto}>
              <Text style={styles.confirmButtonText}>Onayla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPhoto}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
    backgroundColor: '#3366ff',
    borderRadius: 20,
    padding: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
  },
  iconButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  scrollView: {
    marginTop: 30,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddClothes;
