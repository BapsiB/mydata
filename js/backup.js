import {Share, Alert} from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';

class Backup {
    constructor() {

      this.backup = function() {
        onShare();
      }

      const onShare = async () => {
        DataManager.getAllDataStrorageAsString().then((lMessage) => {
        try {
          Share.share({
            message:lMessage,
          }).then((result) => {
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          })
          
        } catch (error) {
          Alert.alert();
        }
      })
      };
    

    }
    

};

export default new Backup();