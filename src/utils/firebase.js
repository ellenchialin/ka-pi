import { initializeApp } from 'firebase/app'
// prettier-ignore
import { getFirestore,collection,getDocs,query,where,onSnapshot,addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'ka-pi-7c760.firebaseapp.com',
  projectId: 'ka-pi-7c760',
  storageBucket: 'ka-pi-7c760.appspot.com',
  messagingSenderId: '182101821737',
  appId: '1:182101821737:web:ec28f6e364380c0d2fcf38',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const firebase = {
  getComments() {
    getDocs(
      collection(db, 'cafes/00e21150-8b6d-4a54-b4bb-5fa45099b15e/comments')
    )
      .then(docs => {
        const commentsArray = []
        docs.forEach(doc => commentsArray.push(doc.data()))

        console.log('Inside getComments, comments Array: ', commentsArray)

        return commentsArray
      })
      .catch(error => console.error(error))
  },
  addComment(cafeId, userId, text) {
    const newDocRef = doc(collection(db, `cafes/${cafeId}/comments`))

    setDoc(newDocRef, {
      commentId: newDocRef.id,
      createdAt: serverTimestamp(),
      userId,
      text,
      replies: [],
    })
  },
}
