import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager';
import HeaderDate from '../headerDate.js';
import QuestionButton from '../questionButton';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DraggableFlatList from 'react-native-draggable-flatlist';

const MeasuresScreen = ({ navigation, date }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [arrayQuestions, setArrayQuestions] = useState([]);
  const [arrayNotes, setArrayNotes] = useState([]);

  useEffect(() => {
    DataManager.addQuestionsListener("MeasuresScreen", updateQuestions);
    return () => {
      DataManager.removeQuestionsListener("MeasuresScreen");
    };
  }, []);

  const allQuestionsAnswered = DataManager.getNextQuestionUnrespondedInArray(0, HeaderDate.getDate()) ? false : true;

  const updateQuestions = useCallback(() => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    const filtered = arrayQuestionsOrigin.filter((question) => question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE);
    const filteredNotes = DataManager.getNotes();
    setArrayNotes(filteredNotes);
    setArrayQuestions(filtered);
  }, []);

  const editQuestion = useCallback((questionId) => {
    navigation.navigate("Question Editor", { questionID: questionId });
  }, [navigation]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prevMode) => !prevMode);
  }, []);

  const reorderQuestions = useCallback((data) => {
    setArrayQuestions(data);
    // Here you would typically update the order in your DataManager
    // DataManager.updateQuestionsOrder(data);
  }, []);

  const replyAllQuestions = useCallback(() => {
    const question = DataManager.getNextQuestionUnrespondedInArray(0, HeaderDate.getDate());
    navigation.navigate("Answer Screen", { id: question.id, onlyTakeUnanswered: true, automaticNextQuestion: true });
  }, [navigation]);

  const addQuestion = useCallback(() => {
    navigation.navigate("Question Editor", { startType: SharedConstants.questionTypes.QUESTION_TYPE_YES_NO });
  }, [navigation]);


  function getAnswerNote(aNoteId) {
    return DataManager.getAnswerForQuestion(aNoteId, HeaderDate.getDate());
  }

  const renderQuestionButton = useCallback(({ item, drag, isActive }) => (
    <QuestionButton
      title={item.text}
      date={HeaderDate.getDate()}
      questionId={item.id}
      navigation={navigation}
      changeCallback={updateQuestions}
      editCallback={editQuestion}
      isEditMode={isEditMode}
      onDragStart={isEditMode ? drag : null}
      isBeingDragged={isActive}
    />
  ), [isEditMode, navigation, updateQuestions, editQuestion]);

  const ListHeaderComponent = useCallback(() => (
    <>
      <View style={{ height: 65, marginTop: 20 }} />
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
        <TouchableOpacity onPress={replyAllQuestions} style={{ flexDirection: "row", alignItems: 'center', marginRight: 20 }}>
          {!allQuestionsAnswered && <SimpleLineIcons name="loop" size={20} color={"#555"} />}
          <Text style={{ fontSize: 16, color: "#000", marginLeft: 5, fontFamily: 'Montserrat-Regular' }}>
            {!allQuestionsAnswered ? "answer all" : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleEditMode} style={{ flexDirection: "row", alignItems: 'center' }}>
          <SimpleLineIcons name={isEditMode ? "check" : "pencil"} size={20} color={"#555"} />
          <Text style={{ fontSize: 16, color: "#000", marginLeft: 5, fontFamily: 'Montserrat-Regular' }}>
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  ), [allQuestionsAnswered, isEditMode, replyAllQuestions, toggleEditMode]);

  const ListFooterComponent = useCallback(() => (
    <>
      {arrayNotes.map((note) => (
        <TouchableOpacity
          key={note.id}
          onPress={() => editNote(note.id)}
          style={styles.noteContainer}
        >
          <Text style={styles.noteText}>{note.text + ":"}</Text>
          <View style={styles.noteContent}>
            <SimpleLineIcons color={"#555"} size={15} name="pencil" style={styles.notePencil} />
            <Text style={styles.noteAnswer} numberOfLines={3}>{getAnswerNote(note.id)}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={addQuestion}
        style={styles.addButtonContainer}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </>
  ), [arrayNotes, addQuestion]);

  const ListEmptyComponent = useCallback(() => (
    <View>
      <Text style={[styles.textEmpty, { fontSize: 20, marginTop: "45%", fontWeight: 'bold' }]}>your list of questions is empty.</Text>
      <Text style={styles.textEmpty}>Press <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>+</Text> to add your first question.</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Image style={styles.backgroundImage} source={require("../../resources/background.jpg")} />
      <View style={styles.headerBackground} />
      {isEditMode ? (
        <DraggableFlatList
          data={arrayQuestions}
          renderItem={renderQuestionButton}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => reorderQuestions(data)}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <FlatList
          data={arrayQuestions}
          renderItem={renderQuestionButton}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: "100%",
    height: "100%",
    position: "absolute"
  },
  headerBackground: {
    position: "absolute",
    elevation: 2,
    zIndex: 2,
    width: "100%",
    height: 60,
    backgroundColor: "white"
  },
  listContentContainer: {
    flexGrow: 1,
  },
  textEmpty: {
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 3,
    fontSize: 16,
  },
  noteContainer: {
    marginTop: 30,
    marginHorizontal: "5%",
  },
  noteText: {
    fontFamily: 'Montserrat-Regular',
    color: "#555",
  },
  noteContent: {
    flexDirection: "row",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fafafa",
    elevation: 2,
    borderRadius: 5,
  },
  notePencil: {
    marginLeft: -15,
    marginTop: -5,
    marginRight: 10,
    width: 30,
    height: 30,
    transform: [{ rotateY: '180deg' }],
  },
  noteAnswer: {
    width: "90%",
    color: "#aaa",
    textDecorationLine: 'underline',
  },
  addButtonContainer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#aaa",
    backgroundColor: "white",
    justifyContent: 'center',
  },
  addButtonText: {
    width: 50,
    color: "#555",
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Montserrat-Thin',
  },
});

export default MeasuresScreen;