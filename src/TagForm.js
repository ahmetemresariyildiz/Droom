import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TagForm = ({ onSave, onFilter, initialTags = {} }) => {
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    setColor(initialTags.color || '');
    setCategory(initialTags.category || '');
    setSeason(initialTags.season || '');
    setDressCode(initialTags.dressCode || '');
    setBrand(initialTags.brand || '');
  }, [initialTags]);

  const handleSave = () => {
    const newTags = { color, category, season, dressCode, brand };
    onSave(newTags);
    // Reset form after saving
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
  };

  const handleResetTags = () => {
    setColor('');
    setCategory('');
    setSeason('');
    setDressCode('');
    setBrand('');
  };

  const handleFilter = () => {
    const filterTags = { color, category, season, dressCode, brand };
    onFilter(filterTags);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Renk</Text>
          <Picker
            selectedValue={color}
            onValueChange={(itemValue) => setColor(itemValue)}
            style={styles.picker}
            prompt="Renk Seçiniz"
          >
            <Picker.Item label="Seç" value="" />
            <Picker.Item label="Kırmızı" value="Kırmızı" />
            <Picker.Item label="Mavi" value="Mavi" />
            <Picker.Item label="Yeşil" value="Yeşil" />
            <Picker.Item label="Beyaz" value="Beyaz" />
            <Picker.Item label="Siyah" value="Siyah" />
          </Picker>

          <Text style={styles.label}>Kategori</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
            prompt="Kategori Seçiniz"
          >
            <Picker.Item label="Seç" value="" />
            <Picker.Item label="Üst Giyim" value="Üst Giyim" />
            <Picker.Item label="Alt Giyim" value="Alt Giyim" />
            <Picker.Item label="Ayakkabı" value="Ayakkabı" />
          </Picker>

          <Text style={styles.label}>Mevsim</Text>
          <Picker
            selectedValue={season}
            onValueChange={(itemValue) => setSeason(itemValue)}
            style={styles.picker}
            prompt="Mevsim Seçiniz"
          >
            <Picker.Item label="Seç" value="" />
            <Picker.Item label="İlkbahar" value="İlkbahar" />
            <Picker.Item label="Yaz" value="Yaz" />
            <Picker.Item label="Sonbahar" value="Sonbahar" />
            <Picker.Item label="Kış" value="Kış" />
          </Picker>

          <Text style={styles.label}>Dress Code</Text>
          <Picker
            selectedValue={dressCode}
            onValueChange={(itemValue) => setDressCode(itemValue)}
            style={styles.picker}
            prompt="Dress Code Seçiniz"
          >
            <Picker.Item label="Seç" value="" />
            <Picker.Item label="İş" value="İş" />
            <Picker.Item label="Spor" value="Spor" />
            <Picker.Item label="Gece Dışarı Çıkma" value="Gece Dışarı Çıkma" />
          </Picker>

          <Text style={styles.label}>Marka</Text>
          <Picker
            selectedValue={brand}
            onValueChange={(itemValue) => setBrand(itemValue)}
            style={styles.picker}
            prompt="Marka Seçiniz"
          >
            <Picker.Item label="Seç" value="" />
            <Picker.Item label="Mavi" value="Mavi" />
            <Picker.Item label="Koton" value="Koton" />
            <Picker.Item label="Boyner" value="Boyner" />
            <Picker.Item label="Zara" value="Zara" />
            <Picker.Item label="LC Waikiki" value="LC Waikiki" />
          </Picker>

          <View style={styles.buttonContainer}>
            <Button title="Kaydet" onPress={handleSave} color="#1E90FF" />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Etiketleri Sıfırla"
              onPress={handleResetTags}
              color="#FF6347"
              disabled={!color && !category && !season && !dressCode && !brand}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Filtrele" onPress={handleFilter} color="#1E90FF" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: Platform.OS === 'ios' ? 15 : 12,
    marginBottom: 10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default TagForm;
