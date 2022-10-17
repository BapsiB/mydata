import React from 'react';
import DataManager from './js/dataManager.js';
import { Image, TouchableOpacity, AsyncStorage, StyleSheet, Text, Button, View } from 'react-native';


//
let lDataManager = new DataManager("horse");
console.log(lDataManager.describeAnimalType());

const Question = (props) => {
  return (
    <Button
    key={props.key_app}
    title={props.title}
    color="#841584"
    accessibilityLabel="Learn more about this purple button"
    />
  );
}

const BottomButton = (props) => {
return (
        <TouchableOpacity style={styles.button_footer2} onPress={()=>{alert("you clicked me")}}>
          <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={props.source}/>
        </TouchableOpacity>
)
}

const MainView = () => {
    const arrayNames = [
      {name: 'How many times did you sleep today?', key:"1"},
      {name: 'Abb', key:"2"},
      {name: 'heyo', key:"3"},
      {name: 'heo', key:"4"}
    ];

    const listItems = arrayNames.map((d) => <Question title={d.name} key_app={d.key}></Question>);
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]

//message;
//let test = new dataManagerIDK.default();
//let lDataManager = new test();
//  let lDataManager = new dataManagerClass();// = new dataManager();


  return (
    <View style={{ flex: 1 }}>
        {listItems}
        <View style={{ position:'absolute', bottom:0, height:"10%", width:"100%"}}>
            <View style={{   flex: 1, flexDirection: "row"}}>
                <BottomButton source={require("./resources/curvesButton.png")}/>
                <BottomButton source={require("./resources/plusButton.png")}/>
                <BottomButton source={require("./resources/shareButton.png")}/>
            </View>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button_footer: {
//      padding: 10,
        backgroundColor: "powderblue",
//      bottom: 0 ,
      flex: 1,
//      width:50,
//      height: "10%"
  },

    button_footer2: {
      justifyContent: 'center',
      alignItems: 'center',
          backgroundColor: "aliceblue",
//        bottom: 0 ,
        flex: 1,
//        width:150
//        height: "30%"
    }
});


export default MainView;