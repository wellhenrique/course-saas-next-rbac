import { api } from './api-client'

export interface GetProfileResponse {
  user: {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
  }
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.post('profile').json<GetProfileResponse>()

  return response
}
