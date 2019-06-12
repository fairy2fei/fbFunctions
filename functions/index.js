const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    const name = req.query.text;
    const snapshot = await admin.database().ref('/doc').push({name: name});
    res.redirect(303, snapshot.ref.toString());
  });

exports.makeUppercase = functions.database.ref('/doc/{pushId}/name')
    .onCreate((snapshot, context) => {
      const name = snapshot.val();
      console.log('Uppercasing', context.params.pushId, name);
      const uppercase = name.toUpperCase();
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });