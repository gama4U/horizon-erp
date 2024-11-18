import { AxiosError } from "axios";
import { IUserCredential, IUserSession } from "../../interfaces/user.interface";
import api from "../../utils/api.util";

export async function signIn(data: IUserCredential): Promise<IUserSession> {
  try {
    const response = await api.post('/auth/sign-in', data);
    return response.data;
  } catch(error) {
    let message;
    if(error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
