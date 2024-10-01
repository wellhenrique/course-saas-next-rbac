import { api } from './api-client'

export interface SignInWithGithubRequest {
  code: string
}

export interface SignInWithGithubResponse {
  token: string
}

export async function signInWithGithub(
  data: SignInWithGithubRequest,
): Promise<SignInWithGithubResponse> {
  const { code } = data

  const response = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<SignInWithGithubResponse>()

  return response
}
