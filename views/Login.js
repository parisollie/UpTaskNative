import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Box, Button, Input, Heading, FormControl, Stack, Text,useToast, NativeBaseProvider } from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
// Apollo 
import { gql, useMutation } from '@apollo/client';

//Vid 370
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input ) {
        token
        }
    }
`;

const Login = () => {

    // State del formulario
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');
    // Agregamos el hook useToast-- NOTIFICACIONES 
    const toast = useToast();  
    const [mensaje, guardarMensaje] = useState(null);
    // React navigation
    const navigation = useNavigation();
    //Vid 371, Mutation de apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    // Cuando el usuario presiona en iniciar sesion
    const handleSubmit = async () => {
        // validar
        if(  email === '' || password === '') {
            // Mostrar un error
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }

        try {
            //Vid 371. autenticar el usuario
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    },
                },
            });

            const { token  } = data.autenticarUsuario;
            // Vid 372, Colocar token en storage
            await AsyncStorage.setItem('token', token);
            //Vid 372  Redireccionar a Proyectos
            navigation.navigate("Proyectos");
        } catch (error) {
            // si hay un error mostrarlo
            mostrarAlerta(error.message.replace('GraphQL error: ', ''));

        }
    }

    // muestra un mensaje toast
    const mostrarAlerta = (mensaje) => {
        toast.show({
            description: mensaje,
            duration: 5000,
        });
    };
    
  return (
    <NativeBaseProvider>
        <Box style={ [ globalStyles.contenedor,  { backgroundColor: '#A3F14A' }]}>
           <Box style={globalStyles.contenido}>
                <Heading style={globalStyles.titulo}>UpTask</Heading>

                <FormControl>
                    <Stack space={5}>
                        <Stack  inlineLabel last style={globalStyles.input}>
                            <FormControl.Label>Username</FormControl.Label>
                            <Input 
                                variant="underlined" p={2} 
                                placeholder="Email" 
                                //Vid 3880, que el correo empiece con letras minusculas
                                onChangeText={texto => guardarEmail(texto.toLowerCase() ) }
                                value={email}
                            />
                        </Stack>

                        <Stack inlineLabel last style={globalStyles.input} >
                            <FormControl.Label>Password</FormControl.Label>
                            <Input 
                                secureTextEntry={true}
                                variant="underlined" p={2} 
                                placeholder="Password" 
                                onChangeText={texto => guardarPassword(texto) }
                            />
                        </Stack>
                    </Stack>
                </FormControl>

                <Button
                    style={globalStyles.boton}
                    square
                    block
                    onPress={() => handleSubmit() }
                >
                    <Text>Iniciar Sesión </Text>
                </Button>

                 <Text 
                    onPress={ () => navigation.navigate("CrearCuenta") }
                    style={globalStyles.enlace}
                    >Crear Cuenta
                </Text>
                    
            </Box>
        </Box>

    </NativeBaseProvider>
    
  );
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    }
})
export default Login;
