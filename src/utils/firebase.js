import { initializeApp } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics"
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, updateDoc, query, where, onSnapshot, addDoc, setDoc, doc, serverTimestamp, orderBy, arrayUnion, arrayRemove, increment } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'ka-pi-7c760.firebaseapp.com',
  projectId: 'ka-pi-7c760',
  storageBucket: 'ka-pi-7c760.appspot.com',
  messagingSenderId: '182101821737',
  appId: '1:182101821737:web:ec28f6e364380c0d2fcf38',
  measurementId: 'G-CZ2VH2LVPP',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const db = getFirestore(app)
// const analytics = getAnalytics(app)

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
  saveCafe(userId, cafeId) {
    return new Promise(resolve => {
      updateDoc(doc(db, 'users', userId), {
        favCafes: arrayUnion(cafeId),
      }).then(() => resolve())
    })
  },
  deleteSavedCafe(userId, cafeId) {
    return new Promise(resolve => {
      updateDoc(doc(db, 'users', userId), {
        favCafes: arrayRemove(cafeId),
      }).then(() => resolve())
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
  checkSavedNumber(cafeId) {
    console.log(cafeId)

    const q = query(
      collection(db, 'users'),
      where('favCafes', 'array-contains', cafeId)
    )

    return new Promise(resolve => {
      getDocs(q).then(querySnapshot => {
        const savedUserArray = []
        querySnapshot.forEach(doc => savedUserArray.push(doc.id))
        resolve(savedUserArray)
      })
    })
  },
  addCafeDoc(cafeId, initData) {
    const cafeDocRef = doc(db, `cafes/${cafeId}`)
    setDoc(cafeDocRef, initData)
  },
  updatePageViews(cafeId) {
    getDoc(doc(db, `pageViews/${cafeId}`)).then(docSnap => {
      if (docSnap.exists()) {
        updateDoc(doc(db, `pageViews/${cafeId}`), { pageViews: increment(1) })
      } else {
        setDoc(doc(db, `pageViews/${cafeId}`), { pageViews: 1 })
      }
    })
  },
  getPageViews(cafeId) {
    return new Promise(resolve => {
      getDoc(doc(db, `pageViews/${cafeId}`)).then(docSnap => {
        if (docSnap.exists()) {
          resolve(docSnap.data().pageViews)
        } else {
          resolve(1)
        }
      })
    })
  },
  getComments(cafeId) {
    return new Promise(resolve => {
      const q = query(
        collection(db, `cafes/${cafeId}/comments`),
        orderBy('createdAt', 'desc')
      )

      getDocs(q).then(docsSnapshot => {
        const commentArray = docsSnapshot.docs.map(doc => ({
          commentId: doc.data().commentId,
          createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
          userId: doc.data().userId,
          text: doc.data().text,
          replies: doc.data().replies,
        }))
        resolve(commentArray)
      })
    })
  },
  addComment(cafeId, userId, text) {
    const newDocRef = doc(collection(db, `cafes/${cafeId}/comments`))

    return new Promise(resolve => {
      setDoc(newDocRef, {
        commentId: newDocRef.id,
        createdAt: serverTimestamp(),
        userId,
        text,
      })
      resolve()
    })
  },
  listenCommentsChanges(cafeId) {
    return new Promise(resolve => {
      const q = query(
        collection(db, `cafes/${cafeId}/comments`),
        orderBy('createdAt', 'desc')
      )
      onSnapshot(q, querySnapshot => {
        const commentArray = querySnapshot.docs.map(doc => ({
          commentId: doc.data().commentId,
          createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
          userId: doc.data().userId,
          text: doc.data().text,
          replies: doc.data().replies,
        }))
        resolve(commentArray)
      })
    })
  },
  getReplyList(cafeId, commentId) {
    return new Promise(resolve => {
      getDocs(
        collection(db, `cafes/${cafeId}/comments/${commentId}/replies`)
      ).then(querySnapshot => {
        const replyList = []
        querySnapshot.forEach(doc => {
          // console.log(doc.data())
          replyList.push(doc.data())
          resolve(replyList)
        })
      })
    })
  },
  addReply(data) {
    return new Promise(resolve => {
      const newDocRef = doc(
        collection(
          db,
          `cafes/${data.cafeId}/comments/${data.commentId}/replies`
        )
      )
      setDoc(newDocRef, {
        userId: data.userId,
        text: data.text,
        repliedAt: serverTimestamp(),
      }).then(() => resolve())
    })
  },
}
