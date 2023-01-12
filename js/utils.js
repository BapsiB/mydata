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

        this.increase_brightness = function(hex, percent){
            if(hex === undefined) {
                return "#fff";
            }
            // strip the leading # if it's there
            hex = hex.replace(/^\s*#|\s*$/g, '');
        
            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if(hex.length == 3){
                hex = hex.replace(/(.)/g, '$1$1');
            }
        
            var r = parseInt(hex.substr(0, 2), 16),
                g = parseInt(hex.substr(2, 2), 16),
                b = parseInt(hex.substr(4, 2), 16);
        
            return '#' +
               ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
               ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
               ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
        }
        
    }
}



  export default new Utils();