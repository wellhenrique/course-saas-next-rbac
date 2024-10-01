import { FormEvent, useState, useTransition } from 'react'

type FormStateProps = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormStateProps>,
  initialState?: FormStateProps,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<FormStateProps>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)
      // Updates the state only if necessary
      if (state) setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
