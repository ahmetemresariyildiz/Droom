import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, FlatList, Modal, Alert, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import TagForm from './TagForm';
import Filter from './Filter';

const Gardrop = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const [isCombineActive, setIsCombineActive] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tags, setTags] = useState({});
  const [filters, setFilters] = useState({
    color: '',
    category: '',
    season: '',
    dressCode: '',
    brand: '',
  });
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem('user_photos');
        if (storedPhotos !== null) {
          const parsedPhotos = JSON.parse(storedPhotos);
          setPhotos(parsedPhotos);
          setFilteredPhotos(parsedPhotos);
        }
      } catch (error) {
        console.error('Fotoğrafları alma hatası:', error);
      }
    };
  
    loadPhotos();
  }, []);
  

  useEffect(() => {
    if (selectedPhotos.length > 0) {
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
      setShowButtons(false);
    }
  };

  const handleMark = () => {
    if (isMarking) {
      // İşaretleme modu kapatıldığında işaretli fotoğrafları temizle
      setSelectedPhotos([]);
    }
    setIsMarking(!isMarking);
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
            setFilteredPhotos(updatedPhotos);
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
    console.log('Selected Photos:', selectedPhotos);
    console.log('Photos List:', photos);
  
    const validSelectedPhotos = selectedPhotos.filter(photo => photos.includes(photo));
    console.log('Valid Selected Photos:', validSelectedPhotos);
  
    if (validSelectedPhotos.length === selectedPhotos.length) {
      const selectedPhotoIndices = validSelectedPhotos.map(photo => photos.indexOf(photo));
      navigation.navigate('Combine', { selectedPhotos: selectedPhotoIndices });
      console.log('Selected Photos Indices:', selectedPhotoIndices);
    } else {
      console.error('ERROR: Invalid URIs for photos:', selectedPhotos.filter(photo => !photos.includes(photo)));
    }
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedPhotoIndex(null);
    setShowButtons(true);
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
    handleFilter(filters);
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
    setFilteredPhotos(filtered);
    setFilterModalVisible(false);
  };
  

  const renderPhotoItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePhotoPress(item, index)}>
      <View style={styles.photoContainer}>
        {item ? (
          <Image
            source={{ uri: item }}
            style={[styles.image, { borderColor: 'transparent' }]} // Çerçeve stilini kaldırıyoruz
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text>Görsel bulunamadı</Text>
          </View>
        )}
        {selectedPhotos.includes(item) && (
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmark} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  

  const numColumns = 4;
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / numColumns - 10;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Gardrop</Text>
      </View>

      <View style={styles.photoListContainer}>
        <FlatList
          data={filteredPhotos}
          numColumns={numColumns}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 1 }}
          renderItem={renderPhotoItem}
        />
      </View>

      <Filter
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilter={handleFilter}
        onReset={() => {
          setFilters({
            color: '',
            category: '',
            season: '',
            dressCode: '',
            brand: '',
          });
          setFilteredPhotos(photos);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
            <Image source={{ uri: filteredPhotos[selectedPhotoIndex] }} style={styles.modalImage} />
            </View>
            <View style={styles.modalBottomButtons}>
              <TouchableOpacity style={styles.modalBottomButton} onPress={handleTagPhoto}>
                <Text style={styles.modalBottomButtonText}>Etiketle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBottomButton} onPress={closeModal}>
                <Text style={styles.modalBottomButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => setTagModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTagModalVisible(false)}>
          <View style={styles.tagModalContainer}>
            <TouchableWithoutFeedback>
              <ScrollView contentContainerStyle={styles.tagModalContent}>
                <TagForm
                  onSave={handleSaveTags}
                  initialTags={tags[selectedPhotos[0]] || tags[photos[selectedPhotoIndex]] || {}}
                />
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {isMarking && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.combineButton]}
            onPress={handleCombine}
          >
            <Text style={styles.combineText}>D</Text>
          </TouchableOpacity>
        </View>
      )}

      {showButtons && (
        <View style={styles.bottomButtonsBackground}>
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={[styles.bottomButton, styles.markButton]}
              onPress={handleMark}
            >
              <Text style={styles.bottomButtonText}>{isMarking ? 'İptal' : 'İşaretle'}</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>|</Text>
            <TouchableOpacity
              style={[styles.bottomButton, styles.filterButton]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Text style={styles.bottomButtonText}>Filtrele</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>|</Text>
            <TouchableOpacity
              style={[styles.bottomButton, styles.tagButton]}
              onPress={() => setTagModalVisible(true)}
            >
              <Text style={styles.bottomButtonText}>Etiketle</Text>
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
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  photoContainer: {
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width / 4 - 10,
    height: Dimensions.get('window').width / 4 - 10,
    margin: 5,
    borderWidth: 2,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'green', // Boş yuvarlağın sınır rengi
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green', // Dolu yuvarlağın rengi
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  photoListContainer: {
    flex: 1,
    paddingBottom: 50,
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
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
  actionButtonsContainer: {
    position: 'absolute',
    top: 5,
    right: -5,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderColor: 'transparent', // Çöp kovası ve "D" harfi sınır rengini siyah yapıyoruz
    borderWidth: 0, // Çevresindeki yuvarlak alana ihtiyacımız yok
    backgroundColor: 'transparent', // Arka plan rengini saydam yapıyoruz
  },
  deleteButton: {
    backgroundColor: 'black' // Çöp kovası butonunun stili burada yapılacak
  },
  combineButton: {
    backgroundColor: 'transparent' // "D" butonunun stili burada yapılacak
  },
  combineText: {
    color: 'black', // "D" harfini siyah yapıyoruz
    fontSize: 32,
    fontWeight: 'bold',
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
  bottomButtonsBackground: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  markButton: {
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
  },
  tagButton: {
    backgroundColor: '#FFFFFF',
  },
  bottomButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default Gardrop;
