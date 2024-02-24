import axios, {AxiosError} from 'axios'
import {Account, Transaction} from "@/app/types"


// Create an axios instance
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}


export async function register(userData: { username: string, password: string }): Promise<{ error?: Error | AxiosError, access?: string, refresh?: string }> {
  try {
    const response = await apiClient.post('/register/', userData);
    const { access, refresh } = response.data;
    // Save tokens in local storage
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('username', userData.username);
    //ocument.cookie = `access=${access}; Secure; HttpOnly; SameSite=Strict;`;
    //document.cookie = `refresh=${refresh}; Secure; HttpOnly; SameSite=Strict;`;
    return { access, refresh}
  } catch (error: any) {
    console.warn('Error during registration:', error);
    return {error}
  }
}


export async function login(userData: { username: string, password: string }): Promise<{ error?: Error | AxiosError, access?: string, refresh?: string }> {
  try {
    const response = await apiClient.post('/login/', userData);
    const { access, refresh } = response.data;

    // Save tokens in local storage
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('username', userData.username);
    //document.cookie = `access=${access}; Secure; HttpOnly; SameSite=Strict;`;
    //document.cookie = `refresh=${refresh}; Secure; HttpOnly; SameSite=Strict;`;
    return { access, refresh}
  } catch (error: any) {
    console.warn('Error during login:', error);
    return {error}
  }
}

export async function getAccounts(): Promise<{ accounts?: Account[], error?: Error | AxiosError }> {
  try {
    const response = await apiClient.get('/accounts/');
    return response.data;
  } catch (error: any) {
    console.warn('Error getting accounts:', error);
    return {error}
  }
}


export async function addAccount() {
  try {
    const response = await apiClient.post('/accounts/');
    return response.data;
  } catch (error) {
    console.error('Error adding account:', error);
  }
}


export async function getTransactions(accountId?: string, date?: string): Promise<{ transactions?: Transaction[], balance?: number | null, error?: Error | AxiosError }> {
  try {
    const config = date?.length ? { params: { date } } : {};
    if (accountId?.length) {
      const response = await apiClient.get(`/transactions/${accountId}/`, config);
      return response.data;
    } else {
      const response = await apiClient.get('/transactions/', config);
      return response.data;
    }
  } catch (error:any) {
    console.error('Error getting transactions:', error);
    return {error}
  }
}


export async function addTransaction(accountId: string, transaction: { amount: string, transaction_type: string, note: string, date: string}): Promise<{ transaction?: Transaction, balance?: number | null, error?: Error | AxiosError }> {
  try {
    const response = await apiClient.post(`/transactions/${accountId}/`, transaction);
    return response.data;
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    return {error}
  }
}


// Add a request interceptor to include the access token in requests
apiClient.interceptors.request.use((config) => {
  if (config?.url?.startsWith('/login/') || config?.url?.startsWith('/register/')) {
    return config;
  }

  const token = localStorage.getItem('access'); // getCookie("access") //
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
