import DataManager from './dataManager.js'

type Data = {
    initialised: boolean;
    introVersion: number;
  };

class AppState {

    data: Data;

    public constructor() {
        this.data = {
            initialised:false,
            introVersion:-1
        }
    }

    public async getAppInfo() {
        if(this.data.initialised) {
            return this.data;
        }
        else {
            return await this.collectAppInfo();
        }
    }

    private async collectAppInfo() {
        const promise = DataManager.getAppInfo();
        promise.then((data:Data) => {
            this.data = data;
        })
        return promise;
    }

    private save() {
        DataManager.saveAppInfo(this.data);
    }

    public setIntroVersion(aVersion:number) {
        this.data.introVersion = aVersion;
        this.save();
    }
}

export default new AppState();