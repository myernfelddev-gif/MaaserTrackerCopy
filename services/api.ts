
const BASE_URL = 'https://www.instaback.ai/project/cb0cc019-c9b4-4383-890a-37b43ec8e5ca';

export const authService = {
  register: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.error || `Registration failed (${response.status})`);
      }
      return result;
    } catch (err: any) {
      console.error('Registration API Error:', err);
      throw err;
    }
  },

  login: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.error || `Login failed (${response.status})`);
      }
      return result;
    } catch (err: any) {
      console.error('Login API Error:', err);
      throw err;
    }
  }
};
