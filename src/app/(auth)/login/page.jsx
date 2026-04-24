"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/useLogin';
import toast from 'react-hot-toast';
import * as yup from 'yup';


// Yup validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Your email is invalid.')
        .required('Email is required'),
    password: yup
        .string()
        .min(4, 'Password must be at least 4 characters.')
        .required('Password is required')
});

const SignInForm = () => {
    const router = useRouter();
    const { mutateAsync: login, isPending } = useLogin();


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateField = async (name, value) => {
        try {
            await yup.reach(loginSchema, name).validate(value);
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
            return true;
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [name]: error.message
            }));
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear API error when user modifies input
        if (apiError) {
            setApiError('');
        }

        // Validate field on change
        if (name === 'email' || name === 'password') {
            validateField(name, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError('');

        // First validate the form with Yup
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const validationErrors = {};
            if (validationError.inner) {
                validationError.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            await login({
                email: formData.email,
                password: formData.password
            });
            toast.success('Login successful!');
            router.push('/dashboard');
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Login failed';
            setApiError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl pt-20 sm:pt-24 md:pt-28">
                <div className="absolute -top-5 sm:-top-6 left-1/2 w-[92%] sm:w-[90%] -translate-x-1/2">
                    <div className="rounded-lg sm:rounded-xl flex flex-col justify-center bg-gradient-to-r from-[#E93B77] via-[#E12A6D] to-[#DA1F63] text-center px-4 py-3 sm:px-6 sm:py-4 shadow-md h-20 sm:h-24 md:h-28">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                            Sign In
                        </h1>
                        <p className="text-xs sm:text-sm text-white/90">
                            Please enter your authorized credentials
                        </p>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                        {/* API Error Display */}
                        {apiError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{apiError}</p>
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={(e) => validateField(e.target.name, e.target.value)}
                                disabled={isLoading || isPending}
                                placeholder="Enter your email"
                                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E93B77]/30 transition ${errors.email
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={(e) => validateField(e.target.name, e.target.value)}
                                disabled={isLoading || isPending}
                                placeholder="Enter your password"
                                className={`w-full pr-10 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E93B77]/30 transition ${errors.password
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#E93B77] focus:outline-none"
                                onClick={() => setShowPassword((prev) => !prev)}
                                disabled={isLoading || isPending}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.password}
                                </p>
                            )}

                        <div className="flex items-center gap-2 sm:gap-3">
                            <label htmlFor="rememberMeToggle" className="relative inline-block w-10 h-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="rememberMeToggle"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading || isPending}
                                    className="sr-only"
                                />
                                <div className={`relative block w-10 h-5 rounded-full transition-all duration-200 ${formData.rememberMe 
                                    ? 'bg-gradient-to-r from-[#E93B77] to-[#DA1F63]' 
                                    : 'bg-gray-300'
                                } ${(isLoading || isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${formData.rememberMe 
                                        ? 'translate-x-5 left-0.5' 
                                        : 'translate-x-0 left-0.5'
                                    }`}></div>
                                </div>
                            </label>
                            <label
                                htmlFor="rememberMeToggle"
                                className={`text-xs sm:text-sm text-gray-700 cursor-pointer select-none ${(isLoading || isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isPending}
                            className="w-full bg-gradient-to-r from-[#E93B77] to-[#DA1F63] text-white text-xs sm:text-sm font-medium py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-[#DA1F63] hover:to-[#E93B77] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#DC22655C] transition-all duration-300 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {(isLoading || isPending) && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {(isLoading || isPending) ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>

                        

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
