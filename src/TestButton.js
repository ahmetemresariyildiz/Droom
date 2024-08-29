import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TestButton = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Kullanıcının arama sorgusu
  const [resultText, setResultText] = useState(''); // API'den gelen sonucu saklamak için

  const navigation = useNavigation(); // Navigation kancasını kullanarak navigasyon işlemlerini yapabiliriz

  const handleSearch = async () => {
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDVDo3_NtjiW9nZ6bVsXufLaMwUpMMLwk0"); // API anahtarınızı buraya ekleyin
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Kullanıcının girdiği veriyi prompt içerisine yerleştiriyoruz
      const result = await model.generateContent(searchQuery);
      
      // Sonucu state'e kaydediyoruz
      setResultText(result.response.text());
    } catch (error) {
      console.error('Arama işlemi sırasında hata oluştu:', error);
      setResultText('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Sol üst köşeye Back butonu ekliyoruz */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Aramak istediğiniz kelimeyi yazın:</Text>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Arama..."
        placeholderTextColor="gray"
      />
      <Button title="Ara" onPress={handleSearch} />
      
      {/* Sonucu ekranda göstermek için */}
      {resultText ? <Text style={styles.resultText}>{resultText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Butonun ekranda yukarıdan konumu
    left: 20, // Butonun ekranda soldan konumu
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: 'black',
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
});

export default TestButton;
