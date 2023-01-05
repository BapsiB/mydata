import {
    HeaderStyleInterpolators,
    StackCardInterpolationProps,
    StackNavigationOptions,
    TransitionSpecs,
  } from '@react-navigation/stack';
  

class Utils {
    constructor() {
        this.horizontalScreenAnimation = {
            cardStyleInterpolator: ({ current, layouts }) => {
            return {
                cardStyle: {
                transform: [
                    {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                    },
                ],
                },
            };
            },
        };
    }
}



  export default new Utils();