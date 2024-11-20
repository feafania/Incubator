import {app} from './app'
import {SETTINGS} from "./settings";
import {formattedDate} from "./db/utils";
import {runDB} from "./db/db";

const startApp = async () => {
    await runDB();
    app.listen(SETTINGS.PORT, '0.0.0.0',() => {
        console.log('...server started in port ' + SETTINGS.PORT + ' at ' +formattedDate(new Date().getTime()))
    })
}

startApp()