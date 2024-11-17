"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkUser = exports.createUser = void 0;
var app_1 = require("firebase-admin/app");
(0, app_1.initializeApp)();
var functions = require("firebase-functions");
var auth_1 = require("firebase-admin/auth");
var firestore_1 = require("firebase-admin/firestore");
var firebase_admin_1 = require("firebase-admin");
var fs = (0, firestore_1.getFirestore)();
var auth = (0, auth_1.getAuth)();
// const cors = require("cors")({origin: true});
// import this as module
var cors = require("cors");
var corsHandler = cors({ origin: true });
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.createUser = functions.https.onRequest(function (request, response) {
    corsHandler(request, response, function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, doc, counter, userIdChar, docData, userId, userRecord, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    console.log("Request", request.body);
                    data = request.body.data;
                    return [4 /*yield*/, fs.doc("sitedata/counters").get()];
                case 1:
                    doc = _a.sent();
                    counter = 1;
                    userIdChar = "A";
                    docData = doc.data();
                    if (!(doc.exists && docData && docData.users && docData.userIdChar)) return [3 /*break*/, 2];
                    console.log("Document data:", docData);
                    counter = docData.users;
                    userIdChar = docData.userIdChar;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fs.doc("sitedata/counters").set({
                        users: 0
                    })];
                case 3:
                    _a.sent();
                    counter = 1;
                    _a.label = 4;
                case 4:
                    userId = userIdChar + "-" + counter.toString();
                    console.log("userId", userId);
                    if (!(data.password == data.confirmPassword)) return [3 /*break*/, 7];
                    return [4 /*yield*/, auth.createUser({
                            uid: userId,
                            email: data.email,
                            password: data.password,
                            displayName: data.username
                        })];
                case 5:
                    userRecord = _a.sent();
                    console.log("Successfully fetched user data: ".concat(userRecord.toJSON()));
                    // if counter is 999 then reset it to 1 and increment userIdChar
                    if (counter >= 999) {
                        userIdChar = String.fromCharCode(userIdChar.charCodeAt(0) + 1);
                    }
                    return [4 /*yield*/, fs.doc("sitedata/counters").update({
                            users: counter >= 999 ? 1 : firebase_admin_1.firestore.FieldValue.increment(1),
                            userIdChar: userIdChar
                        })];
                case 6:
                    res = _a.sent();
                    console.log("Counter updated", res);
                    response.send(userRecord);
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Passwords don't match");
                    response.status(400).send("Passwords do not match");
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.log(error_1);
                    // throw new functions.https.HttpsError('failed-precondition', error);
                    response.status(400).send(error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
});
// check if a user exists by phoneNumber
exports.checkUser = functions.https.onRequest(function (request, response) {
    corsHandler(request, response, function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = request.body.data;
            (0, auth_1.getAuth)().getUserByPhoneNumber(data['phoneNumber']).then(function (userRecord) {
                return response.send(userRecord);
            })["catch"](function (error) {
                return response.status(400).send(error);
            });
            return [2 /*return*/];
        });
    }); });
});
