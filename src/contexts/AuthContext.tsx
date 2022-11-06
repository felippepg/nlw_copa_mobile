import { createContext, ReactNode, useState, useEffect } from 'react'
import * as AuthSession from 'expo-auth-session'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api'

//garantir redirecionamento do navegador
WebBrowser.maybeCompleteAuthSession()


interface UserProps {
  name: string, 
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean
  signIn: () => Promise<void>
}

export interface AuthProviderProps {
  children: ReactNode;
}

//armazenar conteudo do contexto
export const AuthContext = createContext({} as AuthContextDataProps)

//função para prover contexto (compartilhar com toda a aplicação)
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    //parametros relacionados ao serviço do google sobre a autenticação
    clientId: process.env.CLIENT_ID,
    redirectUri:  AuthSession.makeRedirectUri({ useProxy: true}),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true)
      await promptAsync() //inicia o fluxo de autenticação

    } catch (error) {
      console.log(error)
      throw error

    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle( access_token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/signin', {access_token});

      //coloca o token em todas as requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`
      console.log("tooooken", tokenResponse.data.token)

      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data.user);

    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  //verifica a resposta da autenticação
  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}