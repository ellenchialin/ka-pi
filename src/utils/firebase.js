import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, query, where, onSnapshot, addDoc, setDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore'
import { Navigate } from 'react-router-dom'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'ka-pi-7c760.firebaseapp.com',
  projectId: 'ka-pi-7c760',
  storageBucket: 'ka-pi-7c760.appspot.com',
  messagingSenderId: '182101821737',
  appId: '1:182101821737:web:ec28f6e364380c0d2fcf38',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export const firebase = {
  checkAuthState() {
    onAuthStateChanged(auth, user => {
      if (user) {
        return user
      }
    })
  },
  nativeSignUp(name, email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        console.log(user)
        setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name,
          favCafes: [],
          photo: '',
        })
      })
      .catch(error => alert(error.message))
  },
  nativeSignIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(
      userCredential => {
        const user = userCredential.user
        getDoc(doc(db, 'users', user.uid))
          .then(docsnap => {
            if (!docsnap.exists()) {
              alert('尚未擁有帳號，請先註冊')
              return
            }
            console.log(docsnap)
            return docsnap
          })
          .catch(error => alert(error.message))
      }
    )
  },
  signout() {
    signOut(auth)
      .then(() => console.log('Logged out'))
      .catch(error => alert(error))
  },
  getUser(id) {
    const docRef = doc(db, 'users', id)
    getDoc(docRef)
      .then(docsnap => {
        if (docsnap.exists()) {
          console.log(docsnap.data())
        }
      })
      .catch(error => console.error(error))
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
