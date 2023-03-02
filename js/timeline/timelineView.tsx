import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DataManager from '../dataManager';

const TimeLineView = () => {

    const getMainLine = () => {
        return (
            <View style={{width:10, backgroundColor:"#ccf", height:"100%", borderRadius:5}}>

            </View>
        )
    }

    return(
        <View style={styles.mainView}>
            {getMainLine()}
        </View>
    )
}

const styles = StyleSheet.create({
    mainView:{
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    },
});

export default TimeLineView;