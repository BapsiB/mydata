import DataManager from './dataManager.js'

class AppState {
    public constructor() {
        this.data = null;
    }

    public async getAppInfo() {
        if(this.data) {
            return this.data;
        }
        else {
            return this.collectAppInfo();
        }
    }

    private async collectAppInfo() {
        DataManager.getAppInfo().then((data) => {
            return data;
        })
    }

    public setIntroVersion(aVersion) {
        // todo, do.
    }
}

export default new AppState();