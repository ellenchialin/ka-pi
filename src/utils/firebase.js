import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// prettier-ignore
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, updateDoc, query, where, onSnapshot, deleteDoc, setDoc, doc, serverTimestamp, orderBy, arrayUnion, arrayRemove, increment, collectionGroup } from 'firebase/firestore'

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
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export const firebase = {
  checkAuthState(func) {
    onAuthStateChanged(auth, user => func(user))
  },
  nativeSignUp(name, email, password) {
    return new Promise(resolve => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user
          // console.log('Signed Up', user.uid)

          setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name,
            favCafes: [],
            photo: '',
          })

          resolve(user)
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
      getDoc(doc(db, 'users', id))
        .then(docsnap => {
          if (docsnap.exists()) {
            resolve(docsnap.data())
          } else {
            alert('尚未擁有帳號，請先註冊')
            return
          }
        })
        .catch(error => alert(error.message))
    })
  },
  updateUserName(userId, newName) {
    return new Promise(resolve => {
      updateDoc(doc(db, `users/${userId}`), {
        name: newName,
      }).then(() => resolve())
    })
  },
  getUserPhotoUrl(userId, file) {
    return new Promise(resolve => {
      const imageRef = ref(storage, `users/${file.name}`)
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then(url => {
          updateDoc(doc(db, `users/${userId}`), { photo: url })
          resolve(url)
        })
      })
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
          // console.log('Logged out')
          resolve()
        })
        .catch(error => {
          alert('登出失敗，請重新嘗試')
          console.error(error)
        })
    })
  },
  checkSavedNumber(cafeId) {
    // console.log(cafeId)
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
  /*
  getBlogId(cafeId) {
    const blogRef = doc(collection(db, `cafes/${cafeId}/blogs`))
    return blogRef.id
  },
  addBlog(cafeId, userId) {
    return new Promise(resolve => {
      const blogRef = doc(collection(db, `cafes/${cafeId}/blogs`))
      setDoc(blogRef, {
        blogId: blogRef.id,
        cafeId,
        userId,
        title: '',
        content: '',
        image: '',
        createdAt: serverTimestamp(),
      }).then(() => resolve(blogRef.id))
    })
  },
  */
  uploadBlog(cafeId, userId, data) {
    return new Promise(resolve => {
      const blogRef = doc(collection(db, `cafes/${cafeId}/blogs`))

      setDoc(blogRef, {
        blogId: blogRef.id,
        cafeId,
        userId,
        title: data.title,
        content: data.content,
        image: data.image,
        createdAt: serverTimestamp(),
      }).then(() => resolve(blogRef.id))
    })
  },
  getAllBlogs(cafeId) {
    return new Promise(resolve => {
      const q = query(
        collection(db, `cafes/${cafeId}/blogs`),
        orderBy('createdAt', 'desc')
      )

      getDocs(q).then(docsSnapshot => {
        const blogsArray = docsSnapshot.docs.map(doc => ({
          blogId: doc.data().blogId,
          cafeId: doc.data().cafeId,
          createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
          userId: doc.data().userId,
          title: doc.data().title,
          content: doc.data().content,
          image: doc.data().image,
        }))
        resolve(blogsArray)
      })
    })
  },
  getBlog(cafeId, blogId) {
    return new Promise(resolve => {
      const blogRef = doc(db, `cafes/${cafeId}/blogs/${blogId}`)
      getDoc(blogRef).then(docsnap => {
        if (docsnap.exists()) {
          resolve(docsnap.data())
        } else {
          alert('找不到此blog')
          return
        }
      })
    })
  },
  deleteBlog(cafeId, blogId) {
    return new Promise(resolve => {
      const blogRef = doc(db, `cafes/${cafeId}/blogs/${blogId}`)
      deleteDoc(blogRef).then(() => {
        console.log('Blog Deleted')
        resolve()
      })
    })
  },
  getBlogPhotoUrl(file) {
    return new Promise(resolve => {
      const imageRef = ref(storage, `blogs/${file.name}`)
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then(url => {
          resolve(url)
        })
      })
    })
  },
  getUserBlogs(userId) {
    return new Promise(resolve => {
      const blogs = query(
        collectionGroup(db, `blogs`),
        where('userId', '==', `${userId}`)
      )
      getDocs(blogs).then(docsSnapshot => {
        const blogsArray = docsSnapshot.docs.map(doc => ({
          blogId: doc.data().blogId,
          cafeId: doc.data().cafeId,
          createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
          userId: doc.data().userId,
          title: doc.data().title,
          content: doc.data().content,
          image: doc.data().image,
        }))
        resolve(blogsArray)
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
          image: doc.data().image,
          replies: doc.data().replies,
        }))
        resolve(commentArray)
      })
    })
  },
  getCommentPhotoUrl(file) {
    return new Promise(resolve => {
      const imageRef = ref(storage, `comments/${file.name}`)
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then(url => resolve(url))
      })
    })
  },
  addComment(cafeId, userId, text, image) {
    const newDocRef = doc(collection(db, `cafes/${cafeId}/comments`))

    return new Promise(resolve => {
      setDoc(newDocRef, {
        commentId: newDocRef.id,
        createdAt: serverTimestamp(),
        userId,
        text,
        image,
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
  getReplyPhotoUrl(file) {
    return new Promise(resolve => {
      const imageRef = ref(storage, `replies/${file.name}`)
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then(url => resolve(url))
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
        image: data.image,
        repliedAt: serverTimestamp(),
      }).then(() => resolve())
    })
  },
}
