import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionEditor from '../questionEditor/questionEditor.js';
import {QuestionButtonEdit} from '../questionButton'
import {
  createStackNavigator
} from '@react-navigation/stack';
import { DragSortableView } from 'react-native-drag-sort'

const EditQuestionsScreen = ({navigation}) => {
  const StackIn = createStackNavigator();

  return (
    <View style={{ flex: 1}}>
      <StackIn.Navigator initialRouteName={"Questions List Editor"}>
        <StackIn.Screen name="Question Editor 2" component={QuestionEditor} options={{ headerShown:false }}/>
        <StackIn.Screen name="Questions List Editor" component={EditQuestionsList} options={{ headerShown:false }}/>
      </StackIn.Navigator>
    </View>
  )
}

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width
const childrenHeight = 70

const EditQuestionsList = ({navigation}) => {
  
  useEffect(() => {
    DataManager.addQuestionsListener("MeasuresScreen", updateQuestions);
  }, []);

  const updateQuestions = () => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    // we remove the questions that are the notes (they will be displayed in another screen)
    const filtered = arrayQuestionsOrigin.filter((question) => {return question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE});
    setArrayQuestions(filtered);
    forceUpdate();
  }
  
  const forceUpdate = React.useReducer(() => ({}))[1]

  const updateAnswer = () => {
    forceUpdate();
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Question Editor 2", {questionID:questionId});
  }

  function getTextEmptyQuestion() {
    if(!arrayQuestions.length) {
      return (      
      <View>
        <Text style={[styles.textEmpty, {fontSize:20, marginTop:"45%", fontWeight: 'bold'}]}>your list of questions is empty.</Text>
        <Text style={styles.textEmpty}>Press <Text style={{color: 'black', fontWeight: 'bold', fontSize:18}}>+</Text> to add your first question.</Text>
      </View>);
    }
    else return null;
  }

  HeaderDate.addChangeCallback("MeasureScreen", updateAnswer);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  // const listItems = arrayQuestions.map((d) => <QuestionButtonEdit title={d.text} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButtonEdit>);



  const renderItem = (item,index) => {
    return (
      <View key={item.id} style={styles.item}>
        <QuestionButtonEdit title={item.text} questionId={item.id} key={item.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButtonEdit>
      </View>
    )
  }

  return (
  <View style={{ flex: 1, backgroundColor: "white" }}>
    <View>
        
    </View>
      {getTextEmptyQuestion()}
    <ScrollView style={{marginBottom:0}} scrollEnabled={scrollEnabled}>
      
      <View style={{height:15, width:parentWidth}}/>
      <DragSortableView
                    dataSource={arrayQuestions}

                    parentWidth={parentWidth}

                    childrenWidth= {childrenWidth}
                    childrenHeight={childrenHeight}

                    scaleStatus={'scaleY'}

                    onClickItem={() => {
                      console.log("click item");
                    }}

                    onDragStart={(startIndex,endIndex)=>{
                      console.log("start");
                      setScrollEnabled(false);
                    }}
                    onDragEnd={(startIndex)=>{
                      setScrollEnabled(true);
                    }}
                    delayLongPress={0}
                    onDataChange = {(data)=>{
                      for(let i = 0; i < data.length; i++) {
                        data[i].setDisplayOrder(i);
                      }
                      DataManager.updateQuestionsOrder();
                      DataManager.saveListQuestions();
                    }}
                    keyExtractor={(item, index) => {
                      return item.id
                    }
                      
                    }
                    onClickItem={(data,item,index)=>{

                    }}
                    renderItem={(item,index)=>{
                        return renderItem(item,index)
                    }}
                />

      <View style={{height:15}}/>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  textEmpty:{
    color:'#333',
    textAlign:'center',
    marginHorizontal:3,
    fontSize:16,
  },
 
  item: {
    width: childrenWidth,
    height: childrenHeight,
  },

  item_children: {
    width: childrenWidth,
    height: childrenHeight-4,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
},
});

export default EditQuestionsScreen;