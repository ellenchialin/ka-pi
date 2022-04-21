import { createContext, useContext, useEffect, useState } from 'react'
import { firebase } from '../utils/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

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
    const unsubscribe = firebase.checkAuthState(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
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
      {!loading && children}
    </AuthContext.Provider>
  )
}
