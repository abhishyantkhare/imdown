import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';

export type AppNavigationProp<K extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  K>;

export type AppRouteProp<K extends keyof RootStackParamList> = RouteProp<RootStackParamList, K>;

type AppNavRouteProp<K extends keyof RootStackParamList> = {
  navigation: AppNavigationProp<K>;
  route: AppRouteProp<K>;
};

export default AppNavRouteProp;
