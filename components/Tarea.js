import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Text,VStack,HStack,Divider} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de importar el ícono correcto
import { gql, useMutation } from '@apollo/client';

//Vid 387
const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean ) {
        actualizarTarea(id: $id, input: $input, estado: $estado) {
            nombre
            id
            proyecto
            estado
        }
    }
`;
//Vid 388
const ELIMINAR_TAREA = gql`
    mutation  eliminarTarea($id: ID!) {
        eliminarTarea(id: $id)
    }
`

//Vid 389, Consulta las tareas del proyecto
const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput) {
        obtenerTareas(input: $input) {
            id
            nombre
            estado
        }
    }
`;

const Tarea = ({tarea, proyectoId }) => {

       //Vid 387, Apollo
       const [ actualizarTarea ] = useMutation(ACTUALIZAR_TAREA);
       const [ eliminarTarea ] = useMutation(ELIMINAR_TAREA, {
        //Vid 389
           update(cache) {
               const { obtenerTareas } = cache.readQuery({
                   query: OBTENER_TAREAS,
                   variables: {
                       input: {
                           proyecto: proyectoId
                       }
                   }
               });
   
               //Vid 389
               cache.writeQuery({
                   query: OBTENER_TAREAS,
                   variables: {
                       input: {
                           proyecto: proyectoId
                       }
                   }, 
                   data: {
                       obtenerTareas: obtenerTareas.filter( tareaActual => tareaActual.id !== tarea.id )
                   }
               })
           }
       });
   
   
       // Cambia el estado de una tarea a completo o incompleto
       const cambiarEstado = async () => {
   
           //Vid 387 ,obtener el ID de la tarea
           const { id} = tarea
           //console.log(!tarea.estado);
   
           try {
               const { data } = await actualizarTarea({
                   variables : {
                       id, 
                       input: {
                           nombre: tarea.nombre
                       },
                       estado: !tarea.estado
                   }
               });
               //console.log(data);
           } catch (error) {
               console.log(error);
           }
       }
   
       //Vid 388, Dialogo para eliminar o no una tarea
        const mostrarEliminar = () => {
           Alert.alert('Eliminar Tarea', '¿Deseas eliminar esta tarea?', [
               {
                   text: 'Cancelar', 
                   style: 'cancel'
               }, 
               {
                   text: 'Confirmar',
                   onPress: () => eliminarTareaDB()
               }
           ])
       }
   
       //Vid 388, Eliminar tarea de la base de datos
   
       const eliminarTareaDB = async () => {
           const { id } = tarea;
   
           try {
               const { data } = await eliminarTarea({
                   variables: {
                       id
                   }
               });
               //console.log(data);
           } catch (error) {
               console.log(error);
           }
       }

  return (
    <>
        <VStack space={3} divider={<Divider />} w="90%">
            <HStack justifyContent="space-between">
                 <Text
                    onPress={ () => cambiarEstado()  }
                    //Vid 388
                    onLongPress={ () => mostrarEliminar()}
                 >{tarea.nombre}
                </Text>   
                    { tarea.estado ? (
                        <Icon
                            style={[styles.icono, styles.completo]}
                            name="check-circle"
                        />
                   ) : (
                        <Icon
                            style={[styles.icono, styles.incompleto]}
                            name="check-circle"
                        />
                   )}
            </HStack>
        </VStack>
   </>
  );
}

const styles = StyleSheet.create({
    icono: {
        fontSize: 32
    },
    completo: {
        color: 'green'
    },
    incompleto: {
        color: '#E1E1E1'
    }
})

export default Tarea;

