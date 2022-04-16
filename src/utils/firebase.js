import { initializeApp } from 'firebase/app'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, query, where, onSnapshot, addDoc, setDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore'

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
  getUser(userId) {
    const docRef = doc(db, 'users', userId)
    return getDoc(docRef).then(doc => doc.data())
  },
  getComments(cafeId) {
    return getDocs(collection(db, `cafes/${cafeId}/comments`)).then(
      docsSnapshot => {
        const commentArray = docsSnapshot.docs.map(doc => ({
          commentId: doc.data().commentId,
          createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
          userId: doc.data().userId,
          text: doc.data().text,
          replies: doc.data().replies,
        }))
        return commentArray
      }
    )
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
