import { useUser } from './useUser'

export const usePatient = () => {
  const { user } = useUser()

  const CGId = user?.userId
  const patient = user?.patient?.[0] || null
  const PATId = patient?.userId || null
  const PATName = patient?.name || null


  return {
    CGId, patient, PATId, PATName
  }
}

