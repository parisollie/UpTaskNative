import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';  // Cambia aquí también
import AsyncStorage from '@react-native-async-storage/async-storage';
//Vid 365
const httpLink = createHttpLink({
    uri: Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://192.168.0.11:4000/',
});
 
const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            //TVid 373 ,tomamos una copia de los headers ,porque no sabemos que informacion venga.
            ...headers,
            //Vid 373
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});
 
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});
 
export default client;