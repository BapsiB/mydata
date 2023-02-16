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

        this.hexToRgb = function(hex) {
          // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
          var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
          });
        
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        }

        // Convert hex to HSV.
        this.hexToHSV = function(H) {
              // Convert hex to RGB first
              let r = 0, g = 0, b = 0;
              if (H.length == 4) {
                r = "0x" + H[1] + H[1];
                g = "0x" + H[2] + H[2];
                b = "0x" + H[3] + H[3];
              } else if (H.length == 7) {
                r = "0x" + H[1] + H[2];
                g = "0x" + H[3] + H[4];
                b = "0x" + H[5] + H[6];
              }
              // Then to HSL
              r /= 255;
              g /= 255;
              b /= 255;
              let cmin = Math.min(r,g,b),
                  cmax = Math.max(r,g,b),
                  delta = cmax - cmin,
                  h = 0,
                  s = 0,
                  l = 0;
            
              if (delta == 0)
                h = 0;
              else if (cmax == r)
                h = ((g - b) / delta) % 6;
              else if (cmax == g)
                h = (b - r) / delta + 2;
              else
                h = (r - g) / delta + 4;
            
              h = Math.round(h * 60);
            
              if (h < 0)
                h += 360;
            
              l = (cmax + cmin) / 2;
              s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
              s = +(s * 100).toFixed(1);
              l = +(l * 100).toFixed(1);
            
              return {h:h, s:s, v:l};
        }

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