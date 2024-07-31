import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialColors = ['Kırmızı', 'Mavi', 'Yeşil'];
const initialCategories = ['Günlük', 'Resmi'];
const initialSeasons = ['Yaz', 'Kış'];
const initialDressCodes = ['Spor', 'Klasik'];
const initialBrands = ['Nike', 'Adidas'];

const TagForm = ({ onSave, initialTags, photoId }) => {
  const [color, setColor] = useState(initialTags.color || '');
  const [category, setCategory] = useState(initialTags.category || '');
  const [season, setSeason] = useState(initialTags.season || '');
  const [dressCode, setDressCode] = useState(initialTags.dressCode || '');
  const [brand, setBrand] = useState(initialTags.brand || '');
  const [newTag, setNewTag] = useState('');
  const [tagType, setTagType] = useState(null);

  const [colors, setColors] = useState(initialColors);
  const [categories, setCategories] = useState(initialCategories);
  const [seasons, setSeasons] = useState(initialSeasons);
  const [dressCodes, setDressCodes] = useState(initialDressCodes);
  const [brands, setBrands] = useState(initialBrands);

  useEffect(() => {
    loadTags();
  }, []); // Boş bağımlılık dizisi ile sadece bileşen ilk kez yüklendiğinde çalışır.

  const loadTags = async () => {
    try {
      const loadedColors = await AsyncStorage.getItem('colors');
      const loadedCategories = await AsyncStorage.getItem('categories');
      const loadedSeasons = await AsyncStorage.getItem('seasons');
      const loadedDressCodes = await AsyncStorage.getItem('dressCodes');
      const loadedBrands = await AsyncStorage.getItem('brands');

      console.log('Loaded colors:', loadedColors);
      console.log('Loaded categories:', loadedCategories);
      console.log('Loaded seasons:', loadedSeasons);
      console.log('Loaded dress codes:', loadedDressCodes);
      console.log('Loaded brands:', loadedBrands);

      setColors(loadedColors ? JSON.parse(loadedColors) : initialColors);
      setCategories(loadedCategories ? JSON.parse(loadedCategories) : initialCategories);
      setSeasons(loadedSeasons ? JSON.parse(loadedSeasons) : initialSeasons);
      setDressCodes(loadedDressCodes ? JSON.parse(loadedDressCodes) : initialDressCodes);
      setBrands(loadedBrands ? JSON.parse(loadedBrands) : initialBrands);
    } catch (error) {
      console.error('Error loading tags', error);
    }
  };

  const saveTags = async (updatedTags, tagType) => {
    try {
      await AsyncStorage.setItem(tagType, JSON.stringify(updatedTags));
    } catch (error) {
      console.error('Error saving tags', error);
    }
  };

  const addNewTag = async () => {
    if (newTag) {
      let updatedTags;
      switch (tagType) {
        case 'color':
          updatedTags = [...colors, newTag];
          setColors(updatedTags);
          if (color === '') setColor(newTag); // Seçili rengi güncelle
          await saveTags(updatedTags, 'colors');
          break;
        case 'category':
          updatedTags = [...categories, newTag];
          setCategories(updatedTags);
          if (category === '') setCategory(newTag); // Seçili kategoriyi güncelle
          await saveTags(updatedTags, 'categories');
          break;
        case 'season':
          updatedTags = [...seasons, newTag];
          setSeasons(updatedTags);
          if (season === '') setSeason(newTag); // Seçili sezonu güncelle
          await saveTags(updatedTags, 'seasons');
          break;
        case 'dressCode':
          updatedTags = [...dressCodes, newTag];
          setDressCodes(updatedTags);
          if (dressCode === '') setDressCode(newTag); // Seçili giyim kodunu güncelle
          await saveTags(updatedTags, 'dressCodes');
          break;
        case 'brand':
          updatedTags = [...brands, newTag];
          setBrands(updatedTags);
          if (brand === '') setBrand(newTag); // Seçili markayı güncelle
          await saveTags(updatedTags, 'brands');
          break;
        default:
          break;
      }
      setNewTag('');
      setTagType(null);
    }
  };

  const handleSave = async () => {
    const tagsToSave = { color, category, season, dressCode, brand };
    try {
      console.log('Saving tags:', tagsToSave);
      const storedTags = await AsyncStorage.getItem('tags');
      const parsedTags = storedTags ? JSON.parse(storedTags) : {};
      const updatedTags = { ...parsedTags, [photoId]: tagsToSave };
      await AsyncStorage.setItem('tags', JSON.stringify(updatedTags));
      onSave(tagsToSave);
      Alert.alert('Kayıt Başarılı', 'Etiketler başarıyla kaydedildi.', [{ text: 'Tamam' }]);
      resetTags();
    } catch (error) {
      console.error('Error saving tags', error);
      Alert.alert('Kayıt Hatası', 'Etiketler kaydedilirken bir hata oluştu.', [{ text: 'Tamam' }]);
    }
  };

  const resetTags = () => {
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
    onSave({ color: '', category: '', season: '', dressCode: '', brand: '' }); // initialTags'i de sıfırlayın
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.label}>Renk:</Text>
        <Picker
          selectedValue={color}
          onValueChange={(itemValue) => {
            if (itemValue === 'add') {
              setTagType('color');
            } else {
              setColor(itemValue);
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seç" value="" />
          {colors.sort().map((color, index) => (
            <Picker.Item key={index} label={color} value={color} />
          ))}
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {tagType === 'color' && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Renk Ekle"
              placeholderTextColor="gray"
            />
            <Button title="Kaydet" onPress={addNewTag} />
          </View>
        )}

        <Text style={styles.label}>Kategori:</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => {
            if (itemValue === 'add') {
              setTagType('category');
            } else {
              setCategory(itemValue);
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seç" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {tagType === 'category' && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Kategori Ekle"
              placeholderTextColor="gray"
            />
            <Button title="Kaydet" onPress={addNewTag} />
          </View>
        )}

        <Text style={styles.label}>Sezon:</Text>
        <Picker
          selectedValue={season}
          onValueChange={(itemValue) => {
            if (itemValue === 'add') {
              setTagType('season');
            } else {
              setSeason(itemValue);
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seç" value="" />
          {seasons.map((season, index) => (
            <Picker.Item key={index} label={season} value={season} />
          ))}
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {tagType === 'season' && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Sezon Ekle"
              placeholderTextColor="gray"
            />
            <Button title="Kaydet" onPress={addNewTag} />
          </View>
        )}

        <Text style={styles.label}>Giyim Kodu:</Text>
        <Picker
          selectedValue={dressCode}
          onValueChange={(itemValue) => {
            if (itemValue === 'add') {
              setTagType('dressCode');
            } else {
              setDressCode(itemValue);
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seç" value="" />
          {dressCodes.map((dressCode, index) => (
            <Picker.Item key={index} label={dressCode} value={dressCode} />
          ))}
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {tagType === 'dressCode' && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Giyim Kodu Ekle"
              placeholderTextColor="gray"
            />
            <Button title="Kaydet" onPress={addNewTag} />
          </View>
        )}

        <Text style={styles.label}>Marka:</Text>
        <Picker
          selectedValue={brand}
          onValueChange={(itemValue) => {
            if (itemValue === 'add') {
              setTagType('brand');
            } else {
              setBrand(itemValue);
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seç" value="" />
          {brands.map((brand, index) => (
            <Picker.Item key={index} label={brand} value={brand} />
          ))}
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {tagType === 'brand' && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Marka Ekle"
              placeholderTextColor="gray"
            />
            <Button title="Kaydet" onPress={addNewTag} />
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonRow}>
        <Button title="Etiketleri Sıfırla" onPress={resetTags} />
        <Button title="Kaydet" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white',
  },
  scrollView: {
    marginBottom: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  picker: {
    height: 75,
    width: '100%',
    marginBottom: 10,
    color: 'black',
    backgroundColor: '#f0f0f0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addNewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    color: 'black',
  },
});

export default TagForm;
