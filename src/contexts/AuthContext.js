import { createContext, useContext, useEffect, useState } from 'react'
import { firebase } from '../utils/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [isUserLoading, setIsUserLoading] = useState(true)

  const signin = (email, password) => {
    return firebase.nativeSignIn(email, password)
  }

  const signout = () => {
    return firebase.signout()
  }

  const signup = (name, email, password) => {
    return firebase.nativeSignUp(name, email, password)
  }

  const getUser = () => {
    return firebase.getUser()
  }

  useEffect(() => {
    firebase.checkAuthState(user => {
      console.log('current user from checkAuthState: ', user)
      setCurrentUser(user)
      setIsUserLoading(false)
    })
  }, [])

  const value = {
    currentUser,
    getUser,
    signin,
    signout,
    signup,
  }

  return (
    <AuthContext.Provider value={value}>
      {!isUserLoading && children}
    </AuthContext.Provider>
  )
}