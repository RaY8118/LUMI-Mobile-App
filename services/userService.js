import axios from "axios"
const apiUrl = process.env.EXPO_PUBLIC_API_URL
import { Alert } from "react-native"


export const uploadProfileImg = async (uri, userId, familyId) => {
  const formData = new FormData()
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg"
  })

  try {
    const response = await axios.post(`${apiUrl}/save_profile_picture/${userId}/${familyId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    if (response.data.status === "success") {
      Alert.alert("Success", response.data.message)
    }
  }
  catch (error) {
    console.error(error.response.data.message)
  }
}

export const editPersonalInfo = async (userId, name, setName, mobile, setMobile) => {

  try {
    const updateData = {
      userId,
      ...(name && { name }),
      ...(mobile && { mobile })
    }

    const response = await axios.put(`${apiUrl}/update-info`, updateData)

    setName("")
    setMobile("")
    console.log(response.data.message)
    Alert.alert("Sucess", response.data.message)
  } catch (error) {
    console.error(error.response.data.message)
    Alert.alert("Sucess", error.response.data.message)
  }
}


export const createFamily = async (CGId) => {
  try {
    const response = await axios.post(`${apiUrl}/family`, {
      caregiverId: CGId
    })
    const { familyId } = response.data

    if (!familyId)
      throw new Error("Family ID not returned from the server")
    return familyId
  } catch (error) {
    errorMessage = error.response.data.message
    throw new Error(errorMessage)
  }
}


export const addPatient = async (userId, familyId) => {
  try {
    const response = await axios.post(`${apiUrl}/family/add_patient`, {
      userId,
      familyId
    })

    return response.data.message
  } catch (error) {
    errorMessage = error.response.data.message
    throw new Error(errorMessage)
  }
}


export const addMember = async (userId, familyId) => {
  try {
    const response = await axios.post(`${apiUrl}/family/add_user`, {
      userId,
      familyId
    })

    return response.data.message
  } catch (error) {
    errorMessage = error.response.data.message
    throw new Error(errorMessage)
  }
}

export const addInfo = async (userId, relation, tagline, triggerMemory) => {
  try {
    const response = await axios.post(`${apiUrl}/save-additional-info`, {
      userId,
      relation,
      tagline,
      triggerMemory
    })
    return response.data.message
  } catch (error) {
    errorMessage = error.response.data.message
    throw new Error(errorMessage)
  }
}


export const createRoom = async () => {
  try {
    const response = await axios.post(`${apiUrl}/create-room`, {
    })
    const { room } = response.data
    console.log(response)

    if (!room)
      throw new Error("Romm ID not returned from the server")
    return room
  } catch (error) {
    errorMessage = error.response.data.message
    throw new Error(errorMessage)
  }
}
