import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const backgroundStyle = {
    backgroundColor: '#FFFDD0', // Açık bir krem rengi
  };

  return (
    <ImageBackground source={require('./images/OIG3.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, styles.kiyafetEkleButton]} onPress={() => navigation.navigate('AddClothes')}>
          <Text style={styles.buttonText}>Kıyafet Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.gardropButton]} onPress={() => navigation.navigate('Gardrop')}>
          <Text style={styles.buttonText}>Gardrop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.kombinYapButton]} onPress={() => navigation.navigate('KombinYap')}>
          <Text style={styles.buttonText}>Kombin Yap</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgb(255, 253, 208)', // Ana ekran arka planı krem rengi
  },
  
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  kiyafetEkleButton: {
    backgroundColor: 'blue', // Kıyafet Ekle butonunun arka planı mavi
  },
  gardropButton: {
    backgroundColor: 'brown', // Gardrop yazısının arka planı kahverengi
  },
  kombinYapButton: {
    backgroundColor: 'green', // Kombin Yap yazısının arka planı mavi'den yeşile belirsiz geçiş
    borderWidth: 1,
    borderColor: 'blue',
  },
});

export default HomeScreen;