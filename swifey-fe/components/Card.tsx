import {Text, ImageBackground, View, StyleSheet} from 'react-native';

const Card = (props: {user: any}) => {
  const {name, graduatedFrom, currentlyWorking, role, dateOfBirth, gender} = props.user;

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/736x/aa/ea/02/aaea02ca5c48d09ac86a591a21c18460.jpg',
        }}
        style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>Graduated From: {graduatedFrom}</Text>
          <Text style={styles.info}>Currently Working: {currentlyWorking}</Text>
          <Text style={styles.info}>Role: {role}</Text>
          <Text style={styles.info}>Date of Birth: {new Date(dateOfBirth).toLocaleDateString()}</Text>
          <Text style={styles.info}>Gender: {gender}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#fefefe',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',

    justifyContent: 'flex-end',
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
});

export default Card;