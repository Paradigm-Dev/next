import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDQsd6rwdTVOF14mbfyhZTgtI2rLx5QOXE",
  authDomain: "paradigm-a1bc9.firebaseapp.com",
  databaseURL: "https://paradigm-a1bc9.firebaseio.com",
  projectId: "paradigm-a1bc9",
  storageBucket: "paradigm-a1bc9.appspot.com",
  messagingSenderId: "728943503114"
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore()
