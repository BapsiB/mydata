import React from 'react';

import { Text, Button, View } from 'react-native';

const Question = (props) => {
  return (
    <Button
    key={props.key_app}
    title={props.title}
    color="#841584"
    accessibilityLabel="Learn more about this purple button"
    />
  );
}

function ListQuestionsDay(arr) {
  return (
  <View>
      {arr.map(title => {
        return <Question title={title}></Question>;
      })}
   </View>
  );
}

const MainView = () => {
    const arrayNames = [
      {name: 'How many times did you sleep today?', key:"1"},
      {name: 'Abby', key:"2"},
      {name: 'heyo', key:"2"}
    ];

    const listItems = arrayNames.map((d) => <Question title={d.name} key_app={d.key}></Question>);
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]

  return (
    <View>
    {listItems}
    </View>
  );
}

export default MainView;