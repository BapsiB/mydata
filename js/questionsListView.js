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
            <View style={[{ position:'absolute', right:-lSizeFooter * 0.3, bottom:"50%", width:lSizeFooter, height:lSizeFooter, backgroundColor:"#fff3f3", borderRadius:lSizeFooter * 0.5}, Utils.getShadowStyle(4)]}>
              <View style={{ position:'absolute', width:lSizeFooter * 0.9, height:lSizeFooter * 0.9}}>
                  <View style={{   width:lSizeFooter, height:lSizeFooter * 1, flexDirection: "row", justifyContent: 'center',}}>
                      <BottomButton 
                      source0={require("../resources/measuresButton.png")} 
                      source1={require("../resources/notesbutton.png")} 
                      onClick={()=>{switchScreen()}}
                      isSelected = {screenId == 0}
                      />
                      {/* <BottomButton
                      isSelected = {screenId == 1}
                      source={require("./resources/notesbutton.png")}
                      onClick={function() {navigation.navigate("Data Visualisation Screen");}} onClick={()=>{goToScreen(1)}}/> */}
                  </View>
            </View>
           </View>
          <View style={[{ position:'absolute', width:"100%", bottom:0, height:lSizeFooter, justifyContent: 'center', alignItems: 'center', backgroundColor:"transparent"}]}>
            <View style={{position:"absolute", elevation:-1, zIndex:-1, width:"100%", height:"100%"}}>
            <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <Path fill="#fff3f3" d="M51.7,-53.3C58.9,-44.6,50.8,-22.3,50.7,-0.1C50.6,22.1,58.4,44.2,51.3,53.1C44.2,62,22.1,57.7,4.9,52.8C-12.4,48,-24.8,42.6,-40.1,33.7C-55.4,24.8,-73.6,12.4,-79,-5.4C-84.4,-23.1,-76.9,-46.3,-61.6,-54.9C-46.3,-63.6,-23.1,-57.8,-0.4,-57.4C22.3,-56.9,44.6,-61.9,51.7,-53.3Z" transform="translate(100 230), scale(9, 3), rotate(20)" />
            </Svg>
            </View>
              <View style={{   width:lSizeFooter, height:lSizeFooter * 1, flexDirection: "row", borderRadius:lSizeFooter * 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor:"#fff3f3"}}>
                  <BottomButton 
                  source0={require("../resources/pathIcon.png")} 
                  source1={require("../resources/pathIcon.png")} 
                  onClick={()=>{goToTimeView()}}
                  isSelected = {true}
                  />
              </View>
           </View>
        </View>
    );
}

export default QuestionsListView;