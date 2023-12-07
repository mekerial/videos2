"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = 80;
settings_1.app.listen(port, () => {
    console.log(`listen on port ${port}`);
});
