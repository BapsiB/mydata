
import { Text, Pressable, Modal, View, StyleSheet } from 'react-native';

type callbackType = () => void;

type PopupWindowProps = {
    textLayer1:string, // first line of the popup.
    textLayer2:string, // second line of the popup.
    textLayer3:string, // third line of the popup.
    answer1:string, // first button text.
    answer2:string, // second button text.
    callbackAnswer1:callbackType, // callback when first button clicked.
    callbackAnswer2:callbackType,  // callback when second button clicked.
    onRequestClose:callbackType // callback when exiting the popup without clicking ona button.
}

const PopupWindow = (props:PopupWindowProps) => {

      return(
      <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        props.onRequestClose();
      }}
      >
      <View style={styles.centeredView}>
          <View style={styles.modalView}>
              <Text style={[styles.modalText, {fontSize:18}]}>{props.textLayer1}</Text>
              <Text style={[styles.modalText, {color:"red", marginBottom:20, fontSize:16,}]}>{props.textLayer2}</Text>
              <Text style={[styles.modalText, {color:"black", marginBottom:20}]}>{props.textLayer3}</Text>
              <View style={{flexDirection: "row"}}>
                  <Pressable
                  style={[styles.button, styles.buttonClose, {backgroundColor:"#f99"}]}
                  onPress={props.callbackAnswer1}
                  >
                  <Text style={[styles.textStyle, {color:"white"}]}>{props.answer1}</Text>
                  </Pressable>
                  <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={props.callbackAnswer2}
                  >
                  <Text style={styles.textStyle}>{props.answer2}</Text>
                  </Pressable>
              </View>
          </View>
      </View>
  </Modal>)
}

const styles = StyleSheet.create({

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

export default PopupWindow;
