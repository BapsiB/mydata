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

        this.horizontalScreenAnimationRightToLeft = {
            cardStyleInterpolator: ({ current, layouts }) => {
            return {
                cardStyle: {
                transform: [
                    {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-layouts.screen.width, 0],
                    }),
                    },
                ],
                },
            };
            },
        };

        this.getShadowStyle = function() {
            return {
                shadowColor: "#000",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.45,
                shadowRadius: 3.84,
                elevation: 3,
            }
        }

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

        this.getDayDifference = function(date1, date2) {

            let differenceInMs = date2.getTime() - date1.getTime();
            let differenceInDays = differenceInMs / (1000 * 3600 * 24);

            return Math.abs(differenceInDays);
        }
        
    }
}



  export default new Utils();