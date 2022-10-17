import { Text, TextInput } from 'react-native';

export default QuestionEditor = (props) => {

  const [text, onChangeText] = React.useState("Useless Text");

  return (
      <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="useless placeholder"
          />
      </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});