import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Filter = ({ visible, onClose, onFilter, onReset, tagFormFilters }) => {
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [brand, setBrand] = useState('');

  const [filters, setFilters] = useState({
    colors: [],
    categories: [],
    seasons: [],
    dressCodes: [],
    brands: []
  });

  useEffect(() => {
    // AsyncStorage'dan etiket sınıflarını yükle
    const loadFilters = async () => {
      try {
        const loadedColors = await AsyncStorage.getItem('colors');
        const loadedCategories = await AsyncStorage.getItem('categories');
        const loadedSeasons = await AsyncStorage.getItem('seasons');
        const loadedDressCodes = await AsyncStorage.getItem('dressCodes');
        const loadedBrands = await AsyncStorage.getItem('brands');

        setFilters({
          colors: loadedColors ? JSON.parse(loadedColors) : [],
          categories: loadedCategories ? JSON.parse(loadedCategories) : [],
          seasons: loadedSeasons ? JSON.parse(loadedSeasons) : [],
          dressCodes: loadedDressCodes ? JSON.parse(loadedDressCodes) : [],
          brands: loadedBrands ? JSON.parse(loadedBrands) : [],
        });
      } catch (error) {
        console.error('Error loading filters', error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    if (tagFormFilters) {
      console.log('Updating filters with tagFormFilters:', tagFormFilters); // Debug log
      setFilters((prevFilters) => ({
        ...prevFilters,
        colors: tagFormFilters.colors || prevFilters.colors,
        categories: tagFormFilters.categories || prevFilters.categories,
        seasons: tagFormFilters.seasons || prevFilters.seasons,
        dressCodes: tagFormFilters.dressCodes || prevFilters.dressCodes,
        brands: tagFormFilters.brands || prevFilters.brands,
      }));
    }
  }, [tagFormFilters]);

  const handleFilter = () => {
    onFilter({ color, category, season, dressCode, brand });
    onClose();
  };

  const handleReset = () => {
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
    onReset();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Filtrele</Text>
        <Picker selectedValue={color} onValueChange={(itemValue) => setColor(itemValue)} style={styles.picker}>
          <Picker.Item label="Renk Seçin" value="" />
          {filters.colors?.map((color, index) => (
            <Picker.Item key={index} label={color} value={color} />
          ))}
        </Picker>
        <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
          <Picker.Item label="Kategori Seçin" value="" />
          {filters.categories?.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <Picker selectedValue={season} onValueChange={(itemValue) => setSeason(itemValue)} style={styles.picker}>
          <Picker.Item label="Sezon Seçin" value="" />
          {filters.seasons?.map((season, index) => (
            <Picker.Item key={index} label={season} value={season} />
          ))}
        </Picker>
        <Picker selectedValue={dressCode} onValueChange={(itemValue) => setDressCode(itemValue)} style={styles.picker}>
          <Picker.Item label="Giyim Kodu Seçin" value="" />
          {filters.dressCodes?.map((dressCode, index) => (
            <Picker.Item key={index} label={dressCode} value={dressCode} />
          ))}
        </Picker>
        <Picker selectedValue={brand} onValueChange={(itemValue) => setBrand(itemValue)} style={styles.picker}>
          <Picker.Item label="Marka Seçin" value="" />
          {filters.brands?.map((brand, index) => (
            <Picker.Item key={index} label={brand} value={brand} />
          ))}
        </Picker>
        <View style={styles.buttonContainer}>
          <Button title="Filtrele" onPress={handleFilter} />
          <Button title="Sıfırla" onPress={handleReset} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    height: '80%',
    marginVertical: Dimensions.get('window').height * 0.1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f0f0f0', // Picker'ların arka plan rengini belirleyelim
    color: '#000', // Picker seçimlerinin görünürlüğünü artırmak için
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});


export default Filter;
