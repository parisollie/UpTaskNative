import React, { useState } from 'react'
import { Button, Text, Heading, Input, FormControl,useToast, NativeBaseProvider,Stack,Box } from 'native-base'
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native'


// VID 367, Apollo 
import { gql, useMutation } from '@apollo/client';

const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario(input:$input)
    }
`;

const CrearCuenta = () => {
    //Vid 366, State del formulario
    const [nombre, guardarNombre] = useState('');
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    // Agregamos el hook useToast-- NOTIFICACIONES 
    const toast = useToast(); 

    //Vid 363 ,React navigation
    const navigation = useNavigation();

    //VID 367,HOOK Mutation de apollo
    const [ crearUsuario ] = useMutation(NUEVA_CUENTA);

    // Cuando el usuario presiona en crear cuenta
    const handleSubmit = async () => {
        // Vid 366, validar
        if(nombre === '' || email === '' || password === '') {
            // Mostrar un error
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }

        // password al menos 6 caracteres
        if(password.length < 6) {
            mostrarAlerta('El password debe ser de al menos 6 caracteres');
            return;
        }

        //VID 367 ,guardar el usuario

        try {
            const { data } = await crearUsuario({
                //En apollo nos dice que son variables.
                variables: {
                    input: {
                        nombre, 
                        email,
                        password
                    }
                }
            });
            //console.log(data)
            //Vid 368 
            mostrarAlerta(data.crearUsuario);
            navigation.navigate('Login');
        } catch (error) {
            //Vid 368 
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }
    }

    // Vid 366, muestra un mensaje toast
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
                           
                            <Input 
                                variant="underlined" p={2} 
                                placeholder="Nombre"
                                onChangeText={ texto => guardarNombre(texto) }
                            />
                        </Stack>

                        <Stack  inlineLabel last style={globalStyles.input}>
                            
                            <Input 
                                variant="underlined" p={2}
                                placeholder="Email" 
                                onChangeText={ texto => guardarEmail(texto) }
                            />
                        </Stack>

                        <Stack inlineLabel last style={globalStyles.input} >
                         
                            <Input 
                                secureTextEntry={true}
                                variant="underlined" p={2} 
                                placeholder="Password" 
                                onChangeText={ texto => guardarPassword(texto) }
                            />
                        </Stack>
                    </Stack>
                </FormControl>

                <Button
                    style={globalStyles.boton}
                    square
                    block
                    onPress={ () => handleSubmit() }
                >
                     <Text 
                    style={globalStyles.botonTexto}
                    >Crear Cuenta</Text>

                </Button> 
            </Box>
        </Box>

    </NativeBaseProvider>
    
    );
}

export default CrearCuenta;

