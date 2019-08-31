import firebase from 'firebase/app';
import firebaseConfig from '@/firebaseConfig';
import 'firebase/database';
import 'firebase/auth';

const app = firebase.initializeApp(firebaseConfig);
const firebaseDatabase = app.database();

export { firebaseDatabase, firebase };