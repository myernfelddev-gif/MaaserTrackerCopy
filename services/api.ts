
const BASE_URL = 'https://www.instaback.ai/project/cb0cc019-c9b4-4383-890a-37b43ec8e5ca';

export const dashboardService = {
  getDashboardData: async (userId: string, startDate: string = "", endDate: string = "") => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BASE_URL}/api/edge-function/o_getuserdashboarddata`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: userId,
          startDate: startDate,
          endDate: endDate
        }),
      });
      
      const result = await response.json();
      console.log('Dashboard data response:', result);
      return result;
    } catch (err) {
      console.error('Dashboard API error:', err);
      throw err;
    }
  }
};

export const groupService = {
  fetchUserGroupsWithProjects: async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BASE_URL}/api/edge-function/o_fetch_user_groups_with_projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({params: { userId} }),
      });
      
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Fetch groups API error:', err);
      throw err;
    }
  },

  getGroupsSummary: async (userId: string, startDate: string = "", endDate: string = "") => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BASE_URL}/api/edge-function/o_get_user_group_financial_summary`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          params: {
            userId: userId,
            startDate: startDate,
            endDate: endDate
          }
        }),
      });
      
      const result = await response.json();
      
      return result;
    } catch (err) {
      console.error('Get groups summary API error:', err);
      throw err;
    }
  },

  createGroup: async (payload: { name: string; description: string; userId: string }) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/Group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw { status: response.status, data: errorData };
    }
    return response.json();
  },

  updateGroup: async (id: string, payload: { name: string; description: string }) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/Group?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || result.deleted === 0) {
      throw new Error(result.message || 'שגיאה בעדכון הקבוצה');
    }
    return result;
  },

  deleteGroup: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/Group?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const result = await response.json();
    if (!response.ok || result.deleted === 0) {
      throw new Error(result.message || 'שגיאה במחיקת הקבוצה');
    }
    return result;
  }
};

export const transactionService = {
  addFinancialTransaction: async (payload: any) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/FinancialTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw { status: response.status, data: errorData };
    }
    return response.json();
  },
  addDonation: async (payload: any) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/Donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw { status: response.status, data: errorData };
    }
    return response.json();
  }
};

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
        throw new Error(result?.message || result?.error || `ההרשמה נכשלה (${response.status})`);
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
        if (response.status === 401 || result?.message === 'Invalid email or password') {
          throw new Error('אימייל או סיסמה לא נכונים. יש לוודא שנרשמת קודם לכן.');
        }
        throw new Error(result?.message || result?.error || `ההתחברות נכשלה (${response.status})`);
      }
      return result;
    } catch (err: any) {
      console.error('Login API Error:', err);
      throw err;
    }
  }
};
