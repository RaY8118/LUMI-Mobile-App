import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { Alert } from "react-native";

interface UserInfo {
  name: string;
  relation: string;
  tagline: string;
  triggerMemory: string;
}

export const uploadProfileImg = async (uri: string, userId: string, familyId: string): Promise<void> => {
  const formData = new FormData();
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as unknown as Blob);

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
  } catch (error: any) {
    console.error(error.response.data.message);
  }
};

export const editPersonalInfo = async (
  userId: string,
  name: string,
  setName: (val: string) => void,
  mobile: string,
  setMobile: (val: string) => void,
): Promise<void> => {
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
  } catch (error: any) {
    Alert.alert("Error", error.response.data.message);
  }
};

export const createFamily = async (CGId: string): Promise<string> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/`, {
      caregiverId: CGId,
    });
    const { familyId } = response.data;

    if (!familyId) throw new Error("Family ID not returned from the server");
    return familyId;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addPatient = async (userId: string, familyId: string): Promise<string> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/add_patient`, {
      userId,
      familyId,
    });

    return response.data.message;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addMember = async (userId: string, familyId: string): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/family/add_user`, {
      userId,
      familyId,
    });

    return response.data.message;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const addInfo = async (userId: string, relation: string, tagline: string, triggerMemory: string): Promise<string> => {
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
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const getAddInfo = async (userId: string): Promise<UserInfo[]> => {
  try {
    const response = await axios.get(
      `${apiUrl}/v1/family/get-additional-info`,
      {
        params: { userId },
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data.userInfo;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const createRoom = async (familyId: string): Promise<string> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/chatroom/create-room`, {
      familyId,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    throw new Error(errorMessage);
  }
};
