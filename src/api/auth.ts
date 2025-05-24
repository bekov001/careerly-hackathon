// src/api/auth.ts

const API_BASE_URL = 'https://kajet24.work.gd'; // Your backend API base URL

export const registerUser = async (username: string, password: string): Promise<{ success: boolean; message: string, token?: { access: string; refresh: string } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Assuming successful registration might return a token or a success message
      // Based on your docs, register doesn't return a token directly, so we'll just confirm success
      return { success: true, message: 'Регистрация прошла успешно! Теперь вы можете войти.' };
    } else {
      // Handle API errors (e.g., username already exists, validation errors)
      const errorMessage = data.username ? `Username: ${data.username[0]}` :
                           data.email ? `Email: ${data.email[0]}` :
                           data.password ? `Password: ${data.password[0]}` :
                           data.detail || 'Ошибка при регистрации.';
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, message: 'Произошла ошибка при подключении к серверу. Попробуйте снова.' };
  }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; message: string; token?: { access: string; refresh: string } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Assuming your backend returns access and refresh tokens on successful login
      return { success: true, message: 'Вход выполнен успешно!', token: { access: data.access, refresh: data.refresh } };
    } else {
      const errorMessage = data.detail || 'Неверные учетные данные.';
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: 'Произошла ошибка при подключении к серверу. Попробуйте снова.' };
  }
};

export const refreshToken = async (refresh: string): Promise<{ success: boolean; message: string; accessToken?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: 'Токен успешно обновлен!', accessToken: data.access };
    } else {
      const errorMessage = data.detail || 'Не удалось обновить токен.';
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false, message: 'Произошла ошибка при обновлении токена. Попробуйте снова.' };
  }
};

export const loginWithGoogleBackend = async (firebaseIdToken: string): Promise<{ success: boolean; message: string; token?: { access: string; refresh: string } }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google/`, { // <-- IMPORTANT: This is a NEW endpoint you'll create
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: firebaseIdToken }), // Send the Firebase ID token
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Assuming your Django backend returns access and refresh tokens on successful Google login
        return { success: true, message: 'Вход через Google выполнен успешно!', token: { access: data.access, refresh: data.refresh } };
      } else {
        const errorMessage = data.detail || 'Не удалось войти через Google.';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error during Google backend login:", error);
      return { success: false, message: 'Произошла ошибка при подключении к серверу для Google входа. Попробуйте снова.' };
    }
  };