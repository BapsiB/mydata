import React from 'react';

import Backup from './js/backup.js';
import QuestionEditor from './js/questionEditor/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import UpdateManager from './js/updateManager';
import NotificationsManager from './js/notificationsManager';
import DataVisualisationSingleQuestion from './js/dataVizzScreen/dataVisualisationSingleQuestion';
import HeaderDate from './js/headerDate.js';
import NotesScreen from './js/questionsScreens/notesScreen.js'
import TimelineView from './js/timeline/timelineView'
import Intro from './js/Intro.js'
import MeasuresScreen from './js/questionsScreens/measuresScreen.js'
import DebugScreen from './js/debugScreen'
import Utils from './js/utils.js'
import DataManager from './js/dataManager'
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  createStackNavigator
} from '@react-navigation/stack';
import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Animated, View, HStack, Divider } from 'react-native';
import sharedConstants from './js/sharedConstants.js';
import EditQuestionsScreen from './js/questionsScreens/editQuestionsScreen.js';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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

const MyStack = () => {

  const [questionLoaded, setQuestionsLoaded] = React.useState(false);
  const [introFinished, setIntroFinished] = React.useState(false);

  function updateQuestions() {
    setQuestionsLoaded(true);
  }
  
  React.useEffect(() => {
    DataManager.addQuestionsListener("MyStack", updateQuestions);
  }, []);

  return (
    <View style={{height:"100%", width:"100%"}}>
    {!questionLoaded && <Image style={{resizeMode: 'cover', width:"100%", height:"100%"}} source={require("./resources/splash.jpg")}></Image>}
    {questionLoaded &&
    <NavigationContainer>
       <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} initialRouteName="Home" />}
        >
        <Stack.Screen
            name="Home"
            component={MainView}
            options={{ headerShown:true }}
        />
        <Stack.Screen name="Timeline" component={TimelineView} options={{ headerShown:false }}/>
        <Stack.Screen name="Question Editor" component={QuestionEditor} options={{ headerShown:false }}/>
        <Stack.Screen name="Questions List Editor" component={EditQuestionsScreen} options={{ headerShown:false }}/>
        <Stack.Screen name="Answer Screen" component={AnswerScreen} options={{ headerShown:false, unmountOnBlur: true}}/>
        <Stack.Screen name="Restore" component={Backup.restoreView} options={{ headerShown:true }}/>
        <Stack.Screen name="Backup" component={Backup.backupView} options={{ headerShown:true }}/>
        <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown:true }}/>
        {getStackNavigator()}
      </Drawer.Navigator>
    </NavigationContainer>
    }
    {!introFinished && <Intro style={{position:"absolute", width:"100%", height:"100%", zIndex: 10, elevation:3 }} callback={() => {setIntroFinished(true)}}/>}
    </View>
  );
};

function getStackNavigator() {
  listQuestions = DataManager.getQuestions();
  let optionsForth = Utils.horizontalScreenAnimation;
  optionsForth.headerShown = false;
  // let optionsBack = Utils.horizontalScreenAnimationRightToLeft;
  // optionsBack.headerShown = false;
  const listItemsforth = listQuestions.map((d) => <Stack.Screen name={d.id + "vizz"} component={DataVisualisationSingleQuestion} options={{headerShown:false}} key={d.id} initialParams={{ questionId: d.id }} />);
  // basically because i didn't find a better way, we put twice the screens with different animation.
  return listItemsforth;//.concat(listItemsback);
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem 
        icon={({ focused, color, size }) => <Icon color={"#555"} size={20} name={focused ? 'pluscircleo' : 'plus'} />}
        label="Add New Question"
        onPress={() => props.navigation.navigate("Question Editor", {startType: sharedConstants.questionTypes.QUESTION_TYPE_YES_NO})}
      />
      <DrawerItem
        style={{}}
        icon={({ focused, color, size }) => <Icon color={"#555"} size={20} name={'edit'} />}
        label="Edit Questions"
        onPress={() => props.navigation.navigate("Questions List Editor")}
      />
      <View
        style= {{
            borderBottomWidth: 1,
            borderColor: '#E2E4E8',
        }}
      />
      <DrawerItem
        style={{opacity:0.5}}
        icon={() => <Fontisto color={"#555"} size={20} name={'laboratory'} />}
        label="Laboratory (coming up)"
        onPress={()=>{}}
      />
      <DrawerItem
        style={{opacity:0.5}}
        icon={() => <Icon color={"#555"} size={20} name={'robot'} />}
        label="AI (coming up)"
        onPress={()=>{}}
      />
      <View
        style= {{
            borderBottomWidth: 1,
            borderColor: '#E2E4E8',
        }}
      />
      <DrawerItem
        icon={({ focused, color, size }) => <MaterialIcons color={"#555"} size={20} name={'backup'} />}
        label="Backup/Export"
        onPress={()=>{props.navigation.navigate("Backup")}}
      />
      <DrawerItem
        icon={({ focused, color, size }) => <MaterialIcons color={"#555"} size={20} name={'settings-backup-restore'} />}
        label="Restore"
        onPress={() => props.navigation.navigate("Restore")}
      />
      <View
        style= {{
            borderBottomWidth: 1,
            borderColor: '#E2E4E8',
        }}
      />
      <DrawerItem
        icon={({ focused, color, size }) => <MaterialIcons color={"#555"} size={20} name={'bug-report'} />}
        label="Debug"
        onPress={() => props.navigation.navigate("Debug")}
      />
    </DrawerContentScrollView>
  );
}


const MainView = ({ navigation }) => {

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

    const forceUpdate = React.useReducer(() => ({}))[1]

    const lSizeFooter = 65;
    const StackIn = createStackNavigator();

    return (
        <View style={{ flex: 1, backgroundColor:"white"}}>
            {HeaderDate.getHeader()}
            <UpdateManager/>
            {/* <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop:20}}>
              <View style={[styles.buttonsTypeQuestions, getTopButtonStyle(0)]}>
              <TouchableOpacity style={{}} onPress={()=>{goToScreen(0)}}>
                <Image style={{ width:32, height:32,  resizeMode: 'stretch' }} source={require("./resources/measuresButton.png")}/>
              </TouchableOpacity>
              </View>
              <View style={[styles.buttonsTypeQuestions, getTopButtonStyle(1)]}>
              <TouchableOpacity style={{}} onPress={()=>{goToScreen(1)}}>
                <Image style={{ width:32, height:32,  resizeMode: 'stretch' }} source={require("./resources/notesbutton.png")}/>
              </TouchableOpacity>
              </View>
          </View> */}
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
                      source0={require("./resources/measuresButton.png")} 
                      source1={require("./resources/notesbutton.png")} 
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
        </View>
    );
}

const styles = StyleSheet.create({
  button_footer: {
    backgroundColor: "transparent",
//      bottom: 0 ,
    flex: 1,
  },

buttonsTypeQuestions: {
  margin:30,
  borderWidth: 1,
  borderColor: "#999",
  borderRadius: 50,
  padding:10,
},

  button_footer2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "transparent",
    width:"40%",
    borderRadius:60
  },

  shadowFrame:
  {
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.65,
    shadowRadius: 13.84,
    elevation: 6,
  }
});

export default MyStack;