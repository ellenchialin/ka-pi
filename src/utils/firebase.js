import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, updateDoc, query, where, onSnapshot, addDoc, setDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore'

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
    return new Promise(resolve => {
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log('From Check state: ', user)
          console.log('From Check state: ', user.uid)
          resolve(user.uid)
        }
      })
    })
  },
  nativeSignUp(name, email, password) {
    return new Promise(resolve => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user
          console.log('Signed Up', user.uid)

          setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name,
            favCafes: [],
            photo: '',
          })

          resolve(user.uid)
        })
        .catch(error => alert(error.message))
    })
  },
  nativeSignIn(email, password) {
    return new Promise(resolve => {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user

          resolve(user)
        })
        .catch(error => alert(error.message))
    })
  },
  getUser(id) {
    return new Promise(resolve => {
      // console.log('Inside getUser func')
      getDoc(doc(db, 'users', id))
        .then(docsnap => {
          if (docsnap.exists()) {
            // console.log('Get User: ', docsnap.data())
            resolve(docsnap.data())
          } else {
            alert('尚未擁有帳號，請先註冊')
            return
          }
        })
        .catch(error => alert(error.message))
    })
  },
  deleteSavedCafe(userId, updatedCafes) {
    return new Promise(resolve => {
      updateDoc(doc(db, 'users', userId), { favCafes: updatedCafes }).then(() =>
        resolve()
      )
    })
  },
  signout() {
    return new Promise(resolve => {
      signOut(auth)
        .then(() => {
          console.log('Logged out')
          resolve()
        })
        .catch(error => {
          alert('登出失敗，請重新嘗試')
          console.error(error)
        })
    })
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
