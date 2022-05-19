import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// prettier-ignore
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// prettier-ignore
import { getFirestore, collection, getDoc, getDocs, updateDoc, query, where, deleteDoc, setDoc, doc, serverTimestamp, orderBy, increment, collectionGroup } from 'firebase/firestore'

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
const provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app)

export const firebase = {
  checkAuthState(func) {
    onAuthStateChanged(auth, user => func(user))
  },
  nativeSignUp(name, email, password) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user
          setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name,
            photo: '',
          })
          resolve(user)
        })
        .catch(error => {
          reject(new Error(`請重新操作 (${error.code})`))
          console.error('Error code', error.code)
        })
    })
  },
  nativeSignIn(email, password) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user
          resolve(user)
        })
        .catch(error => {
          reject(new Error(`請重新操作 (${error.code})`))
          console.error(error.code)
        })
    })
  },
  googleSignIn() {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then(result => {
          const user = result.user
          getDoc(doc(db, `users/${user.uid}`)).then(docsnap => {
            if (docsnap.exists()) {
              resolve(user)
            } else {
              setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
              }).then(() => resolve(user))
            }
          })
        })
        .catch(error => {
          reject(new Error(`請重新操作 (${error.code})`))
          console.error(error.code)
        })
    })
  },
  getUser(id) {
    return new Promise((resolve, reject) => {
      getDoc(doc(db, 'users', id))
        .then(docsnap => {
          if (docsnap.exists()) {
            resolve(docsnap.data())
          }
          reject(new Error('取得用戶資訊發生錯誤，請確認網路重新操作'))
        })
        .catch(error => {
          reject(new Error('取得用戶資訊發生錯誤，請確認網路重新操作'))
          console.error(error.message)
        })
    })
  },
  updateUserName(userId, newName) {
    return new Promise((resolve, reject) => {
      updateDoc(doc(db, `users/${userId}`), {
        name: newName,
      })
        .then(() => resolve())
        .catch(error => {
          reject(new Error('更新名稱發生錯誤，請確認網路重新操作'))
          console.error(error.message)
        })
    })
  },
  getUserPhotoUrl(userId, file) {
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `users/${file.name}`)
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef)
          .then(url => {
            updateDoc(doc(db, `users/${userId}`), { photo: url })
            resolve(url)
          })
          .catch(error => {
            reject(new Error('取得用戶頭貼發生錯誤'))
            console.error(error)
          })
      })
    })
  },
  getUserSavedCafes(userId) {
    return new Promise((resolve, reject) => {
      const q = query(
        collection(db, `users/${userId}/favCafes`),
        orderBy('savedAt', 'desc')
      )
      getDocs(q)
        .then(docsSnapshot => {
          const cafeList = docsSnapshot.docs.map(doc => ({
            cafeId: doc.id,
            savedAt: doc.data().savedAt.toDate().toLocaleDateString(),
          }))
          resolve(cafeList)
        })
        .catch(error => {
          reject(new Error('取得收藏發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  saveCafe(userId, cafeId) {
    return new Promise((resolve, reject) => {
      const cafeRef = doc(db, `users/${userId}/favCafes/${cafeId}`)

      setDoc(cafeRef, { id: cafeRef.id, savedAt: serverTimestamp() })
        .then(() => resolve())
        .catch(error => {
          reject(new Error('收藏咖啡廳發生錯誤'))
          console.error(error)
        })
    })
  },
  deleteSavedCafe(userId, cafeId) {
    return new Promise((resolve, reject) => {
      const cafeRef = doc(db, `users/${userId}/favCafes/${cafeId}`)
      deleteDoc(cafeRef)
        .then(() => resolve())
        .catch(error => {
          reject(new Error('移除收藏發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  signout() {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => resolve())
        .catch(error => {
          reject(new Error('登出失敗，請重新嘗試'))
          console.error(error)
        })
    })
  },
  checkSavedNumber(cafeId) {
    const q = query(collectionGroup(db, 'favCafes'), where('id', '==', cafeId))
    return new Promise((resolve, reject) => {
      getDocs(q)
        .then(querySnapshot => resolve(querySnapshot.size))
        .catch(error => {
          reject(new Error('取得收藏數發生錯誤'))
          console.error(error)
        })
    })
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
    return new Promise((resolve, reject) => {
      getDoc(doc(db, `pageViews/${cafeId}`))
        .then(docSnap => {
          if (docSnap.exists()) {
            resolve(docSnap.data().pageViews)
          } else {
            resolve(1)
          }
        })
        .catch(error => {
          reject(new Error('取得瀏覽數發生錯誤'))
          console.error(error)
        })
    })
  },
  publishBlog(cafeId, userId, data) {
    return new Promise((resolve, reject) => {
      const blogRef = doc(collection(db, `cafes/${cafeId}/blogs`))

      setDoc(blogRef, {
        blogId: blogRef.id,
        cafeId,
        userId,
        title: data.title,
        content: data.content,
        image: data.image,
        createdAt: serverTimestamp(),
      })
        .then(() => resolve(blogRef.id))
        .catch(error => {
          reject(new Error('發佈食記發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getAllBlogs(cafeId) {
    return new Promise((resolve, reject) => {
      const q = query(
        collection(db, `cafes/${cafeId}/blogs`),
        orderBy('createdAt', 'desc')
      )

      getDocs(q)
        .then(docsSnapshot => {
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
        .catch(error => {
          reject(new Error('取得食記發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getBlog(cafeId, blogId) {
    return new Promise((resolve, reject) => {
      const blogRef = doc(db, `cafes/${cafeId}/blogs/${blogId}`)
      getDoc(blogRef)
        .then(docsnap => {
          if (docsnap.exists()) {
            resolve(docsnap.data())
          } else {
            return
          }
        })
        .catch(error => {
          reject(new Error('取得食記發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  deleteUserBlog(cafeId, blogId) {
    return new Promise((resolve, reject) => {
      const blogRef = doc(db, `cafes/${cafeId}/blogs/${blogId}`)
      deleteDoc(blogRef)
        .then(() => resolve())
        .catch(error => {
          reject(new Error('刪除食記發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getBlogPhotoUrl(file) {
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `blogs/${file.name}`)
      uploadBytes(imageRef, file)
        .then(() => {
          getDownloadURL(imageRef)
            .then(url => {
              resolve(url)
            })
            .catch(error => {
              reject(new Error('取得照片連結發生錯誤，請重新嘗試'))
              console.error(error)
            })
        })
        .catch(error => {
          reject(new Error('上傳發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getUserBlogs(userId) {
    return new Promise((resolve, reject) => {
      const blogs = query(
        collectionGroup(db, `blogs`),
        where('userId', '==', `${userId}`),
        orderBy('createdAt', 'desc')
      )
      getDocs(blogs)
        .then(docsSnapshot => {
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
        .catch(error => {
          reject(new Error('取得用戶食記發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getComments(cafeId) {
    return new Promise((resolve, reject) => {
      const q = query(
        collection(db, `cafes/${cafeId}/comments`),
        orderBy('createdAt', 'desc')
      )

      getDocs(q)
        .then(docsSnapshot => {
          const commentList = []
          docsSnapshot.forEach(doc => {
            commentList.push(doc.data())
          })
          resolve(commentList)
        })
        .catch(error => {
          reject(new Error('取得留言發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getCommentPhotoUrl(file) {
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `comments/${file.name}`)
      uploadBytes(imageRef, file)
        .then(() => {
          getDownloadURL(imageRef)
            .then(url => resolve(url))
            .catch(error => {
              reject(new Error('取得照片連結發生錯誤，請重新嘗試'))
              console.error(error)
            })
        })
        .catch(error => {
          reject(new Error('上傳發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  addComment(data) {
    return new Promise((resolve, reject) => {
      const newDocRef = doc(collection(db, `cafes/${data.cafeId}/comments`))

      setDoc(newDocRef, {
        commentId: newDocRef.id,
        userId: data.userId,
        text: data.text,
        image: data.image,
        createdAt: serverTimestamp(),
      })
        .then(() => resolve())
        .catch(error => {
          reject(new Error('新增留言發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getReplyList(cafeId, commentId) {
    return new Promise((resolve, reject) => {
      const q = query(
        collection(db, `cafes/${cafeId}/comments/${commentId}/replies`),
        orderBy('repliedAt', 'desc')
      )

      getDocs(q)
        .then(querySnapshot => {
          const replyList = []
          querySnapshot.forEach(doc => {
            replyList.push(doc.data())
          })
          resolve(replyList)
        })
        .catch(error => {
          reject(new Error('取得回覆發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  getReplyPhotoUrl(file) {
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `replies/${file.name}`)
      uploadBytes(imageRef, file)
        .then(() => {
          getDownloadURL(imageRef)
            .then(url => resolve(url))
            .catch(error => {
              reject(new Error('取得照片連結發生錯誤，請重新嘗試'))
              console.error(error)
            })
        })
        .catch(error => {
          reject(new Error('上傳發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
  addReply(data) {
    return new Promise((resolve, reject) => {
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
      })
        .then(() => resolve())
        .catch(error => {
          reject(new Error('新增回覆發生錯誤，請重新嘗試'))
          console.error(error)
        })
    })
  },
}
