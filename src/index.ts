import {initializeApp} from "firebase-admin/app";
initializeApp();
import * as functions from "firebase-functions";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
const fs = getFirestore();
const auth = getAuth();

// const cors = require("cors")({origin: true});
// import this as module
import * as cors from "cors";
const corsHandler = cors({origin: true});
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const createUser = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      console.log("Request", request.body);
      const data = request.body.data;
      const doc = await fs.doc("sitedata/counters").get();
      let counter = 1;
      let userIdChar = "A";
      const docData = doc.data();
      if (doc.exists && docData && docData.users && docData.userIdChar) {
        console.log("Document data:", docData);
        counter = docData.users;
        userIdChar = docData.userIdChar;
      } else {
        await fs.doc("sitedata/counters").set({
          users: 0,
        });
        counter = 1;
      }
      const userId = userIdChar + "-" + counter.toString();
      console.log("userId", userId);
      if (data.password == data.confirmPassword) {
        const userRecord = await auth.createUser({
          uid: userId,
          email: data.email,
          password: data.password,
          displayName: data.username,
        });
        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
        // if counter is 999 then reset it to 1 and increment userIdChar
        if (counter >= 999) {
          userIdChar = String.fromCharCode(userIdChar.charCodeAt(0) + 1);
        }
        const res = await fs.doc("sitedata/counters").update({
          users: counter >= 999 ? 1 : firestore.FieldValue.increment(1),
          userIdChar: userIdChar,
        });
        console.log("Counter updated", res);
        response.send(userRecord);
        // See the UserRecord reference doc for the contents
        // of userRecord.
      } else {
        console.log("Passwords don't match");
        response.status(400).send("Passwords do not match");
      }
    } catch (error: any) {
      console.log(error);
      // throw new functions.https.HttpsError('failed-precondition', error);
      response.status(400).send(error);
    }
  });
});
// check if a user exists by phoneNumber
export const checkUser = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const data = request.body.data;
    getAuth().getUserByPhoneNumber(data['phoneNumber']).then((userRecord) => {
      return response.send(userRecord);
    }).catch((error) => {
      return response.status(400).send(error);
    })
  })
})
