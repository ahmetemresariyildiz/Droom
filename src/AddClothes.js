import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native';
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
      console.log('Depolanan Fotoğraflar:', storedPhotos);
  
      if (storedPhotos !== null) {
        photos = JSON.parse(storedPhotos);
        console.log('Eski Fotoğraflar:', photos);
      } else {
        console.log('Kaydedilmiş fotoğraf bulunamadı.');
      }
  
      // Eğer photoUri bir dizi değilse, onu bir diziye dönüştür
      if (!Array.isArray(photoUri)) {
        photoUri = [photoUri];
      }
  
      // Yeni fotoğrafları dizinin sonuna ekleyin
      photos = photos.concat(photoUri); // concat metodu kullanılıyor
      console.log('Yeni Fotoğraflar:', photos);
  
      const jsonValue = JSON.stringify(photos);
      console.log('Depolanacak JSON:', jsonValue);
  
      await AsyncStorage.setItem('user_photos', jsonValue);
      console.log('Fotoğraf başarıyla kaydedildi.');
    } catch (error) {
      console.error('Fotoğrafı kaydetme hatası:', error);
    }
  };

  const handleChoosePhotoFromCamera = async () => {
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Yerel depo izinleri başarıyla alındı.');
        } else {
          console.log('Yerel depo izinleri reddedildi veya iptal edildi.');
        }
      } catch (error) {
        console.error('Yerel depo izinlerini alma hatası:', error);
      }
    };
    
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
      console.log (result.assets[0].uri)
    if (!result.cancelled) {
      setPreviewImage(result.assets[0].uri);
      savePhotoToStorage(result.assets[0].uri); // Fotoğrafı async storage'a kaydet
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
      savePhotoToStorage(result.assets[0].uri); // Fotoğrafı async storage'a kaydet
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  },
  image: {
    width: 400,
    height: 650,
  },
});

export default AddClothes;
