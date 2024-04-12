import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Gardrop = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Kullanıcının kaydettiği fotoğrafları yerel depolamadan al
        const storedPhotos = await AsyncStorage.getItem('user_photos');
        if (storedPhotos !== null) {
          setPhotos(JSON.parse(storedPhotos));
        }
      } catch (error) {
        console.error('Fotoğrafları alma hatası:', error);
      }
    };

    loadPhotos();
  }, []);

  return (
    <View>
      {photos.map((photo, index) => (
        <TouchableOpacity key={index} onPress={() => handlePhotoPress(photo)}>
          <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Gardrop;