import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.tsx';
import HeaderDate from '../headerDate.js';
import QuestionEditor from '../questionEditor/questionEditor.js';
import {QuestionButtonEdit} from '../questionButton'
import {
  createStackNavigator
} from '@react-navigation/stack';
import { DragSortableView } from 'react-native-drag-sort'
import { color } from 'react-native-reanimated';

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
const childrenWidth = width -20
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

    setArrayNotes(DataManager.getNotes());
    forceUpdate();
  }
  
  const forceUpdate = React.useReducer(() => ({}))[1]

  const updateAnswer = () => {
    forceUpdate();
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Question Editor 2", {questionID:questionId});
  }

  // New function to handle adding a question
  const handleAddQuestion = () => {
    navigation.navigate("Question Editor", { startType: SharedConstants.questionTypes.QUESTION_TYPE_YES_NO });
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
  const [arrayNotes, setArrayNotes] = React.useState([]);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

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
      
      {/* New Add Question Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
        <Text style={styles.addButtonText}>+ Add Question</Text>
        </TouchableOpacity>
      <View style={styles.questionsContainer}>
      <Text style={styles.headerQuestions}>YOUR QUESTIONS</Text>
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
                    }}
                    onClickItem={(data,item,index)=>{

                    }}
                    renderItem={(item,index)=>{
                        return renderItem(item,index)
                    }}
          />
          </View>
        <View style={{ height: 15 }} />
        <View style={styles.questionsContainer}>
        <Text style={styles.headerQuestions}>NOTES</Text>
        <DragSortableView
              dataSource={arrayNotes}
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
              }}
              onClickItem={(data,item,index)=>{

              }}
              renderItem={(item,index)=>{
                  return renderItem(item,index)
              }}
          />

          <View style={{ height: 15 }} />
          </View>
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

  // New styles for the Add Question button
  addButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
    borderBottomWidth: 1,
  },
  addButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },

  headerQuestions: {
    marginTop: 10,
    fontSize: 15,
    color:"black",
    textAlign:'center'
  },

  questionsContainer: {
    backgroundColor: "#fff",
    margin: 0,
    borderWidth: 1,
    borderRadius:10,
    borderColor:"#ddd"
  }
});

export default EditQuestionsScreen;