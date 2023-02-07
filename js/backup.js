import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import { SafeAreaView, TextInput, Text, Pressable, Modal, View, StyleSheet, Share, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import React, {useState} from "react";
var RNFS = require('react-native-fs');


class Backup {
    constructor() {

      this.backup = function() {
        onShare();
      }

      const onShare = async () => {
        DataManager.getAllDataStrorageAsString().then((lMessage) => {
          var path = RNFS.DocumentDirectoryPath + '/test.json';
          // write the file
          RNFS.writeFile(path, lMessage, 'utf8')
            .then((success) => {
              console.log('FILE WRITTEN!');
              try {
                Share.share({
                  url: 'file://' + path,
                  title: 'Export Data'
                }).then((result) => {
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      // shared with activity type of result.activityType
                    } else {
                      // shared
                    }
                  } else if (result.action === Share.dismissedAction) {
                    // dismissed
                  }
                })
                
              } catch (error) {
                Alert.alert();
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
      })
      };

      this.backupView = function() {
        return (
          <SafeAreaView>
            <View style={[styles.inputContainer, {backgroundColor:"#fff"}]}>
                <Text style={styles.backupScreenText}>You can export your data for backup purpose:</Text>
                <Button style={styles.confirmButton} icon="backup-restore" mode="contained" >
                  BACKUP 
                </Button>
                <Text style={styles.backupScreenText}>or to use in external application (Excel, Number):</Text>
                <Button style={styles.confirmButton} icon="share" mode="contained" >
                  SAVE IN .CSV
                </Button>
            </View>
          </SafeAreaView>
        );
      }

      this.restoreView = function() {
        const [objectToStore, setObjectToStore] = useState(null);
        const [modalVisible, setModalVisible] = useState(false);

        textChanged = function(text) {
          if(text.length) {
            const lObject = isObject(text);
            setObjectToStore(lObject);
          }
        }
  
        function isObject(text) {
  
          const obj = JSON.parse(text);
          if(obj.length) {
            return obj;
          }
          else {
            return null;
          }
        }

        function doubleCheckPopUp() {
          setModalVisible(true);
        }

        function restore() {
          DataManager.restore(objectToStore);
          setModalVisible(false);
        }

        function getModal() {
          if(!modalVisible) {
            return null;
          }

          let dayCount = 0;
          let questionCount = 0;
          for(i in objectToStore) {
            const data = objectToStore[i];
            if(data[0].includes("@DataDay:") ) {
              dayCount++;
            }
            else if(data[0].includes("@questions")) {
              const questions = JSON.parse(data[1]);
              if(questions)
                if(questions.length)
                  questionCount = questions.length;
            }
          }

          return(
          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
              setModalVisible(false);
          }}
          >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <Text style={[styles.modalText, {fontSize:18}]}>Are you sure you want to load this state?</Text>
                  <Text style={[styles.modalText, {color:"red", marginBottom:20, fontSize:16,}]}>All your current data will be replaced and lost.</Text>
                  <Text style={[styles.modalText, {color:"black", marginBottom:20}]}>The new data contains answers for <Text style={{color:"blue"}}>{questionCount}</Text> questions, during  <Text style={{color:"blue"}}>{dayCount}</Text> days.</Text>
                  <View style={{flexDirection: "row"}}>
                      <Pressable
                      style={[styles.button, styles.buttonClose, {backgroundColor:"#f99"}]}
                      onPress={restore}
                      >
                      <Text style={[styles.textStyle, {color:"white"}]}>RESTORE</Text>
                      </Pressable>
                      <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {setModalVisible(false);}}
                      >
                      <Text style={styles.textStyle}>CANCEL</Text>
                      </Pressable>
                  </View>
              </View>
          </View>
      </Modal>)
        }

        return (
          <SafeAreaView>
            {getModal()}
            <View style={[styles.inputContainer, {backgroundColor:"#fff"}]}>
              <TextInput
                  style={[styles.input, {}]}
                  onChangeText={textChanged}
                  onEndEditing={()=>{}}
                  defaultValue={""}
                  placeholder={"Paste your backup text here."}
                  multiline={true}
              />
                <Button style={styles.confirmButton} disabled={objectToStore == null} icon="backup-restore" mode="contained" onPress={doubleCheckPopUp}>
                  Restore
                </Button>
            </View>
        </SafeAreaView>
        );
      }
    }


    

};

const styles = StyleSheet.create({
  input: {
    height: "100%",
    width: "100%",
    borderWidth: 1,
    padding: 10,
    textAlignVertical:'top',
    borderWidth:0,
    fontSize:17,
    color:"#000"
  },

  confirmButton: {
    margin:30,
    color:"white",
    backgroundColor:SharedConstants.coloursSet[6],
  },

  backupScreenText: {
    marginLeft:20,
    marginTop:20,
    fontSize:18,
  },

  inputContainer: {
      height: "80%",
      margin: 12,
      borderRadius:20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"rgba(240, 240, 240, 1)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal:5,
    marginHorizontal:30,
    borderWidth:1,
    borderColor:"#999",
    backgroundColor:"#fff"
  },

  modalText: {
    color:"black",
    textAlign: "center",
    fontWeight:'bold',
  }
});

export default new Backup();