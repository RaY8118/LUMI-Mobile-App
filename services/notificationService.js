import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const sendCustomNotification = async (PATId, message) => {
    try {
        const response = await axios.post(`${apiUrl}/send-push-notification`, {
            PATId,
            message
        })

        if (response.data.status === "success") {
            console.log(response.data)
        }
    } catch (error) {
        console.error(error.data.message)
    }
}