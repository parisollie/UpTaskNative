import React, { useState } from 'react';
import { Box, Button, Text, Heading,VStack,FormControl,Stack,Input,useToast} from 'native-base';
import { StyleSheet } from 'react-native'
import globalStyles from '../styles/global';
import { gql, useMutation, useQuery } from '@apollo/client'
import Tarea from '../components/Tarea'


//Vid 382,Crea nuevas tareas
const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput) {
        nuevaTarea(input: $input ) {
            nombre
            id
            proyecto
            estado
        }
    }
`;

//Vid 383, Consulta las tareas del proyecto
const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput) {
        obtenerTareas(input: $input) {
            id
            nombre
            estado
        }
    }
`;

const Proyecto = ({route}) => {

    // Vid 381, Agregamos el hook useToast-- NOTIFICACIONES 
    const toast = useToast();  

     //Vid 383, obtiene el iD del proyecto
    const { id } = route.params;

    // STATE DEL COMPONENTE
    const [ nombre, guardarNombre] = useState('');
    const [ mensaje, guardarMensaje] = useState(null);


    // Vid 383, apollo obtener tareas
    const { data, loading, error } = useQuery(OBTENER_TAREAS, { 
        variables: {
            input: {
                proyecto: id
            }
        }
    });

    //Vid 383,
   // console.log(data);

    //Vid 382,Apollo crear tareas
    //const [ nuevaTarea ] = useMutation(NUEVA_TAREA)

    //Vid 390
    const [ nuevaTarea ] = useMutation(NUEVA_TAREA, { 
        update(cache, { data: { nuevaTarea }}) {
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS, 
                variables: {
                    input: {
                        proyecto: id
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas,nuevaTarea  ]
                }
            })
        }
    });

    //Vid 381, Validar y crear tareas
    const handleSubmit = async () => {
        if(nombre === '') {
            mostrarAlerta('El Nombre de la tarea es obligatorio');
            return;
        }

        // Vid 382,almacenarlo en la base de datos

        try {
            const { data } = await nuevaTarea({
                variables: {
                    input: {
                        nombre, 
                        proyecto:  id
                    }
                }
            });
            console.log(data);
            guardarNombre('');
            mostrarAlerta('Tarea creada Correctamente');

            setTimeout(() => {
                guardarMensaje(null);
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    // muestra un mensaje toast
    const mostrarAlerta = (mensaje) => {
        toast.show({
            description: mensaje,
            duration: 5000,
        });
    };

    //Vid 383, Si apollo esta consultando
    if(loading) return <Text>Cargando...</Text>


    return (

        <Box style={ [ globalStyles.contenedor,  { backgroundColor: '#A3F14A' }]}>
           <Box style={{ marginHorizontal: '2.5%', marginTop: 20}}>
                <FormControl >
                    <Stack space={5}>
                        <Stack  inlineLabel last style={globalStyles.input}>
                            <FormControl.Label>Nombre Tarea </FormControl.Label>
                            <Input 
                                variant="underlined" p={2} 
                                placeholder="Nombre Tarea" 
                                //Vid 381
                                value={nombre}
                                onChangeText={ texto => guardarNombre(texto) }
                                
                            />
                        </Stack>

                        
                    </Stack>

                    <Button
                    style={globalStyles.boton}
                    square
                    block
                    onPress={() => handleSubmit() }
                >
                    <Text>Crear Tarea </Text>
                </Button>  
                </FormControl>

                <Heading style={globalStyles.subtitulo}>Tareas: {route.params.nombre} </Heading>

                <Box>
                     <VStack style={styles.contenido}>
                        {data.obtenerTareas.map(tarea => (
                            <Tarea
                                key = {tarea.id}
                                tarea={tarea}
                                //Vid 389
                                proyectoId={id}
                            />
                        ))}
                    </VStack>
                </Box>                                 
            </Box>
        </Box>
  );
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    }
})

export default Proyecto;


