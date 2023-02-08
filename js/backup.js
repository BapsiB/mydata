import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import { SafeAreaView, TextInput, Text, Pressable, Modal, View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import React, {useState} from "react";
import Share from 'react-native-share';
var { DocumentDirectoryPath, writeFile, readDir }  = require('react-native-fs');


class Backup {
    constructor() {

      this.backup = function() {
        onShare();
      }

      // const saveFile = async () => {
      //   const path = `${DocumentDirectoryPath}/${Date.now()}.txt`;
      
      //   try {
      //     await writeFile(path, "hello", 'utf8');
      //     Alert.alert('File saved', null, [{ text: 'OK' }]);
      //     const filesArr = await readDir(DocumentDirectoryPath);
      //     console.log(filesArr.length);
      //   } catch (e) {
      //     console.log('error', e);
      //   }
      // };
      

      const onShare = () => {
        DataManager.getAllDataStrorageAsString().then((lMessage) => {
          var path = DocumentDirectoryPath + '/test.json';
          
          // write the file
          writeFile(path, lMessage, 'utf8')
            .then((success) => {
              console.log('FILE WRITTEN!');

              Share.open({
                url:"file://" + path,
                title: 'Backup Data'
                
              }).then((result) => {

              }).catch((error) => {
                // throw error;
              })

            })
            .catch((error) => {
              throw error;
            });
      })
      };

      this.backupView = function() {
        return (
          <SafeAreaView>
            <View style={[styles.inputContainer, {backgroundColor:"#fff"}]}>
                <Text style={styles.backupScreenText}>Export backup:</Text>
                <Button style={styles.confirmButton} icon="backup-restore" mode="contained" onPress={onShare}>
                  BACKUP 
                </Button>
                <Text style={styles.backupScreenText}>Export for external use:</Text>
                <Button style={styles.confirmButton} icon="share" mode="contained" disabled={true}>
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
            if(!lObject) {
              return;
            }
            setObjectToStore(lObject);
          }
        }
  
        function isObject(text) {
  
          try {
          const obj = JSON.parse(text);
          if(obj.length) {
            return obj;
          }
          else {
            return null;
          }
          }
          catch (error) {
            Alert.alert("not the right format.");
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
    color:"grey"
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