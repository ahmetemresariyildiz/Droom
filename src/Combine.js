import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const Combine = ({ navigation, route, selectedPhoto }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [renderedGalleryPhotos, setRenderedGalleryPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [combinedPhotos, setCombinedPhotos] = useState([]);
  const translateX = new Animated.Value(0); // TranslateX değerini Animated.Value ile tanımlayın

  const fetchPhotos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user_photos');
      const photos = jsonValue != null ? JSON.parse(jsonValue) : [];
      setGalleryPhotos(photos);
    } catch (e) {
      console.error('Error fetching photos from AsyncStorage:', e);
    }
  };

  useEffect(() => {
    if (route.params && route.params.selectedPhotos) {
      setSelectedPhotos(route.params.selectedPhotos);
    }
  }, [route.params]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    setRenderedGalleryPhotos(renderGalleryPhoto());
  }, [galleryPhotos, selectedPhotos]);

  const renderGalleryPhoto = () => {
    const rows = [];
    for (let i = 0; i < galleryPhotos.length; i += 4) {
      const rowPhotos = [];
      for (let j = 0; j < 4 && i + j < galleryPhotos.length; j++) {
        const index = i + j;
        rowPhotos.push(
          <View key={`${i}_${j}`} style={styles.photoContainer}>
            <Image source={{ uri: galleryPhotos[index] }} style={styles.galleryImage} />
            <TouchableOpacity onPress={() => togglePhotoSelection(index)} style={styles.selectButton}>
              {selectedPhotos.includes(index) ? (
                <Ionicons name="checkmark-circle" size={35} color="green" />
              ) : (
                <Ionicons name="checkmark-circle-outline" size={35} color="gray" />
              )}
            </TouchableOpacity>
          </View>
        );
      }
      rows.push(
        <View key={i} style={styles.photoRow}>
          {rowPhotos}
        </View>
      );
    }
    return rows;
  };

  const togglePhotoSelection = (index) => {
    if (selectedPhotos.includes(index)) {
      setSelectedPhotos(selectedPhotos.filter((photoIndex) => photoIndex !== index));
    } else {
      setSelectedPhotos([...selectedPhotos, index]);
    }
    setRenderedGalleryPhotos(renderGalleryPhoto()); // Galeriyi güncelle
  };
    

  const handleCombine = () => {
    const selectedPhotosData = selectedPhotos.map((index) => galleryPhotos[index]);
    setCombinedPhotos(selectedPhotosData);
    setModalVisible(false);
    navigation.navigate('Combine', { selectedPhotos: selectedPhotosData });
    setSelectedPhotos([]);
    setRenderedGalleryPhotos(renderGalleryPhoto()); // Galeriyi güncelle
  };
  

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { position: 'absolute', top: 0 }]}>Kombin Yap</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <View style={styles.combinedPhotosContainer}>
        {combinedPhotos.map((photoUri, index) => (
          <Image key={index} source={{ uri: photoUri }} style={styles.galleryImage} />
        ))}
      </View>
      
      <TouchableOpacity style={styles.combineButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {renderedGalleryPhotos}
          </ScrollView>
          <View style={styles.imageContainer}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
            >
              <Animated.Image
                source={ null }
                style={[styles.image, { transform: [{ translateX: translateX }] }]}
              />
            </PanGestureHandler>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Kapat" onPress={() => setModalVisible(false)} />
            <Button title="Combine" onPress={handleCombine} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  combineButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  selectButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Combine;
