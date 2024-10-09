import React from 'react';
import 'react-native-gesture-handler';
import {NativeBaseProvider} from 'native-base'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Login from './views/Login';
import CrearCuenta from './views/CrearCuenta';
//Vid 372
import Proyectos from './views/Proyectos';
//Vid 375
import NuevoProyecto from './views/NuevoProyecto';
////Vid 378
import Proyecto from './views/Proyecto';

const App = () => {
  return (
    <>
        <NativeBaseProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{
                        //Vid 
                        title: "Iniciar Sesión",
                        headerShown: false
                      }}
                    />

                    <Stack.Screen
                      name="CrearCuenta"
                      component={CrearCuenta}
                      options={{
                        //Vid 363
                        title: "Crear Cuenta", 
                        headerStyle: {
                          backgroundColor: '#28303B'
                        }, 
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold'
                        }
                      }}
                    />

                    <Stack.Screen
                      name="Proyectos"
                      component={Proyectos}
                      options={{
                        title: "Proyectos", 
                        headerStyle: {
                          backgroundColor: '#28303B'
                        }, 
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold'
                        }
                      }}
                    />

                    <Stack.Screen
                    //Vid 375
                      name="NuevoProyecto"
                      component={NuevoProyecto}
                      options={{
                        title: "Nuevo Proyecto", 
                        headerStyle: {
                          backgroundColor: '#28303B'
                        }, 
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold'
                        }
                      }}
                    />


                    <Stack.Screen
                    //Vid 375
                      name="Proyecto"
                      //Vid 378
                      component={Proyecto}
                      options={ ({route}) => ({
                        title: route.params.nombre, 
                        headerStyle: {
                          backgroundColor: '#28303B'
                        }, 
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold'
                        }
                      })}
                    />
              </Stack.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
    </>
  );
};

export default App;

