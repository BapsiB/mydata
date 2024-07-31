import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedConstants from './sharedConstants';
import Question from './question';
import Datas from './datas';

interface QuestionCallback {
    [key: string]: () => void;
}

interface QuestionDataPoint {
    date: Date;
    value: any;
}

interface LinearDataContainer {
    fields: string[];
    data: any[][];
}

interface DateState {
    filled: boolean;
}

class DataManager {
    NOTE_QUESTION_ID: string;
    questionsLoaded: boolean;
    listQuestions: Question[];
    questionsSettings: any[];
    daysData: Datas;
    questionCallback: QuestionCallback;
    answersUpdateCallback: (() => void) | null;

    constructor() {
        this.NOTE_QUESTION_ID = "9999";
        this.questionsLoaded = false;
        this.listQuestions = [];
        this.questionsSettings = [];
        this.daysData = new Datas(this);
        this.questionCallback = {};
        this.answersUpdateCallback = null;

        this.init();
    }

    clearAll = async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }
        console.log('Done.');
    };

    _storeData = async (key: string, data: any): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            // saving error
        }
    };

    getData = async (key: string): Promise<any> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
            return null;
        }
    };

    init = (): void => {
        this.getData("@questions").then((data) => {
            if (data) {
                this.listQuestions = [];
                for (const question of data) {
                    const questionCast = new Question(question, this);
                    this.listQuestions.push(questionCast);
                }
                this.updateQuestionsOrder();
            }

            this.questionsLoaded = true;
            this.callQuestionsCallbacks();
        });

        AsyncStorage.getAllKeys().then((stringArray) => {
            let stringDataDayArray: string[] = [];

            for (const s of stringArray) {
                const key = s;
                if (key.includes("@DataDay:")) {
                    stringDataDayArray.push(key);
                }
            }

            AsyncStorage.multiGet(stringDataDayArray, (error, response) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    return;
                }

                const lArrayObjects = response;
                let needsNewSave = false;
                this.daysData.clear();
                for (const pairData of lArrayObjects) {
                    const key = pairData[0];
                    const object = pairData[1] != null ? JSON.parse(pairData[1]) : null;
                    const keyDateOnly = key.split("@DataDay:").pop();

                    if (keyDateOnly) {
                        this.daysData.set(keyDateOnly, object);
                    }
                }
                if (this.answersUpdateCallback) {
                    this.answersUpdateCallback();
                }
            });
        });
    };

    getAllDataStrorageAsString = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getAllKeys().then((stringArray) => {
                AsyncStorage.multiGet(stringArray, (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(JSON.stringify(response));
                    }
                });
            });
        });
    };

    getFilledDates = (): Record<string, DateState> => {
        const convertDateFormat = (dateString: string): string => {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6)}`;
        };

        const lAllData = this.daysData.getAllData();
        let filledDates: Record<string, DateState> = {};

        for (let dayIndex in lAllData) {
            const dataDataDate = lAllData[dayIndex];

            let hasQuestionUnanswered = false;
            for (let valuesIndex in dataDataDate.values) {
                const lQuestionsValues = dataDataDate.values[valuesIndex];
                if (lQuestionsValues.v === undefined) {
                    hasQuestionUnanswered = true;
                    break;
                }
            }
            if (!hasQuestionUnanswered) {
                const properdateFormat = String(convertDateFormat(dataDataDate.date));
                filledDates[properdateFormat] = { filled: true };
            }
        }
        return filledDates;
    };

    getPartiallyFilledDates = (): void => {
        // Implementation needed
    };


    getQuestionsDataLinear = (): LinearDataContainer => {
        const container: LinearDataContainer = { fields: ["questions"], data: [] };

        const dateLimits = this.daysData.getMinMaxDates();
        if (!dateLimits.min || !dateLimits.max) {
            return container; // Return empty container if no data
        }

        const difference = dateLimits.max.getTime() - dateLimits.min.getTime();
        const days = Math.min(Math.ceil(difference / (1000 * 3600 * 24)), 10000);

        // Populate date fields
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(dateLimits.min);
            currentDate.setDate(currentDate.getDate() + i);
            const dateString = this.getDateString(currentDate);
            container.fields.push(dateString);
        }

        // Populate data for each question
        this.listQuestions.forEach(question => {
            const questionRow: any[] = [question.text]; // First column is question text

            const questionData = question.getArrayValues({ normalizeValue: false }) as QuestionDataPoint[];

            for (let i = 1; i < container.fields.length; i++) {
                const dateString = container.fields[i];
                const dataPoint = questionData.find(dp => this.getDateString(dp.date) === dateString);
                questionRow.push(dataPoint ? dataPoint.value : "");
            }

            container.data.push(questionRow);
        });

        return container;
    };

    callQuestionsCallbacks = (): void => {
        for (let i in this.questionCallback) {
            this.questionCallback[i]();
        }
    };

    saveListQuestions = (): void => {
        const lListSavable = this.listQuestions.map(question => question.getStringifyiableObject());
        this._storeData("@questions", lListSavable);
    };

    updateQuestionsOrder = (): void => {
        this.listQuestions.sort((a, b) => a.displayOrder - b.displayOrder);
        this.callQuestionsCallbacks();
    };

    setQuestionVisibility = (questionId: string, visibility: boolean): void => {
        this.questionsSettings[questionId] = { visibility: visibility };
        this._storeData("@questionsSettings", this.questionsSettings);
    };

    getQuestionVisibility = (questionId: string): boolean => {
        const lObj = this.questionsSettings[questionId];
        if (lObj) {
            const answer = lObj.visibility;
            if (answer !== undefined) {
                return answer;
            }
        }
        return true;
    };

    getDateString = (date: Date): string => {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };

    getDateFromString = (dateString: string): Date => {
        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1;
        const day = parseInt(dateString.substring(6, 8));
        return new Date(year, month, day);
    };

    setData = (questionID: string, date: Date, value: any): void => {
        const lDateStr = this.getDateString(date);
        const lTagStoring = "@DataDay:" + lDateStr;

        let lDayData = this.daysData.getValuesForDate(lDateStr);
        if (lDayData === null) {
            lDayData = [];
        }

        let foundIt = false;
        for (let i in lDayData) {
            if (lDayData[i].id == questionID) {
                lDayData[i].v = value;
                foundIt = true;
                break;
            }
        }

        if (!foundIt) {
            lDayData.push({ id: questionID, v: value });
        }
        this.daysData.set(lDateStr, lDayData);
        this._storeData(lTagStoring, lDayData);

        if (this.answersUpdateCallback) {
            this.answersUpdateCallback();
        }
    };

    removeData = (questionID: string, date: Date): void => {
        const lDateStr = this.getDateString(date);
        const lTagStoring = "@DataDay:" + lDateStr;

        let lDayData = this.daysData.getValuesForDate(lDateStr);
        if (lDayData === null) {
            return;
        }

        lDayData = lDayData.filter(item => item.id !== questionID);

        this._storeData(lTagStoring, lDayData);

        if (this.answersUpdateCallback) {
            this.answersUpdateCallback();
        }
    };

    findAvailableId = (): string => {
        let maxNum = 0;
        for (let question of this.listQuestions) {
            const intValue = +question.id;
            if (intValue > maxNum) {
                maxNum = intValue;
            }
        }
        return (maxNum + 1).toString();
    };

    addQuestion = (aQuestionText: string, aQuestionType: string, aOptions: any[], colour: string, forcedId?: string): Question => {
        const lId = forcedId ? forcedId : this.findAvailableId();
        let lQuestion = new Question({ text: aQuestionText, type: aQuestionType, options: aOptions, colour, id: lId }, this);
        this.listQuestions.push(lQuestion);
        this.saveListQuestions();

        this.callQuestionsCallbacks();
        return lQuestion;
    };

    updateQuestion = (aQuestionId: string, aQuestionText: string, questionType: string, options: any[], colour: string): void => {
        let question = this.listQuestions.find(s => s.id == aQuestionId);
        if (question) {
            question.text = aQuestionText;
            question.type = questionType;
            question.setOptions(options);
            question.colour = colour;
        }

        this.saveListQuestions();
        this.callQuestionsCallbacks();
    };

    deleteQuestion = (aQuestionId: string): boolean => {
        const initialLength = this.listQuestions.length;
        this.listQuestions = this.listQuestions.filter(q => q.id != aQuestionId);

        if (this.listQuestions.length < initialLength) {
            this.saveListQuestions();
            this.callQuestionsCallbacks();
            return true;
        }
        return false;
    };

    getQuestions = (): Question[] => {
        return this.listQuestions.filter((question) => question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE);
    };

    getNotes = (): Question[] => {
        return this.listQuestions.filter((question) => question.type == SharedConstants.questionTypes.QUESTION_TYPE_NOTE);
    };

    getAppInfo = async (): Promise<any> => {
        return await this.getData("@appstate");
    };

    saveAppInfo = (appInfoData: any): void => {
        this._storeData("@appstate", appInfoData);
    };

    getAnswerForQuestion = (aQuestionId: string, aDate: Date): any => {
        const lDate = this.getDateString(aDate);
        return this.daysData.getValue(lDate, aQuestionId);
    };

    getAllData = (): any => {
        return this.daysData.getAllData();
    };

    getQuestionWithId = (aId: string): Question | null => {
        return this.listQuestions.find(s => s.id == aId) || null;
    };

    getNoteQuestion = (aId: string): Question | null => {
        return this.getQuestionWithId(aId);
    };

    restore = (objectToStore: [string, string][]): void => {
        AsyncStorage.clear().then(() => {
            objectToStore.forEach(([key, value]) => {
                AsyncStorage.setItem(key, value);
            });
            this.init();
        });
    };

    getNextQuestion = (
        currentQuestionId: string,
        goForward: boolean,
        onlyTakeUnreplied: boolean,
        discardNotes: boolean,
        date: Date
    ): Question | null => {
        const len = this.listQuestions.length;
        let indexReturn = 0;

        for (let i = 0; i < len; ++i) {
            if (this.listQuestions[i].id == currentQuestionId) {
                if (i == (len - 1) && goForward) {
                    indexReturn = 0;
                } else if (i == 0 && !goForward) {
                    indexReturn = len - 1;
                } else {
                    indexReturn = i + (goForward ? 1 : -1);
                }

                let nextQuestion = this.listQuestions[indexReturn];

                if (discardNotes && nextQuestion.isNote()) {
                    return this.getNextQuestion(nextQuestion.id, goForward, onlyTakeUnreplied, discardNotes, date);
                }

                if (onlyTakeUnreplied) {
                    const answer = this.getAnswerForQuestion(nextQuestion.id, date);
                    if (answer == null) {
                        return nextQuestion;
                    } else {
                        return this.getNextQuestionUnrespondedInArray(indexReturn, date);
                    }
                } else {
                    return nextQuestion;
                }
            }
        }

        return null;
    };

    getNextQuestionUnrespondedInArray = (aIndexInArray: number, date: Date): Question | null => {
        for (let indexAdd = 0; indexAdd < this.listQuestions.length; indexAdd++) {
            const index = (aIndexInArray + indexAdd) % this.listQuestions.length;
            const currentQuestion = this.listQuestions[index];
            const answer = this.getAnswerForQuestion(currentQuestion.id, date);

            if ((answer == null) && !currentQuestion.isNote()) {
                return currentQuestion;
            }
        }
        return null;
    };

    addQuestionsListener = (stringId: string, callback: () => void): void => {
        if (this.questionsLoaded) {
            callback();
        }
        this.questionCallback[stringId] = callback;
    };

    removeQuestionsListener = (stringId: string): void => {
        this.questionCallback[stringId] = () => { };
    };

    setAnswersUpdateListener = (callback: () => void): void => {
        this.answersUpdateCallback = callback;
    };
}

export default new DataManager();