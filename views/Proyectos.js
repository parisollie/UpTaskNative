import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Button, Text, Heading, VStack, HStack, Divider, Spinner, Alert } from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
 
//Vid 377
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;
 
const Proyectos = () => {
   //Vid 375
  const navigation = useNavigation();
  //Vid 377,Apollo
  const { data, loading, error } = useQuery(OBTENER_PROYECTOS);
 
  if (loading) {
    return (
      <Box style={globalStyles.contenedor}>
        <Spinner color="blue" />
        <Text>Cargando proyectos...</Text>
      </Box>
    );
  }
 
  if (error) {
    return (
      <Box style={globalStyles.contenedor}>
        <Alert status="error">
          <Text>Error al cargar los proyectos</Text>
        </Alert>
      </Box>
    );
  }
 
  return (
    <Box style={[globalStyles.contenedor, { backgroundColor: '#A3F14A' }]}>
        <Button
            style={[globalStyles.boton, { marginTop: 30 }]}
            square
            block
            //Vid 375
            onPress={() => navigation.navigate("NuevoProyecto")}
        >
            <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text>
        </Button>
 
        <Heading style={globalStyles.subtitulo}>Selecciona un Proyecto</Heading>
 
        <Box>
          <VStack style={styles.contenido} space={3} divider={<Divider />} w="90%">
            {data.obtenerProyectos.map((proyecto) => (
              <HStack>
                  <Text
                      key={proyecto.id}
                      onPress={() => navigation.navigate("Proyecto",proyecto)}      
                >{proyecto.nombre}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
    </Box>
  );
};
 
const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#FFF',
    marginHorizontal: '2.5%',
  },
});
 
export default Proyectos;

