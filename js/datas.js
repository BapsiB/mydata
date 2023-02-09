import { supported32BitAbis } from "react-native-device-info";


class Datas {
    constructor(dataManager) {
        this.daysData = [];
        this.dataManager = dataManager;

        this.set = function(date, values) {
            for(let i in this.daysData) {
                if(this.daysData[i].date == date) {
                    this.daysData[i].values = values;
                    return;
                }
            }
            this.daysData.push({date:date, values:values});
            this.sort();
        }

        this.getValuesForDate = function(date) {
            for(let i in this.daysData) {
                if(this.daysData[i].date == date) {
                    return this.daysData[i].values;
                }
            }
            return null;
       }

       this.getMinMaxDates = function() {
        let returnObject = {min:new Date(Date.now()), max:new Date(1995, 11, 17) }
        for(let i in this.daysData) {
            const lDate = this.dataManager.getDateFromString(this.daysData[i].date);
            if(lDate < returnObject.min) {
                returnObject.min = lDate;
            }

            if(lDate > returnObject.max) {
                returnObject.max = lDate;
            }

        }

        return returnObject;
   }

       this.clear = function() {
        this.daysData = [];
       }

       this.getAllData = function() {
            return this.daysData;
       }

       this.getValue = function(date, questionId) {
            let dateDate = this.getValuesForDate(date);
            if(dateDate) {
                for(let i in dateDate) {
                    const lData = dateDate[i];
                    if(lData.id == questionId) {
                        return lData.v;
                    }
                }
            }
            return null;
       }

        this.sort = function() {
            //TODO: do
            this.daysData.sort((a, b) => { 
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
             });
        }
    }
}

export default Datas