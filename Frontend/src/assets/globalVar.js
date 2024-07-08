import {Platform} from 'react-native';

export const address = Platform.OS === 'android' ? "10.0.2.2" : "localhost";