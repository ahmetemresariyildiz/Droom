import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons'; // Geri butonu için Ionicons kullanıyoruz
import AddClothes from './AddClothes';

const Gardrop = ({ navigation, existingClothes }) => {
  const [clothes, setClothes] = useState([]); // Kıyafetleri saklayacak state
  const [selectedClothes, setSelectedClothes] = useState([]); // Seçilen kıyafetleri saklayacak state
  const [modalVisible, setModalVisible] = useState(false); // Modal görünürlüğünü saklayacak state
  const [modalMessage, setModalMessage] = useState(''); // Modal içeriğini saklayacak state
  const handleAddToWardrobe = (photoURI) => {
    // Gardroba eklemek için gerekli işlemleri gerçekleştir
    // Örneğin, bir veritabanına veya depolama alanına fotoğrafı ekleyebilirsiniz
    // Ardından, ekleme işleminin başarılı olduğuna dair bir geribildirim gösterebilirsiniz
    console.log("Fotoğraf başarıyla gardroba eklendi:", photoURI);
  };

  // Kıyafet ekleme işlevi
  const addClothes = (newClothes) => {
    const newClothesIds = newClothes.map(item => item.id);
    const existingIds = clothes.map(item => item.id);
    const newClothesToAdd = newClothes.filter(item => !existingIds.includes(item.id));

    setClothes([...clothes, ...newClothesToAdd]); // Yeni kıyafetleri ekleyin
    const addedClothesIds = newClothesToAdd.map(item => item.id);
    const successMessage = 'Kıyafet başarıyla eklendi!';
    const failureMessage = 'Kıyafet zaten ekli!';
    const message = addedClothesIds.length > 0 ? successMessage : failureMessage;
    setModalMessage(message);
    setModalVisible(true); // Modal'ı görünür yap
  };

  // Kıyafet seçme işlevi
  const selectClothes = (item) => {
    if (selectedClothes.includes(item)) {
      // Eğer kıyafet zaten seçiliyse, seçimden kaldır
      setSelectedClothes(selectedClothes.filter((clothing) => clothing !== item));
    } else {
      // Değilse, seç
      setSelectedClothes([...selectedClothes, item]);
    }
  };

  // Kombin yapma işlevi
  const combineOutfits = () => {
    // Seçilen kıyafetlerle kombin yapma işlevi buraya gelecek
    if (selectedClothes.length < 2) {
      setModalMessage('Kombin yapmak için en az 2 kıyafet seçmelisiniz!');
      setModalVisible(true);
      return;
    }

    // Kombin yapılacak kıyafetlerin işlemleri burada yapılacak
    console.log('Kombin yap butonuna basıldı!');
    console.log('Seçilen kıyafetler:', selectedClothes);
  };

  // Modal'ı kapatma işlevi
  const closeModal = () => {
    setModalVisible(false);
  };

  // Kıyafet ekleme onayı işlevi
  const handleConfirm = (selectedImage) => {
    // Burada yapılacak işlemleri gerçekleştirin
    console.log('Selected image:', selectedImage);
    // Kıyafeti ekleme işlevine çağrı yap
    addClothes([{ id: String(Math.random()), image: selectedImage, tag: 'New Clothing' }]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {/* Geri butonu */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Gardrop yazısı */}
        <Text style={styles.title}>Gardrop</Text>
        
      </View>
      {/* Kıyafetlerin listeleneceği FlatList */}
      <FlatList
        data={clothes}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectClothes(item)} style={selectedClothes.includes(item) ? styles.selectedItem : styles.item}>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            {/* Kıyafet etiketi */}
            <Text>{item.tag}</Text> 
          </TouchableOpacity>
        )}
        keyExtractor={(item) => (String(item.id))}
        horizontal
        style={{ borderBottomWidth: 0 }} // Mavi çizgiyi kaldırır
      />


      {/* Kombin yap butonu (sadece çoklu kıyafet seçimi yapıldığında aktif hale gelir) */}
      {selectedClothes.length > 1 && (
        <TouchableOpacity onPress={combineOutfits} style={styles.button}>
          <Text style={styles.buttonText}>Kombin Yap</Text>
        </TouchableOpacity>
      )}

      {/* Uyarı Modal'ı */}
      <Modal isVisible={modalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Tamam</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
