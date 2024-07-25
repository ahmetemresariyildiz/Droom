import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const initialColors = ['Mavi', 'Yeşil', 'Kırmızı', 'Siyah', 'Beyaz', 'Sarı', 'Turuncu', 'Pembe', 'Mor', 'Kahverengi', 'Gri'];
const initialCategories = ['Üst', 'Alt', 'Ayakkabı', 'Aksesuar'];
const initialSeasons = ['Yaz', 'Kış', 'İlkbahar', 'Sonbahar'];
const initialDressCodes = ['Günlük', 'İş', 'Özel Gün', 'Spor'];
const initialBrands = ['Boyner', 'Mavi', 'Koton', 'Nautica', 'LC Waikiki'];

const TagForm = ({ onSave, initialTags }) => {
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

  const addNewTag = () => {
    if (newTag) {
      switch (tagType) {
        case 'color':
          setColors([...colors, newTag]);
          setColor(newTag);
          break;
        case 'category':
          setCategories([...categories, newTag]);
          setCategory(newTag);
          break;
        case 'season':
          setSeasons([...seasons, newTag]);
          setSeason(newTag);
          break;
        case 'dressCode':
          setDressCodes([...dressCodes, newTag]);
          setDressCode(newTag);
          break;
        case 'brand':
          setBrands([...brands, newTag]);
          setBrand(newTag);
          break;
        default:
          break;
      }
      setNewTag('');
      setTagType(null);
    }
  };

  const handleSave = () => {
    onSave({ color, category, season, dressCode, brand });
    Alert.alert('Kayıt Başarılı', 'Etiketler başarıyla kaydedildi.', [{ text: 'Tamam' }]);
    resetTags();
  };

  const resetTags = () => {
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
  };

  return (
    <View style={styles.container}>
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
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {color === "add" && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Renk Ekle"
              placeholderTextColor="gray" // Placeholder rengi eklendi
            />
            <Button title="Kaydet" onPress={() => { setTagType('color'); addNewTag(); }} />
          </View>
        )}

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
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {category === "add" && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Kategori Ekle"
              placeholderTextColor="gray" // Placeholder rengi eklendi
            />
            <Button title="Kaydet" onPress={() => { setTagType('category'); addNewTag(); }} />
          </View>
        )}

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
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {season === "add" && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Sezon Ekle"
              placeholderTextColor="gray" // Placeholder rengi eklendi
            />
            <Button title="Kaydet" onPress={() => { setTagType('season'); addNewTag(); }} />
          </View>
        )}

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
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {dressCode === "add" && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Giyim Kodu Ekle"
              placeholderTextColor="gray" // Placeholder rengi eklendi
            />
            <Button title="Kaydet" onPress={() => { setTagType('dressCode'); addNewTag(); }} />
          </View>
        )}

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
          <Picker.Item label="Ekle" value="add" />
        </Picker>
        {brand === "add" && (
          <View style={styles.addNewTag}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Yeni Marka Ekle"
              placeholderTextColor="gray" // Placeholder rengi eklendi
            />
            <Button title="Kaydet" onPress={() => { setTagType('brand'); addNewTag(); }} />
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
