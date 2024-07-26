import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionButton = ({ title, date, questionId, navigation, changeCallback, editCallback, isEditMode }) => {
  // ... (keep existing logic)

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, isEditMode && styles.buttonEdit]}
    >
      <Text style={styles.buttonText}>{title}</Text>
      {isEditMode && (
        <TouchableOpacity onPress={() => editCallback(questionId)} style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // ... (keep existing styles)
  },
  buttonEdit: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    // ... (keep existing styles)
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default QuestionButton;