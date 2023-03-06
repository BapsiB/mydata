import { supported32BitAbis } from "react-native-device-info";

type QuestionValue = {
    id:String;
    v:String;
}

type DayData = {
    date:Date;
    values:QuestionValue[];
}

class Datas {

    daysData: DayData[];
    dataManager: any;

    constructor(dataManager) {
        this.daysData = [];
        this.dataManager = dataManager;
    }

    public clear():void {
        this.daysData = [];
    }

    public getAllData():DayData[] {
        return this.daysData;
    }

    public getMinMaxDates():{min:Date, max:Date} {
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

    public set(date:Date, values:QuestionValue[]):void {
        for(let i in this.daysData) {
            if(this.daysData[i].date == date) {
                this.daysData[i].values = values;
                return;
            }
        }
        this.daysData.push({date:date, values:values});
        this.sort();
    }

    public getValuesForDate(date:Date):QuestionValue[] {
        for(let i in this.daysData) {
            if(this.daysData[i].date == date) {
                return this.daysData[i].values;
            }
        }
        return [];
    }

    private sort():void {
        this.daysData.sort((a, b) => { 
          if (a.date < b.date) {
            return -1;
          }
          if (a.date > b.date) {
            return 1;
          }
          return 0;
         });
    }

    public getValue(date:Date, questionId:String):any {
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
}

export default Datas