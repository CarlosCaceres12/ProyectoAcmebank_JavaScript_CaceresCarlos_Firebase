
const firebaseConfig = {
  apiKey: "AIzaSyAXJ-r43p2rYyxVo7-IG_N4qxBzsXnmSUQ",
  authDomain: "acmebank-d89a1.firebaseapp.com",
  databaseURL: "https://acmebank-d89a1-default-rtdb.firebaseio.com",
  projectId: "acmebank-d89a1",
  storageBucket: "acmebank-d89a1.appspot.com",
  messagingSenderId: "207502244110",
  appId: "1:207502244110:web:94b5d3aa09bc72eac5bf5f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
