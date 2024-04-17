import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Combine = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmSelection = () => {
    // Kullanıcının seçtiği fotoğrafları işleyin
    console.log(selectedPhotos);
    // Modalı kapatın
    setModalVisible(false);
  };

  const handleSelectPhoto = (photoUri) => {
    // Seçilen fotoğrafı state'e ekleyin
    setSelectedPhotos([...selectedPhotos, photoUri]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.combineButton} onPress={handleOpenModal}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          {/* Kullanıcı fotoğraf seçimini gerçekleştirecek component */}
          {/* Örneğin, bu component bir flatlist olabilir */}
          {/* Flatlist içindeki her öğe bir fotoğrafı temsil edebilir */}
          {/* Fotoğraflara tıkladığında handleSelectPhoto fonksiyonunu çağırarak seçim yapabilir */}
          {/* Seçilen fotoğrafları state'te tutarak kullanıcıya gösterebilirsiniz */}
          {/* Örnek olarak buraya bir flatlist ekleyebilirsiniz */}
          <Button title="Onayla" onPress={handleConfirmSelection} />
        </View>
      </Modal>
      {/* Kullanıcının seçtiği fotoğrafları gösterecek container */}
      {/* Örneğin, bu container bir scrollview veya başka bir flatlist olabilir */}
      {/* Seçilen her fotoğrafı burada gösterebilirsiniz */}
      {selectedPhotos.map((photoUri, index) => (
        <Image key={index} source={{ uri: photoUri }} style={styles.selectedImage} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  combineButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
});

export default Combine;
