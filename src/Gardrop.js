import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, FlatList, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Gardrop = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // New state for selected photo

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem('user_photos');
        if (storedPhotos !== null) {
          const parsedPhotos = JSON.parse(storedPhotos);
          setPhotos(parsedPhotos);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error('Fotoğrafları alma hatası:', error);
      }
    };
    
    loadPhotos();
  }, []);

  const handlePhotoPress = (photo) => {
    if (isSelecting) {
      if (selectedPhotos.includes(photo)) {
        setSelectedPhotos(selectedPhotos.filter((selectedPhoto) => selectedPhoto !== photo));
      } else {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    } else {
      setSelectedPhoto(photo);
      setModalVisible(true);
    }
  };

  const handleSelect = () => {
    setIsSelecting(!isSelecting);
  };

  const handleDelete = () => {
    setPhotos(photos.filter((photo) => !selectedPhotos.includes(photo)));
    setSelectedPhotos([]);
    setIsSelecting(false);
  };

  const handleCombine = () => {
    // Kombinasyon yapma işlemini burada gerçekleştir
  };

  const closeModal = () => {
    setTimeout(() => {
      setModalVisible(false);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Gardrop</Text>
      <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
        <Text style={styles.selectButtonText}>{isSelecting ? 'İptal' : 'Seç'}</Text>
      </TouchableOpacity>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 20 }} // Yeni eklenen satır
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePhotoPress(item)}>
            <Image
              source={{ uri: item }}
              style={[
                styles.image,
                selectedPhotos.includes(item) ? styles.selectedImage : null,
                isSelecting ? null : styles.normalImage,
              ]}
            />
          </TouchableOpacity>
        )}
      />
      {isSelecting && (
        <View style={styles.buttonContainer}>
          <Button title="Sil" onPress={handleDelete} disabled={selectedPhotos.length === 0} />
          <Button title="Kombin Yap" onPress={handleCombine} disabled={selectedPhotos.length < 2} />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.selectedImage} />
          <Button title="Kapat" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 25, // 20'den 30'a artırıldı
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // Ortala
    marginTop: 20, // Yeni eklenen satır
  },
  selectButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    zIndex: 1,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 110,
    height: 110,
    margin: 5,
  },
  selectedImage: {
    borderWidth: 2,
    width: 300,
    height: 300,
  },
  normalImage: {
    width: 110,
    height: 110,
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Gardrop;
