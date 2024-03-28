import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DataManager from './dataManager';
import AppState from './appState';

const DebugScreen = () => {

    function onResetIntro() {
        AppState.resetIntro();
    }

    function onResetData() {
        DataManager.clearAll();
    }

    return (
        <View style={styles.mainView}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => { onResetIntro(); }}>
                <Text style={styles.buttonText}>Reset Intro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => { onResetData(); }}>
                <Text style={styles.buttonText}>Erase All Data</Text>
            </TouchableOpacity>
        </View>
    )
}

export default DebugScreen;

const styles = StyleSheet.create({
    mainView: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    },
    buttonStyle: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 50,
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    },

    buttonText: {
        color: "#444",
        fontSize: 20,
        textAlign: 'center',

    }

});