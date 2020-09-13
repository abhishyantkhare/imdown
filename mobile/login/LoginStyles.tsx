import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  titleDescriptionContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: '10%',
  },
  imdownTitle: {
    color: '#fff',
    fontFamily: 'SourceSansPro_700Bold',
    fontSize: 70,
    marginBottom: 30,
  },
  imdownDescription: {
    color: '#fff',
    fontFamily: 'SourceSansPro_700Bold',
    fontSize: 24,
  },
  googleSignInButton: {
    width: 192,
    height: 48,
    marginTop: 100,
  },
});

export default LoginStyles;
