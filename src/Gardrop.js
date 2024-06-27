import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, FlatList, Modal, Alert, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import TagForm from './TagForm';

const Gardrop = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const [isCombineActive, setIsCombineActive] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [tags, setTags] = useState({});
  const [filters, setFilters] = useState({
    color: '',
    category: '',
    season: '',
    dressCode: '',
    brand: '',
  });
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem('user_photos');
        const storedTags = await AsyncStorage.getItem('photo_tags');
        if (storedPhotos !== null) {
          const parsedPhotos = JSON.parse(storedPhotos);
          setPhotos(parsedPhotos);
          setFilteredPhotos(parsedPhotos); // Filtrelenmemiş fotoğrafları ilk başta göster
        } else {
          setPhotos([]);
          setFilteredPhotos([]);
        }
        if (storedTags !== null) {
          const parsedTags = JSON.parse(storedTags);
          setTags(parsedTags);
        } else {
          setTags({});
        }
      } catch (error) {
        console.error('Fotoğrafları alma hatası:', error);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
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
      setSelectedPhotoIndex(index);
      setModalVisible(true);
    }
  };

  const handleMark = () => {
    setIsMarking(!isMarking);
    if (isMarking) {
      setSelectedPhotos([]);
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
            const updatedPhotos = photos.filter((photo) => !selectedPhotos.includes(photo));
            setPhotos(updatedPhotos);
            setSelectedPhotos([]);
            AsyncStorage.setItem('user_photos', JSON.stringify(updatedPhotos))
              .then(() => console.log('Fotoğraf başarıyla silindi.'))
              .catch((error) => console.error('Fotoğraf silinirken bir hata oluştu:', error));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCombine = () => {
    const validSelectedPhotos = selectedPhotos.filter(photo => photos.includes(photo));

    if (validSelectedPhotos.length === selectedPhotos.length) {
      navigation.navigate('Combine', { selectedPhotos });
    } else {
      console.error('ERROR: Invalid URIs for photos:', selectedPhotos.filter(photo => !photos.includes(photo)));
      // veya başka bir hata işleme mekanizması ekleyin
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPhotoIndex(null);
  };

  const handleTagPhoto = () => {
    setTagModalVisible(true);
  };

  const handleSaveTags = async (newTags) => {
    const photoUris = selectedPhotos.length > 0 ? selectedPhotos : [photos[selectedPhotoIndex]];
    const updatedTags = { ...tags };
    photoUris.forEach(photoUri => {
      updatedTags[photoUri] = newTags;
    });
    setTags(updatedTags);
    setTagModalVisible(false);
    await AsyncStorage.setItem('photo_tags', JSON.stringify(updatedTags));
    handleFilter(filters); // Filtreyi yeniden uygula
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    const filtered = photos.filter((photo) => {
      const photoTags = tags[photo];
      if (!photoTags) return false;
      return Object.keys(newFilters).every((key) => {
        if (!newFilters[key]) return true;
        return photoTags[key] === newFilters[key];
      });
    });
    setFilteredPhotos(filtered.length > 0 ? filtered : photos); // Filtre sonucu boş ise tüm fotoğrafları göster
    setTagModalVisible(false); // Filtre uygulandıktan sonra pop-up'ı kapat
  };

  const renderPhotoItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePhotoPress(item, index)}>
      <Image
        source={{ uri: item }}
        style={[styles.image, { borderColor: selectedPhotos.includes(item) ? 'black' : 'transparent' }]}
      />
    </TouchableOpacity>
  );

  const numColumns = 4;
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / numColumns - 10;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Gardrop</Text>
      <FlatList
        data={filteredPhotos}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 5 }}
        renderItem={renderPhotoItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: photos[selectedPhotoIndex] }} style={styles.modalImage} />
        </View>
        <View style={styles.modalBottomButtons}>
          <TouchableOpacity style={styles.modalBottomButton} onPress={handleTagPhoto}>
            <Text style={styles.modalBottomButtonText}>Etiketle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalBottomButton} onPress={closeModal}>
            <Text style={styles.modalBottomButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => setTagModalVisible(false)}
      >
        <View style={styles.tagModalContainer}>
          <ScrollView contentContainerStyle={styles.tagModalContent}>
            <Text style={styles.tagTitle}>Etiketler</Text>
            <TagForm
              onSave={handleSaveTags}
              onFilter={handleFilter}
              initialTags={tags[selectedPhotos[0]] || tags[photos[selectedPhotoIndex]] || {}} // Seçilen fotoğrafların etiketlerini geç
            />
          </ScrollView>
        </View>
      </Modal>
      {isDeleteActive && (
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.actionButtonText}>Sil</Text>
        </TouchableOpacity>
      )}
      {isCombineActive && (
        <TouchableOpacity style={[styles.actionButton, styles.combineButton]} onPress={handleCombine}>
          <Text style={styles.actionButtonText}>Kombin Yap</Text>
        </TouchableOpacity>
      )}
      {/* İşaretle butonu */}
      <TouchableOpacity style={[styles.bottomButton, styles.markButton]} onPress={handleMark}>
        <Text style={styles.bottomButtonText}>{isMarking ? 'İptal' : 'İşaretle'}</Text>
      </TouchableOpacity>
      {/* Filtrele butonu */}
      <TouchableOpacity style={[styles.bottomButton, styles.filterButton]} onPress={() => setTagModalVisible(true)}>
        <Text style={styles.bottomButtonText}>Filtrele</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: Dimensions.get('window').width / 4 - 10,
    height: Dimensions.get('window').width / 4 - 10,
    margin: 5,
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  modalBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  modalBottomButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  modalBottomButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  combineButton: {
    backgroundColor: 'green',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  tagModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  tagModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  tagTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  markButton: {
    backgroundColor: '#FFA500',
  },
  filterButton: {
    backgroundColor: '#FF1493',
    bottom: 80,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Gardrop;
