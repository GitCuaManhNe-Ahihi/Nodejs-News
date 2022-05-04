import express from 'express'

let configViewEngineApp = (app) => {
    app.use(express.static('./Server/public'));
    app.set('view engine', 'ejs');
    app.set('views', './Server/src/views');
}
export default configViewEngineApp;
