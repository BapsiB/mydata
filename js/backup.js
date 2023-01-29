import {Share, Alert} from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import { SafeAreaView, TextInput, Text, View, StyleSheet } from 'react-native';

class Backup {
    constructor() {

      this.backup = function() {
        onShare();
      }

      const onShare = async () => {
        DataManager.getAllDataStrorageAsString().then((lMessage) => {
        try {
          Share.share({
            message:lMessage,
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
      };
    
      this.restoreView = function() {
        return (
          <SafeAreaView>
            <View style={[styles.inputContainer, {backgroundColor:"#fff"}]}>
              <Text style={[{}]}>Paste your backup here.</Text>
              <TextInput
                  style={[styles.input, {}]}
                  onChangeText={onSetValue}
                  onEndEditing={onSaveValue}
                  defaultValue={lAnswerForQuestion}
                  multiline={true}
                  maxLength={maxChar}
              />
            </View>
            <Text style={styles.letterCounter}>{answer.length}/{maxChar}</Text>
        </SafeAreaView>
        );
      }
    }


    

};

const styles = StyleSheet.create({
  input: {
    position:"absolute",
    height: "100%",
    width: "100%",
    borderWidth: 1,
    padding: 10,
    textAlignVertical:'top',
    borderWidth:0,
    fontSize:17,
    color:"#000"
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
});

export default new Backup();