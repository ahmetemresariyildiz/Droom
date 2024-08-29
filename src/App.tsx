import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Gardrop from './Gardrop'; 
import HomeScreen from './HomeScreen';
import AddClothes from './AddClothes';
import Combine from './Combine'
import TestButton from './TestButton';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Ana Sayfa"
          component={HomeScreen}
          options={{
            headerShown: false,           
          }}
        />
        <Stack.Screen
          name="Gardrop"
          component={Gardrop}
          options={{
            headerShown: false,            
          }}
        />
        <Stack.Screen
          name="AddClothes"
          component={AddClothes}
          options={{
            headerShown: false,           
          }}
        />

        <Stack.Screen
          name="Combine"
          component={Combine}
          options={{
            headerShown: false,           
          }}
        />
         <Stack.Screen
          name="TestButton"
          component={TestButton}
          options={{
            headerShown: false,           
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
