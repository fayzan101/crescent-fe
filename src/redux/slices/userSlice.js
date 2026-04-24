import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        token: null,
        refreshToken: null,
        isFetching: false,
        error: false,
        features: [],
        isSuperAdmin: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            const { user = null, token = null, refreshToken = null } = action.payload || {};
            state.isFetching = false;
            state.currentUser = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.error = false;
            // Store features in both places for backward compatibility
            state.features = user?.features || [];
            state.isSuperAdmin = user?.isSuperAdmin || false;
            
            // Store in localStorage as backup
            try {
                if (typeof window !== 'undefined') {
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                    } else {
                        localStorage.removeItem('user');
                    }

                    if (token) {
                        localStorage.setItem('accessToken', token);
                    } else {
                        localStorage.removeItem('accessToken');
                    }

                    if (refreshToken) {
                        localStorage.setItem('refreshToken', refreshToken);
                    } else {
                        localStorage.removeItem('refreshToken');
                    }

                    localStorage.setItem('features', JSON.stringify(user?.features || []));
                    localStorage.setItem('userFeatures', JSON.stringify(user?.features || []));
                }
            } catch (error) {
                console.error('Failed to store features in localStorage:', error);
            }
        },

        loginFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload || true;
            state.currentUser = null;
            state.token = null;
            state.refreshToken = null;
            state.features = [];
            state.isSuperAdmin = false;
            try {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('features');
                    localStorage.removeItem('userFeatures');
                }
            } catch (error) {
                console.error('Failed to clear auth data from localStorage:', error);
            }
        },

        signOut: (state) => {
            state.currentUser = null;
            state.token = null;
            state.refreshToken = null;
            state.isFetching = false;
            state.error = false;
            state.features = [];
            state.isSuperAdmin = false;
            try {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('features');
                    localStorage.removeItem('userFeatures');
                }
            } catch (error) {
                console.error('Failed to clear auth data from localStorage:', error);
            }
        },

        // Action to update token without full login
        setToken: (state, action) => {
            state.token = action.payload;
            try {
                if (typeof window !== 'undefined') {
                    if (action.payload) {
                        localStorage.setItem('accessToken', action.payload);
                    } else {
                        localStorage.removeItem('accessToken');
                    }
                }
            } catch (error) {
                console.error('Failed to store accessToken in localStorage:', error);
            }
        },

        // Action to clear token
        clearToken: (state) => {
            state.token = null;
            try {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                }
            } catch (error) {
                console.error('Failed to remove accessToken from localStorage:', error);
            }
        },
    },
});

export const {
    loginFailure,
    loginStart,
    loginSuccess,
    signOut,
    setToken,
    clearToken
} = userSlice.actions;

export default userSlice.reducer;