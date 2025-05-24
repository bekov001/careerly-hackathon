import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase"; // Assuming firebaseConfig is in the root or an accessible path

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<{ success: boolean; message: string; token?: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // You can get the ID token here. In a real app, you might send this to your backend.
    const token = await user.getIdToken();
    console.log('Google Sign-In successful:', user);
    return { success: true, message: 'Вход через Google выполнен успешно!', token: token };
  } catch (error: any) {
    console.error("Error during Google sign-in:", error);
    let errorMessage = 'Произошла ошибка при входе через Google.';
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Всплывающее окно закрыто пользователем.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Запрос на всплывающее окно был отменен.';
    }
    return { success: false, message: errorMessage };
  }
};