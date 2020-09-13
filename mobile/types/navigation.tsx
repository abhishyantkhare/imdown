import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';

type AppNavigationProp<K extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  K>;

type AppRouteProp<K extends keyof RootStackParamList> = RouteProp<RootStackParamList, K>;

type AppNavRouteProp<K extends keyof RootStackParamList> = {
  navigation: AppNavigationProp<K>;
  route: AppRouteProp<K>;
};

export default AppNavRouteProp;
