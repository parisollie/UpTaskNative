
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Heading, FormControl, Stack, Input, useToast,Box} from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';

//Vid 376
const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput ) {
        nuevoProyecto(input : $input){
            nombre
            id
        }
    }
`;

//Vid 376, Actualizar el cache

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;
 
const NuevoProyecto = () => {
    // Agregamos el hook useToast-- NOTIFICACIONES 
    const toast = useToast();

    //Vid 375 state del componente
    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);
    // navigation
    const navigation = useNavigation();

    //Vid 376 ,Apollo
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        //Vid 379, actualizamos el cache con la respuesta de data
        update(cache, { data: { nuevoProyecto }}) {
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    });

    // Validar crear proyecto
    const handleSubmit = async () => {
        if(nombre === '') {
            mostrarAlerta('El Nombre del Proyecto es Obligatorio');
            return;
        }

        //Vid 376, Guardar el Proyecto en la base de datos

        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });
            // console.log(data);
            mostrarAlerta('Proyecto Creado Correctamente');
            navigation.navigate("Proyectos");

        } catch (error) {
            // console.log(error);
            guardarMensaje(error.message.replace('GraphQL error:', '' ))
        }
    }

     //Vid 375, muestra un mensaje toast
     const mostrarAlerta = (mensaje) => {
        toast.show({
            description: mensaje,
            duration: 5000,
        });
    };

    return (
        <Box style={[ globalStyles.contenedor , { backgroundColor: '#A3F14A'}]}>
            <View style={globalStyles.contenido}>
                <Heading style={globalStyles.subtitulo}>Selecciona un Proyecto</Heading>
                    <FormControl>
                        <Stack space={5}>
                            <Stack inlineLabel last style={globalStyles.input}>
                                <FormControl.Label>Nombre Proyecto </FormControl.Label>
                                    <Input 
                                        variant="underlined" p={2} 
                                        placeholder="Nombre del proyecto" 
                                        //Vid 375
                                        onChangeText={ texto => guardarNombre(texto) }
                                    />
                            </Stack>
                         </Stack>
                    </FormControl>

                    <Button
                        style={[globalStyles.boton, { marginTop: 30}]}
                        square
                        block
                        //Vid 375
                        onPress={ () => handleSubmit() }
                    >
                        <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
                    </Button>
            </View>
        </Box>
  );
}

export default NuevoProyecto;

