import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Gardrop = ({ navigation }) => {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem('user_photos');
        console.log('Stored photos:', storedPhotos);
        if (storedPhotos !== null) {
          const parsedPhotos = JSON.parse(storedPhotos);
          console.log('Fotoğraf çevrildi' , parsedPhotos);
          if (Array.isArray(parsedPhotos)) {
            setPhotos(parsedPhotos);
            console.log('Fotoğraf URL\'leri:', parsedPhotos); // Eklenen satır
          } else {
            console.log(storedPhotos)
            let x=[[storedPhotos]]
            console.log(x[0])
            setPhotos([storedPhotos]); // Tek bir fotoğrafı bir diziye ekleyelim
            console.log('Fotoğraf URL\'leri:', [storedPhotos]); // Eklenen satır
          }
        } else {
          setPhotos([]);
          console.log('asd') // Yükleme başarısız olduğunda boş dizi kullanılmalı
        }
      } catch (error) {
        console.error('Fotoğrafları alma hatası:', error);
      }
    };
    
    loadPhotos();
  }, []);

  const handlePhotoPress = (photo) => {
    // Burada fotoğrafın büyütüldüğü bir modal açılabilir veya başka bir işlem yapılabilir
  };
  console.log('Photos:', photos);
  return (
    <ScrollView>
      <View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Gardrop yazısı */}
        <Text style={styles.title}>Gardrop</Text>
        {photos.map((photo, index) => (
        <TouchableOpacity key={index} onPress={() => handlePhotoPress(photo)}>
          <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />
        </TouchableOpacity>
))}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  item: {
    alignItems: 'center',
    margin: 10,
  },
  selectedItem: {
    alignItems: 'center',
    margin: 10,
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Gardrop;