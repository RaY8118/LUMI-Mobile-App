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
