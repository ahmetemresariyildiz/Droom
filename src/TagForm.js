import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const colors = ['Mavi', 'Yeşil', 'Kırmızı', 'Siyah', 'Beyaz', 'Sarı', 'Turuncu', 'Pembe', 'Mor', 'Kahverengi', 'Gri'];
const categories = ['Üst', 'Alt', 'Ayakkabı', 'Aksesuar'];
const seasons = ['Yaz', 'Kış', 'İlkbahar', 'Sonbahar'];
const dressCodes = ['Günlük', 'İş', 'Özel Gün', 'Spor'];
const brands = ['Boyner', 'Mavi', 'Koton', 'Nautica', 'LC Waikiki'];

const TagForm = ({ onSave, onFilter, initialTags }) => {
  const [color, setColor] = useState(initialTags.color || '');
  const [category, setCategory] = useState(initialTags.category || '');
  const [season, setSeason] = useState(initialTags.season || '');
  const [dressCode, setDressCode] = useState(initialTags.dressCode || '');
  const [brand, setBrand] = useState(initialTags.brand || '');
  const [modalVisible, setModalVisible] = useState(true);

  const handleSave = () => {
    onSave({ color, category, season, dressCode, brand });
    setModalVisible(false);
  };

  const handleFilter = () => {
    onFilter({ color, category, season, dressCode, brand });
    setModalVisible(false);
  };

  const resetFilters = () => {
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.label}>Renk:</Text>
              <Picker
                selectedValue={color}
                onValueChange={(itemValue) => setColor(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seç" value="" />
                {colors.sort().map((color, index) => (
                  <Picker.Item key={index} label={color} value={color} />
                ))}
              </Picker>
              <Text style={styles.label}>Kategori:</Text>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seç" value="" />
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
              <Text style={styles.label}>Sezon:</Text>
              <Picker
                selectedValue={season}
                onValueChange={(itemValue) => setSeason(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seç" value="" />
                {seasons.map((season, index) => (
                  <Picker.Item key={index} label={season} value={season} />
                ))}
              </Picker>
              <Text style={styles.label}>Giyim Kodu:</Text>
              <Picker
                selectedValue={dressCode}
                onValueChange={(itemValue) => setDressCode(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seç" value="" />
                {dressCodes.map((dressCode, index) => (
                  <Picker.Item key={index} label={dressCode} value={dressCode} />
                ))}
              </Picker>
              <Text style={styles.label}>Marka:</Text>
              <Picker
                selectedValue={brand}
                onValueChange={(itemValue) => setBrand(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seç" value="" />
                {brands.map((brand, index) => (
                  <Picker.Item key={index} label={brand} value={brand} />
                ))}
              </Picker>
            </ScrollView>
            <View style={styles.buttonRow}>
              <Button title="Filtreleri Sıfırla" onPress={resetFilters} />
              <Button title="Kaydet" onPress={handleSave} />
              <Button title="Filtrele" onPress={handleFilter} />
            </View>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    height: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollView: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default TagForm;
