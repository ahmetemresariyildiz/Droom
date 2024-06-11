import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State, PinchGestureHandler } from 'react-native-gesture-handler';

const Combine = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [combinedPhotos, setCombinedPhotos] = useState([]);
  const [gestureStates, setGestureStates] = useState([]);

  useEffect(() => {
    if (route.params && route.params.selectedPhotos) {
      setSelectedPhotos(route.params.selectedPhotos);
    }
    fetchPhotos();
  }, [route.params]);

  useEffect(() => {
    const photosWithGestureStates = selectedPhotos.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(1), // Add scale value for pinch gesture
    }));
    setGestureStates(photosWithGestureStates);
  }, [selectedPhotos]);

  useEffect(() => {
    setCombinedPhotos(selectedPhotos.map(index => galleryPhotos[index]));
  }, [selectedPhotos, galleryPhotos]);

  const handleTogglePhotoSelection = (index) => {
    setSelectedPhotos(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(photoIndex => photoIndex !== index)
        : [...prevSelected, index]
    );
  };

  const handleCombine = () => {
    const selectedPhotosData = selectedPhotos.map(index => galleryPhotos[index]);
    setCombinedPhotos(selectedPhotosData);
    setModalVisible(false);
    setSelectedPhotos([]);
  };

  const CombinedPhoto = ({ photo, index }) => {
    const gestureStatesRef = gestureStates[index];
    const initialScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;
  
    const handlePanGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: gestureStatesRef.x, translationY: gestureStatesRef.y } }],
      { useNativeDriver: false }
    );
  
    const handlePinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: scale } }],
      { useNativeDriver: false }
    );
  
    const handlePanGestureStateChange = ({ nativeEvent }) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        gestureStatesRef.x.extractOffset();
        gestureStatesRef.y.extractOffset();
        gestureStatesRef.x.setValue(0);
        gestureStatesRef.y.setValue(0);
      }
    };
  
    const handlePinchGestureStateChange = ({ nativeEvent }) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        initialScale.setValue(initialScale._value * scale._value); // Güncel ölçek değerini ayarla
        scale.setValue(1);
        scale.setOffset(0);
      }
    };
  
    return (
      <PinchGestureHandler
        onGestureEvent={handlePinchGestureEvent}
        onHandlerStateChange={handlePinchGestureStateChange}
      >
        <Animated.View style={{ transform: [{ scale: Animated.multiply(initialScale, scale).interpolate({
                inputRange: [0.5, 3],
                outputRange: [0.5, 3],
                extrapolate: 'clamp'
              }) }] }}>
          <PanGestureHandler
            onGestureEvent={handlePanGestureEvent}
            onHandlerStateChange={handlePanGestureStateChange}
          >
            <Animated.View
              style={[
                styles.combinedPhotoContainer,
                {
                  transform: [
                    { translateX: gestureStatesRef.x },
                    { translateY: gestureStatesRef.y },
                  ],
                },
              ]}
            >
              <Image source={{ uri: photo.uri }} style={styles.combinedPhotoImage} />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    );
  };
  
  
  
  

  const renderCombinedPhotos = () => {
    return combinedPhotos.map((photo, index) => {
      if (!photo || !photo.uri) {
        console.error('Invalid URI for photo at index:', index);
        return null;
      }
      return <CombinedPhoto key={index} photo={photo} index={index} />;
    });
  };

  const renderGalleryPhoto = () => {
    const rows = [];
    for (let i = 0; i < galleryPhotos.length; i += 4) {
      const rowPhotos = [];
      for (let j = 0; j < 4 && i + j < galleryPhotos.length; j++) {
        const index = i + j;
        const photo = galleryPhotos[index];
        if (!photo || !photo.uri) {
          console.error('Invalid URI for photo at index:', index);
          continue;
        }
        rowPhotos.push(
          <View key={`${i}_${j}`} style={styles.photoContainer}>
            <Image source={{ uri: photo.uri }} style={styles.galleryImage} />
            <TouchableOpacity
              onPress={() => handleTogglePhotoSelection(index)}
              style={styles.selectButton}
            >
              <Ionicons
                name={selectedPhotos.includes(index) ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={35}
                color={selectedPhotos.includes(index) ? 'green' : 'gray'}
              />
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
    return (
      <ScrollView>
        {rows}
      </ScrollView>
    );
  };

  const fetchPhotos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user_photos');
      const photos = jsonValue ? JSON.parse(jsonValue) : [];
      const galleryPhotos = photos.map(photoUri => {
        if (!photoUri || typeof photoUri !== 'string') {
          return null;
        }
        return { uri: photoUri };
      });
      setGalleryPhotos(galleryPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { position: 'absolute', top: 0 }]}>Kombin Yap</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.combinedPhotosContainer}>
        {renderCombinedPhotos()}
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
            <View style={styles.combinedPhotosContainer}>
              {renderGalleryPhoto()}
            </View>
          </ScrollView>
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
  combinedPhotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  combinedPhotoContainer: {
    margin: 5,
  },
  combinedPhotoImage: {
    width: 100,
    height: 100,
  },
});

export default Combine;