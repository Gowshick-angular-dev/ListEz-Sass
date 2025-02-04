import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken, logoutAPI, logoutORG} from './_requests'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void 
  setAdmin: any
  admin: any | undefined
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  admin: undefined,
  setCurrentUser: () => {},
  setAdmin: () => {},
  logout: () => {
    localStorage.removeItem('role');
  },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const [admin, setAdmin] = useState<any | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }
  
  const logout = async () => {
    const userData:any = sessionStorage.getItem('usersData')
    if(currentUser?.org_id == 1) {
      await logoutAPI(JSON.parse(userData)?.api_token)
    } else {
      await logoutORG(JSON.parse(userData)?.api_token)    
    }
    saveAuth(undefined)
    localStorage.removeItem('role');
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, admin, setCurrentUser, setAdmin, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC = ({children}) => {
  const {auth, logout, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!didRequest.current) {
          // const {data} = await getUserByToken(apiToken)
          // const userData: any = localStorage.getItem('kt-auth-react-v');
          const userData:any = sessionStorage.getItem('usersData')
          const data = JSON.parse(userData)
          // console.log("jfgkjfgrkj", data)
          if (data) {
            setCurrentUser(data)
          }
        }
      } catch (error) {
        // console.error(error)
        if (!didRequest.current) {
          logout();
          localStorage.removeItem('role');
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token)
    } else {
      logout();
      localStorage.removeItem('role');
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
