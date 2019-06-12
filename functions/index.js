const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const name = req.query.text;
  const ref = db.collection('investors').doc();
  try {
    const result = await ref.set({ name });
    res.send(result.writeTime);
  } catch (e) {
    throw new Error(e);
  }
});