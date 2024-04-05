import React, {useRef, useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DataVisualisationScreen from "./dataVisualisationScreen";
import AIAnalyticScreen from "./AIAnalytics";
import Icon from 'react-native-vector-icons/FontAwesome5';

const DataVisuRoute = () => (
  <DataVisualisationScreen></DataVisualisationScreen>
);

const AIRoute = () => (
  <AIAnalyticScreen></AIAnalyticScreen>
);

const renderScene = SceneMap({
  first: DataVisuRoute,
  second: AIRoute,
});

const getTabBar = props => (
  <TabBar
    {...props}
    // renderIcon={({ route, focused, color }) => (
    //   <Icon
    //     name={'robot'}
    //     color={color}
    //     size={30}
    //   />
    // )}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color:"#777", margin: 0, fontFamily:"Montserrat-Regular"}}>
        {route.title}
      </Text>
    )}
    indicatorStyle={{ backgroundColor: '#9d9' }}
    style={{ backgroundColor: '#f5f5f5' }}
  />
  )


const DataAnalyticScreen = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Visualise' },
    { key: 'second', title: 'AI Analytics' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={getTabBar}
    />
  );
}

export default DataAnalyticScreen;