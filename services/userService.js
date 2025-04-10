import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { Alert } from "react-native";

export const uploadProfileImg = async (uri, userId, familyId) => {
  const formData = new FormData();
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

  try {
    const response = await axios.post(
      `${apiUrl}/v1/vision/save_profile_picture/${userId}/${familyId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.status === "success") {
      Alert.alert("Success", response.data.message);
    }
  } catch (error) {
    console.error(error.response.data.message);
  }
};

export const editPersonalInfo = async (
  userId,
  name,
  setName,
  mobile,
  setMobile,
) => {
  try {
    const updateData = {
      userId,
      ...(name && { name }),
      ...(mobile && { mobile }),
    };
    console.log(updateData);

    const response = await axios.post(
      `${apiUrl}/v1/auth/update-info`,
      updateData,
    );

    setName("");
    setMobile("");
    Alert.alert("Success", response.data.message);
  } catch (error) {
    Alert.alert("Error", error.response.data.message);
  }
};

export const createFamily = async (CGId) => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/`, {
      caregiverId: CGId,
    });
    const { familyId } = response.data;

    if (!familyId) throw new Error("Family ID not returned from the server");
    return familyId;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addPatient = async (userId, familyId) => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/add_patient`, {
      userId,
      familyId,
    });

    return response.data.message;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addMember = async (userId, familyId) => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/add_user`, {
      userId,
      familyId,
    });

    return response.data.message;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addInfo = async (userId, relation, tagline, triggerMemory) => {
  try {
    const response = await axios.post(
      `${apiUrl}/v1/family/save-additional-info`,
      {
        userId,
        relation,
        tagline,
        triggerMemory,
      },
    );
    return response.data.message;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const getAddInfo = async (userId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/v1/family/get-additional-info`,
      {
        params: { userId },
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data.userInfo;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const createRoom = async (familyId) => {
  try {
    const response = await axios.post(`${apiUrl}/v1/chatroom/create-room`, {
      familyId,
    });
    return response.data;
  } catch (error) {
    errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};
