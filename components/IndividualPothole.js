import React from 'react';
import { StyleSheet, Dimensions, Image, View, Alert } from 'react-native';
import { MapView } from 'expo';
const { Marker } = MapView;
import { connect } from 'react-redux';
import {
  getSinglePotholeServer,
  upvotePotholeInDB,
} from '../store/potholes';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Button,
} from 'native-base';

const ScreenHeight = Dimensions.get('window').height;

class IndividualPothole extends React.Component {
  constructor() {
    super();
    this.state = {
      upvotes: 0,
      disableUpvote: false
    };
  }

  async componentDidMount() {
    await this.props.getSinglePothole(this._getId());

    // // //set # of upvoters on state

    this.setState({
      upvotes: this.props.singlePothole.upvoters.length,
      disableUpvote: !!(this.props.upvoters.filter(upvoter => upvoter.id === this.props.userId).length)
    });
  }

  _getId = () => {
    let id = 1;
    if(this.props.navigation.state.params) {
      id = this.props.navigation.state.params.id;
    }
    return id;
  }

  _handleUpvote = async () => {
    this.setState({disableUpvote: true})
    console.log('userId', this.props.userId, 'singlePothole', this.props.singlePothole.id)
    await this.props.upvotePothole(
      this.props.singlePothole.id,
      this.props.userId
    );
    Alert.alert('Thanks for upvoting!')
    //reset state after upvoting
    this.setState({
      upvotes: this.props.upvoters.length,
    });
  };

  _handleCancel = () => {
    console.log('this.props.navigation', this.props.navigation)
    this.props.navigation.goBack(null)
  };

  static navigationOptions = { title: 'SinglePothole' };

  render() {
    const pothole = this.props.singlePothole;

    if (!pothole) return <View />;

    let region = {
      latitude: Number(pothole.latitude),
      longitude: Number(pothole.longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    return (
      <Container>
        {!this.props.navigation.state.params.myPotholes ? (
          <Header>
            <Button
              style={styles.button}
              small
              success
              onPress={this._handleUpvote}
              disabled={this.state.disableUpvote}
            >
              <Text>Upvote</Text>
            </Button>
            <Button
              style={styles.button}
              small
              danger
              onPress={this._handleCancel}
            >
              <Text>Cancel</Text>
            </Button>
          </Header>
        ) : (
          <Header />
        )}
        <Content>
          <MapView
            style={styles.backgroundMap}
            region={region}
            provider={MapView.PROVIDER_GOOGLE}
          >
            <Marker
              key={pothole.id}
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="dummymarker"
              description="dummymarker"
              image="https://s3.us-east-2.amazonaws.com/soundandcolor/button+(2).png"
            />
          </MapView>
        </Content>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>ID: {pothole.id}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Upvotes: {this.state.upvotes}</Text>
              </Body>
            </CardItem>
            {!!pothole.imageUrl && (
              <CardItem>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: pothole.imageUrl }}
                />
              </CardItem>
            )}
            <CardItem>
              <Body>
                <Text>STATUS: {pothole.status}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>ADDRESS: {pothole.streetAddress}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>ZIP: {pothole.zip}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>DESCRIPTION HERE</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>SERVICE #: {pothole.serviceNumber}</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundMap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: ScreenHeight * 0.5,
  },
  text: {
    backgroundColor: '#fff',
    height: 20,
    width: 170,
    top: 200,
    left: 80,
  },
  button: {
    padding: 5,
    justifyContent: 'space-between',
  },
});

const mapState = state => {
  return {
    singlePothole: state.singlePothole.pothole,
    userId: state.user.id,
    upvoters: state.singlePothole.upvoters,
  };
};

const mapDispatch = dispatch => {
  return {
    getSinglePothole: id => dispatch(getSinglePotholeServer(id)),
    upvotePothole: (potholeId, userId) =>
      dispatch(upvotePotholeInDB(potholeId, userId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(IndividualPothole);
