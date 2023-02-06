
import AppState from './appState';
import SharedConstants from './sharedConstants';
import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, TextInput, View, Image, Animated, Easing, TouchableOpacity, Dimensions, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuestionType from './questionEditor/questionEditorType';
import QuestionOptions from './questionEditor/questionEditorOptions';
import QuestionColour from './questionEditor/questionEditorColour';
import DataManager from './dataManager';

export default  Intro = (props) => {
    const currentIntroIndex = 1;

    const [needToDisplay, setNeedToDisplay] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [tutorialStep, setTutorialStep] = useState(0);
    const [questionType, setQuestionType] = useState(0);
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [options, onSetOptions] = React.useState({});
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const [colour, onSetColour] = React.useState(getRandomColour());

    function getRandomColour() {
        const index = Math.round(Math.random() * SharedConstants.coloursSet.length);
        return SharedConstants.coloursSet[index]
      }

    React.useEffect(() => {
        AppState.getAppInfo().then((data) => {
            let lNeedsDisplay = true;
            if(data) {
                if(data.introVersion >= currentIntroIndex) {
                    lNeedsDisplay = false;
                }
            }

            setNeedToDisplay(lNeedsDisplay);
        });
    }, []);

    function generateQuesion() {
        const lQuestions = [
            "how many coffee did i drink?",
            "what's my energy level?",
            "how many pigeon did i see?",
            "did i go outside?",
            "how anxious did i feel?",
            "how many hours did i sleep?",
            "how many push ups did i do?",
            "did i meditate?",
            "what's the colour of my mood?",
            "did i eat bread?",
            "what colour was i wearing today?",
            "how many hours did i spend in front of a screen?",
            "how social am i today?",
            "did i remember my dream?",
        ]
        const index = Math.floor(lQuestions.length * Math.random());
        const newQuestion = lQuestions[index];
        if(newQuestion == questionText) {
            generateQuesion();
            return;
        }
        setQuestionText(newQuestion); 
    }

    function updateQuestionText(aText) {
        setQuestionText(aText);
        setButtonEnabled(aText.length > 0);
    }

    function next(goBack) {
        if(!goBack) {
            if(tutorialStep == 5) {// end of question editing, we add it.
                let lOption;
                switch(questionType) {
                    case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                        lOption = {};
                    break;
                    case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                        lOption = options.number;
                    break;
                    case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                        lOption = options.intensity;
                    break;
                    case SharedConstants.questionTypes.QUESTION_TYPE_NOTE:
                    lOption = {};
                    break;
                }
                DataManager.addQuestion(questionText, questionType, lOption, colour);
                // if the user already has questions.
                if(DataManager.getQuestions().length > 1) {
                    skip();
                    return;
                }
            }
        }
        const lNextStep = tutorialStep + (goBack ? -1 : 1);
        setButtonEnabled(lNextStep != 4);
        Animated.timing(fadeAnim, {
            toValue: -1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
                setTutorialStep(lNextStep);
                fadeAnim.setValue(1);
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
          })
    }

    function getContent() {
        switch(tutorialStep) {
            case 0:
                return(
                    <View>
                    <Text style={styles.styleTop}>welcome, early tester!</Text>
                    <Text style={styles.styleBottom}>first time? take my hand. {"\n"} i give you a tour ❤️</Text>
                    </View>
                )
            case 1:
                return(
                    <View>
                    <Text style={[styles.styleBottom, {marginTop:"10%"}]}>this app is like a <Text style={{fontWeight:"bold"}}>journal</Text>, but using <Text style={{color:"#749B9C", fontWeight:"bold"}}>numbers</Text>, <Text style={{color:"#749B9C", fontWeight:"bold"}}>colours</Text> and more!</Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%"}]}>you can <Text style={{color:"#E07880", fontWeight:"bold"}}>keep track</Text> of what you want, <Text style={{color:"#E07880", fontWeight:"bold"}}>analyse it</Text>, <Text style={{color:"#E07880", fontWeight:"bold"}}>visualise it</Text>.{"\n"}{"\n"}I'll provide you nice tools for that.</Text>
                    </View>
                )
            case 2:
                return(
                    <View>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontWeight:"bold", color:"#749B9C"}]}>it can help you if:</Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontWeight:"bold", color:"#3F6669"}]}>you are curious about how you work</Text>
                    <Text style={[styles.styleBottom, {marginTop:10, fontWeight:"normal", fontSize:20}]}>it will include tools to help you see patterns and relations between the things you measure</Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontWeight:"bold", color:"#3F6669"}]}>you want to relflect on yourself</Text>
                    <Text style={[styles.styleBottom, {marginTop:10, fontWeight:"normal", fontSize:20}]}>it bring you to think about what are the right questions, and do a daily check up.</Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontWeight:"bold", color:"#3F6669"}]}>you simply like to collect and visualize</Text>
                    <Text style={[styles.styleBottom, {marginTop:10, fontWeight:"normal", fontSize:20}]}>it does that.</Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontWeight:"bold", color:"#3F6669"}]}>you have other ideas</Text>
                    <Text style={[styles.styleBottom, {marginTop:10, fontWeight:"normal", fontSize:20}]}>you can export your data anytime, in common formats and use them with other apps, like Excel</Text>
                    </View>
                )
            case 3:
                return(
                    <View>
                    <Text style={[styles.styleBottom, {marginTop:"10%"}]}>you'll define of a series of <Text style={{fontWeight:"bold"}}>questions</Text>, and you will reply to them, <Text style={{fontWeight:"bold"}}>every day.</Text></Text>
                    <Text style={[styles.styleBottom, {marginTop:"5%", fontSize:20, color:"#6F9699"}]}>(you can also figure them out later)</Text>
                    <Text style={[styles.styleBottom, {marginTop:"20%", fontSize:24, fontWeight:"bold"}]}>let's create your first question?</Text>
                    </View>
                )
            case 4:
                return(
                    <View>
                    <Text style={styles.styleTop}>is there something you'd like to observe?{"\n"}</Text>
                    <Text style={[styles.styleBottom, {marginTop:"0%"}]}>{"\n"} your <Text style={{fontWeight:"normal"}}>mood</Text>? <Text style={{fontWeight:"normal"}}>energy</Text>? <Text style={{fontWeight:"normal"}}>habits</Text>? or <Text style={{fontWeight:"normal"}}>things that could influence them</Text>?</Text>
                    <TextInput
                        numberOfLines={2} 
                        multiline
                        style={styles.input}
                        value={questionText}
                        placeholder={"write your question here"}
                        placeholderTextColor='#888'
                        adjustsFontSizeToFit={true}
                        onChangeText={updateQuestionText}
                        />
                    <Text style={[styles.styleBottom, {fontSize:20, marginTop:"0%"}]}>no idea? no problem! {"\n"}generate a random question.</Text>
                    <TouchableOpacity style={[{width:"100%", justifyContent: 'center', textAlign:'center', alignItems: 'center'}]} onPress={generateQuesion}>
                        <Icon name="loop" size={40} color="#000"  style={{justifyContent: 'center', width:40, borderRadius:10,}}>
                        </Icon>
                    </TouchableOpacity>
                    </View>
                )
            case 5:
                return(
                    <View>
                    <Text style={styles.styleBottom}>now we need to know <Text style={{color:"#B47B7C", fontWeight:"bold"}}>what kind of answer</Text> is expected for your question:{"\n"}<Text style={{fontWeight:"bold"}}>{'"' + questionText + '"' }</Text></Text>
                    <Text style={[styles.styleBottom, {marginTop:"4%", fontSize:20, marginBottom:"20%"}]}>it will help the app to visualize and analyse your answers later on.</Text>
                    <QuestionType style={styles.questionType} onChange={setQuestionType} questionTypeId={questionType} enabled={true}/>
                    <QuestionOptions style={{marginTop:20}} onChange={(options) => {onSetOptions(options);}} questionTypeId={questionType} initOptions={options}/>
                    </View>
                )
            case 6:
                return(
                    <View>
                    <Text style={styles.styleTop}>and finally a <Text style={{color:"#B47B7C", fontWeight:"bold"}}>colour</Text></Text>
                    <Text style={[styles.styleBottom, {marginTop:"4%", fontSize:20, marginBottom:"20%"}]}>it will be used for the charts and other visual markers.</Text>
                    <QuestionColour onChange={onSetColour} initColour={colour}/>
                    </View>
                )
            case 7:
                return(
                    <View>
                    <Text style={styles.styleTop}>and finally a <Text style={{color:"#B47B7C", fontWeight:"bold"}}>colour</Text></Text>
                    </View>
                )
        }
    }

    function getButtonText() {
        switch(tutorialStep) {
            case 0:
                return "take your hand";
            case 1:
                return "why do that?";
            case 2:
                return "how does it work?";
            case 3:
                return "let's!"
            case 4:
            case 5:
                return "done...";
            case 6:
                return "nice and pretty";
            default:
                return "";
        }
    }

    function getBackgroundImage() {
        switch(tutorialStep) {
            case 2:
            case 4:
                return require("../resources/splashNoMountains.jpg");
            case 7:
                return null;
            default:
                return require("../resources/splash.jpg");
        }
    }

    function skip() {
        setNeedToDisplay(false);
        AppState.setIntroVersion(currentIntroIndex);
        props.callback();
    }

    // Next, interpolate beginning and end values (in this case 0 and 1)
    const animInterpol1 = fadeAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-Dimensions.get('window').width, Dimensions.get('window').width]
        })

    return(
        
        <View style={{position:"absolute", width:"100%", height:"100%"}}>
            {needToDisplay &&
            <View>
                <Image style={{resizeMode: 'cover', width:"100%", height:"100%"}} source={getBackgroundImage()}></Image>
                <Animated.View style={[{transform: [{translateX: animInterpol1}]}, styles.styleAnimatedView]}>
                    {getContent()}
                </Animated.View>
                <View style={{position:"absolute", bottom:150, width:"100%", justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={[styles.nextButton, {textAlign: 'center', justifyContent: 'center', }, buttonEnabled ? {} : {opacity:0.5}]} onPress={() => {next(false)}} disabled={!buttonEnabled}>
                        <Text style={{fontSize: 24, color:"#ddd", textAlign:'center', justifyContent: 'center', fontWeight:'bold'}}>
                            {getButtonText()}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{position:"absolute", bottom:70, width:"100%", justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={[{justifyContent: 'center'}]} onPress={skip}>
                        <Text style={{fontSize: 18, color:"#333", textAlign:'center', justifyContent: 'center'}}>
                            skip
                        </Text>
                    </TouchableOpacity>
                </View>
                {(tutorialStep > 1) && <View style={{position:"absolute", bottom:10, width:"20%", justifyContent: 'flex-start'}}>
                    <TouchableOpacity style={[{justifyContent: 'center'}]} onPress={() => {next(true)}}>
                        <Text style={{fontSize: 18, color:"#333", textAlign:'center', justifyContent: 'center', color:"#777"}}>
                            {"<< back"}
                        </Text>
                    </TouchableOpacity>
                </View>}
            </View>
            }
        </View>
        
    )
}

const styles = StyleSheet.create({
    styleAnimatedView:{
        position:"absolute",
        width:"94%",
        margin:"3%"
    },

    styleTop: {
        marginTop:50,
        fontSize: 25,
        color:"#555",
        width:"100%",
        justifyContent: 'center',
        textAlign:"center",
        fontWeight:"bold"
    },
  
    styleBottom: {
      fontSize: 25,
      color:"#7E657D",
      width:"100%",
      marginTop:"20%",
      justifyContent: 'center',
      textAlign:"center",
      bottom:0,
    },

    nextButton: {
        margin:30,
        borderRadius:10,
        width:200,
        height:40,
        color:"white",
        backgroundColor:SharedConstants.coloursSet[6],
        position:"absolute"
      },

        input: {
          marginTop:50,
          borderRadius:10,
          height: 80,
          margin: 12,
          borderWidth: 0,
          padding: 10,
          backgroundColor:"white",
          fontSize:20,
          color:"#555",
        },
      
        questionType: {
            marginTop: 30,
            borderWidth: 1,
            padding: 10,
            width:"100%",
            flex:1
          },
  });
