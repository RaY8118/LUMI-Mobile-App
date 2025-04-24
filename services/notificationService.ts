import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const sendCustomNotification = async (PATId: string, message: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${apiUrl}/v1/notifications/send-push-notification`,
      {
        PATId,
        message,
      },
    );

    if (response.data.status === "success") {
      console.log(response.data);
    }
  } catch (error: any) {
    console.error(error.data.message);
  }
};
