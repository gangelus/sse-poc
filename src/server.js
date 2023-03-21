const express = require('express');
const cors = require('cors');
const path = require('path');

module.exports = function () {
    const app = express();

    app.use(cors());
    app.use(express.static(path.join(__dirname, '../public')));

    const port = process.env.PORT || 3000;
    app.listen(port);

    return app;
}