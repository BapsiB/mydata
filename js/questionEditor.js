import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';

const QuestionEditor = (props) => {

  const [text, onChangeText] = React.useState("");

  return (
      <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="How many coffees today?"
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

export default QuestionEditor;