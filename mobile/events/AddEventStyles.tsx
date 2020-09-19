import { StyleSheet } from 'react-native';

const AddEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  childContainer: {
    marginTop: '10%',
    marginHorizontal: '10%',
  },
  imageUploadBox: {
    width: '100%',
    height: 75,
    borderColor: '#84D3FF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    justifyContent: 'center',
  },
  uploadLabelRow: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '5%',
    alignItems: 'center',
  },
  saveButton: {
    marginVertical: '5%',
    width: 130,
    height: 50,
    marginLeft: '50%',
    borderRadius: 5,
  },
});

export default AddEventStyles;
