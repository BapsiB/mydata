import React from 'react';
import UpdateManager from './updateManager';
import HeaderDate from './headerDate.js';
import Utils from './utils.js'
import MeasuresScreen from './questionsScreens/measuresScreen.js'
import NotesScreen from './questionsScreens/notesScreen.js'
import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Animated, View, HStack, Divider } from 'react-native';
import {
  createStackNavigator
} from '@react-navigation/stack';

const BottomButton = (props) => {

  const anim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  function getStyle() {

      return {
        backgroundColor:"white",
        
        borderRadius:25,
        height:50,
        width:50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
      }
  }

  function onClick() {
    props.onClick();
    
    Animated.timing(anim, {
      toValue: props.isSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

return (
  <TouchableOpacity style={[styles.button_footer2]} onPress={()=>{onClick(); }}>
    <View style={[getStyle()] }>
    <Animated.View style={ {transform: [{rotateY: spin}]}}>
    <Image style={[{ width:40, height:40, resizeMode: 'stretch'}]} source={props.isSelected ? props.source1 : props.source0}/>
    </Animated.View>
    </View>
  </TouchableOpacity>
)
}



/*
* old main screen, showing the questions as a list.
*/
const QuestionsListView = ({ navigation }) => {

    const [screenId, setScreenId] = React.useState(0);
    const unsubscribe = navigation.addListener('state', (e) => {
      // You can get the raw navigation state (partial state object of the root navigator)
      if(e.data.state.routeNames[e.data.state.index] == "Home") {
        forceUpdate();
      }
    });

    function switchScreen() {
      let lScreenId = (screenId + 1) % 2;
      switch(lScreenId) {
        case 0:
          navigation.navigate("Measures");
          break;
        case 1:
          navigation.navigate("Notes");
          break;
      }
      setScreenId(lScreenId);
    }

    function goToTimeView() {
      navigation.navigate("Timeline");
    }

    const forceUpdate = React.useReducer(() => ({}))[1]

    const lSizeFooter = 65;
    const StackIn = createStackNavigator();

    return (
        <View style={{ flex: 1}}>
            {HeaderDate.getHeader()}
            <UpdateManager/>
            <View style={{height:0}}></View>
            {/* <View style={[{marginLeft:"5%", width:"90%", height:"85%", marginTop:"5%", borderRadius:0}, styles.shadowFrame]}> */}
              <StackIn.Navigator screenOptions={Utils.horizontalScreenAnimation} >
                <StackIn.Screen
                  name="Measures"
                  component={MeasuresScreen}
                  options={{ headerShown:false }}
                />
                <StackIn.Screen name="Notes" 
                  component={NotesScreen} 
                  options={{headerShown:false}}
                />
              </StackIn.Navigator>
            {/* </View> */}

        </View>
    );
}

export default QuestionsListView;

const styles = StyleSheet.create({

  button_footer2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "transparent",
    width:"100%",
    borderRadius:60
  }
});