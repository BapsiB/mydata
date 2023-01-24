import DeviceInfo from 'react-native-device-info';
import React from 'react';
import {  Modal, View, StyleSheet, Text, Pressable, Linking } from 'react-native';

const UpdateManager = (props) => {

    this.buildNumber = DeviceInfo.getBuildNumber();
    this.needsUpdate = false;
    console.log("buildNumber " + this.buildNumber);

    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
        checkIfUpdateAvailable();
    }, []);

    const downloadNewVersion = function() {
        Linking.openURL("https://lebaptiste.com/toshare/app-debug.apk");
        this.needsUpdate = false;
        setModalVisible(false);
    }

    const checkIfUpdateAvailable = async () => {
        let response = await fetch('https://lebaptiste.com/toshare/myDataCurrentVersion.html');
        if(!response) {
            return;
        }
        
        let responseJson =  await response.text();
        const responseObject = JSON.parse(responseJson);
        if(!responseObject) {
            return;
        }

        if(!responseObject.android) {
            return;
        }
        
        if(responseObject.android > +this.buildNumber) {
            setModalVisible(true);
        }
    }

    return (
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
                <Text style={styles.modalText}>Baptiste just released a newer version!! 🥳</Text>
                <View style={{flexDirection: "row"}}>
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={this.downloadNewVersion}
                    >
                    <Text style={styles.textStyle}>DOWNLOAD IT</Text>
                    </Pressable>
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {setModalVisible(false);}}
                    >
                    <Text style={styles.textStyle}>LATER</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>
    ) 


}

const styles = StyleSheet.create({
    questionText: {
        marginVertical:0,
        marginHorizontal:20,
        color: 'black',
        fontSize: 25,
        fontWeight: '500',
        textAlignVertical:'center',
        textAlign:'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
        marginHorizontal:5
      },
      buttonOpen: {
        backgroundColor: "#Fbc4FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
    

 });

 export default UpdateManager;