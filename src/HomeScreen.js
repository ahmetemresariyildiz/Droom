import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('./images/OIG3.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, styles.kiyafetEkleButton]} onPress={() => navigation.navigate('AddClothes')}>
          <Image source={require('./images/buttons/AddClothesButton.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Kıyafet Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.gardropButton]} onPress={() => navigation.navigate('Gardrop')}>
          <Image source={require('./images/buttons/GardropButton.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Gardrop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.kombinYapButton]} onPress={() => navigation.navigate('KombinYap')}>
          <Image source={require('./images/buttons/CombineButton.png')} style={styles.buttonIcon} />
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
    flexDirection: 'column',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  button: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // borderWidth: 1,
    top: 80,
  },
  buttonIcon: {
    width: '100%', // Görselin butona göre genişlemesini sağlar
    height: '100%', // Görselin butona göre genişlemesini sağlar
    resizeMode: 'contain', // İçeriğin butona sığmasını sağlar
    position: 'absolute', // Görselin konumunu ayarlar
    top: -15, // Butonun en üstüne hizalar
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    position: 'absolute', // Metnin konumunu ayarlar
    bottom: 10, // Butonun en altına hizalar
  },
});

export default HomeScreen;