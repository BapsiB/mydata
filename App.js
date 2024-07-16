import React from 'react';

import Backup from './js/backup.js';
import Account from './js/account';
import QuestionEditor from './js/questionEditor/questionEditor.js';
import AnswerScreen from './js/answerScreen';
import DataVisualisationSingleQuestion from './js/dataVizzScreen/dataVisualisationSingleQuestion';
import TimelineView from './js/timeline/timelineView'
import Intro from './js/Intro.js'
import DebugScreen from './js/debugScreen'
import QuestionsListView from './js/questionsListView.js'
import CalendarComponent from './js/timeline/CalendarComponent'

import Utils from './js/utils.js'
import DataManager from './js/dataManager'
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './js/Utils/NavigationService';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Animated, View, HStack, Divider } from 'react-native';
import sharedConstants from './js/sharedConstants.js';
import EditQuestionsScreen from './js/questionsScreens/editQuestionsScreen.js';
import SettingsScreen from './js/settingsScreen.jsx';
import DataAnalyticScreen from './js/dataVizzScreen/dataAnalyticScreen.js';

const JournalStack = createNativeStackNavigator();
const ManageStack = createNativeStackNavigator();
const AnalyseStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function JournalStackScreen() {
  return (
    <JournalStack.Navigator initialRouteName="Home">
      <JournalStack.Screen
          name="Home"
          component={MainView}
          options={{ headerShown:false }}
      />
      <JournalStack.Screen name="Timeline" component={TimelineView} options={{ headerShown: false }} />
      {/* <JournalStack.Screen name="Calendar" component={CalendarComponent} options={{ headerShown: false }} /> */}
      <JournalStack.Screen name="Question Editor" component={QuestionEditor} options={{ headerShown:false }}/>
      <JournalStack.Screen name="Answer Screen" component={AnswerScreen} options={{ headerShown:false, unmountOnBlur: true}}/>
      {getStackNavigator()}
    </JournalStack.Navigator>
  )
}

function ManageStackScreen() {
    return (
    <ManageStack.Navigator initialRouteName="Questions List Editor">
      <ManageStack.Screen name="Question Editor" component={QuestionEditor} options={{ headerShown:false }}/>
      <ManageStack.Screen name="Questions List Editor" component={EditQuestionsScreen} options={{ headerShown:false }}/>

    </ManageStack.Navigator>
  )
}

function SettingsStackScreen() {
    return (
      <SettingsStack.Navigator initialRouteName="Settings">
        <SettingsStack.Screen name="Account" component={Account} options={{ headerShown:true }}/>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown:true }}/>
      <SettingsStack.Screen name="Restore" component={Backup.restoreView} options={{ headerShown:true }}/>
      <SettingsStack.Screen name="Backup" component={Backup.backupView} options={{ headerShown:true }}/>
      <SettingsStack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
    </SettingsStack.Navigator>
  )
}


function AnalyseStackScreen() {
    return (
      <AnalyseStack.Navigator initialRouteName="Data Viz Screen">
        <AnalyseStack.Screen name="Data Viz Screen" component={DataAnalyticScreen} options={{ headerShown:false }}/>
     </AnalyseStack.Navigator>
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

  const colourFocused = "#ccc";

  return (
    <View style={{height:"100%", width:"100%"}}>
    {!questionLoaded && <Image style={{resizeMode: 'cover', width:"100%", height:"100%"}} source={require("./resources/splash.jpg")}></Image>}
    {questionLoaded &&
    <NavigationContainer ref={navigationRef}>
          <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Journal">
            <Tab.Screen
              name="Journal"
              component={JournalStackScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image

                    source={focused ? require('./resources/notesbuttonFocused.png') : require('./resources/notesbutton.png')}
                    style={{ width: size * 1.3, height: size * 1.3, elevation:focused ? 1 : 0, tintColor: focused ? colourFocused : "#9aa"}}
                  />
                ),
                tabBarLabel: () => null,
              }}
            />
            <Tab.Screen
              name="Analyse"
              component={AnalyseStackScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={focused ? require('./resources/analyticsFocused.png') : require('./resources/analytics.png')}
                    style={{ width: size * 1.3, height: size * 1.3, elevation:focused ? 1 : 0, tintColor: focused ? colourFocused : "#9aa"}}
                  />
                ),
                tabBarLabel: () => null,
              }}

            />
            <Tab.Screen name="Manage" component={ManageStackScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={focused ? require('./resources/editQuestionsFocused.png') : require('./resources/editQuestions.png')}
                    style={{ width: size * 1.3, height: size * 1.3, elevation:focused ? 1 : 0, tintColor:focused ? colourFocused : "#9aa"}}
                  />
                 ),
                 tabBarLabel: () => null,
              }} />
            <Tab.Screen name="SettingsTab" component={SettingsStackScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={focused ? require('./resources/settingsFocused.png') : require('./resources/settings.png')}
                    style={{ width: size * 1.3, height: size * 1.3, elevation:focused ? 1 : 0, tintColor:focused ? colourFocused : "#9aa"}}
                  />
                 ),
                 tabBarLabel: () => null,
              }}/>


        </Tab.Navigator>
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
  const listItemsforth = listQuestions.map((d) => <JournalStack.Screen name={d.id + "vizz"} component={DataVisualisationSingleQuestion} options={{headerShown:false}} key={d.id} initialParams={{ questionId: d.id }} />);
  // basically because i didn't find a better way, we put twice the screens with different animation.
  return listItemsforth;
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
  return (
    <QuestionsListView navigation={navigation} />
  )
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
    width:"100%",
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