"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const settings_1 = require("./settings");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return settings_1.app; } });
const port = 3002;
settings_1.app.listen(port, () => {
    console.log(`listen on port ${port}`);
});
