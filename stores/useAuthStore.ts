interface UserProps {
  id: string
  name: string
  email: string
}

interface LoginProps {
  email: string
  password: string
}

interface RegisterProps {
  name: string
  email: string
  password: string
}

type UpdateUserProps = Partial<UserProps>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProps | null>(null)

  const getUserData = async () => {
    const { data } = await useApiFetch('auth/profile')
    user.value = data.value as UserProps
  }

  const register = async (data: RegisterProps) => {
    const register = await useApiFetch('users', {
      method: 'POST',
      body: data
    })

    if (register.data.value) {
      navigateTo('/login')
    }

    return register
  }

  const login = async (credentials: LoginProps) => {
    const login = await useApiFetch('auth/login', {
      method: 'POST',
      body: credentials
    })

    if (login.data.value) {
      localStorage.setItem('token', JSON.stringify(login.data?.value))
      await getUserData()

      navigateTo('/')
    }

    return login
  }

  const logout = async () => {
    await useApiFetch('auth/logout', { method: 'POST' })

    user.value = null
    navigateTo('/login')
  }

  const github = async () => {
    await useApiFetch('auth/redirect')
  }

  const updateUser = async (data: UpdateUserProps) => {
    const result = await useApiFetch(`users/${user.value?.id}/update`, {
      method: 'PUT',
      body: data
    })

    return result
  }

  const deleteUser = async () => {
    const result = await useApiFetch(`users/${user.value?.id}/delete`, {
      method: 'DELETE'
    })

    if ((result.status.value = 'success')) {
      user.value = null
      navigateTo('/')
    }

    return result
  }

  return {
    user,
    getUserData,
    register,
    login,
    github,
    logout,
    updateUser,
    deleteUser
  }
})