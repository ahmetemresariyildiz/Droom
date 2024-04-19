import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, FlatList, Modal, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Gardrop = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isMarking, setIsMarking] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const [isCombineActive, setIsCombineActive] = useState(false);

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

  useEffect(() => {
    // İşaretlenmiş fotoğraf sayısına göre sil ve kombin yap butonlarını kontrol et
    if (selectedPhotos.length === 1) {
      setIsDeleteActive(true);
      setIsCombineActive(false);
    } else if (selectedPhotos.length > 1) {
      setIsDeleteActive(true);
      setIsCombineActive(true);
    } else {
      setIsDeleteActive(false);
      setIsCombineActive(false);
    }
  }, [selectedPhotos]);

  const handlePhotoPress = (photo, index) => {
    if (isMarking) {
      if (selectedPhotos.includes(photo)) {
        setSelectedPhotos(selectedPhotos.filter((selectedPhoto) => selectedPhoto !== photo));
      } else {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    } else {
      setSelectedPhoto(photo);
      setSelectedPhotoIndex(index);
      setModalVisible(true);
    }
  };

  const handleMark = () => {
    setIsMarking(!isMarking); // İşaretleme durumunu tersine çevir (açma/kapatma)
    if (isMarking) {
      setSelectedPhotos([]); // İşaretleme iptal edildiğinde seçili fotoğrafları temizle
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Fotoğrafı Sil',
      'Fotoğrafı silmek istediğinizden emin misiniz?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: () => {
            // Silme işlemi burada gerçekleştirilecek
            const updatedPhotos = photos.filter((photo) => !selectedPhotos.includes(photo));
            setPhotos(updatedPhotos);
            setSelectedPhotos([]);
            // AsyncStorage'den fotoğrafı sil
            AsyncStorage.setItem('user_photos', JSON.stringify(updatedPhotos))
              .then(() => console.log('Fotoğraf başarıyla silindi.'))
              .catch((error) => console.error('Fotoğraf silinirken bir hata oluştu:', error));
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const navigateToCombineScreen = () => {
    navigation.navigate('Combine', { selectedPhotos: selectedPhotos });

  };
  
  const handleCombine = () => {
    navigateToCombineScreen();
  };
  

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
    setSelectedPhotoIndex(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Gardrop</Text>
      <TouchableOpacity
        style={styles.markButton}
        onPress={handleMark}
      >
        <Text style={styles.markButtonText}>{isMarking ? 'İptal' : 'İşaretle'}</Text>
      </TouchableOpacity>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handlePhotoPress(item, index)}>
            <Image
              source={{ uri: item }}
              style={[styles.image, { borderColor: selectedPhotos.includes(item) ? 'black' : 'transparent' },
                      selectedPhotoIndex === index ? styles.selectedImage : null]}
            />
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.fullSizeImage} />
          <View style={styles.closeButtonContainer}>
            <Button title="Kapat" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      {isDeleteActive && (
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Sil</Text>
        </TouchableOpacity>
      )}
      {isCombineActive && (
        <TouchableOpacity
          style={[styles.actionButton, styles.combineButton]}
          onPress={handleCombine}
        >
          <Text style={styles.actionButtonText}>Kombin Yap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20, 
    color: 'black', 
  },
  markButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    zIndex: 1,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  markButtonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 140,
    height: 140,
    margin: 5,
    borderWidth: 2,
  },
  selectedImage: {
    borderColor: 'black',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 800, 
    right: 192,
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'darkred',
    left: 10,
  },
  combineButton: {
    backgroundColor: 'black',
    right: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Gardrop;
