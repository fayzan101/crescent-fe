"use client";


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRegister } from '@/hooks/auth/useRegister';

const SignUpForm = () => {
    const router = useRouter();
    const { mutateAsync: registerUser, isPending } = useRegister();
    const [formData, setFormData] = useState({
        email: '',
        cnic: '',
        dob: '',
        contactNo: '',
        address: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.cnic.trim()) {
            newErrors.cnic = 'CNIC is required';
        } else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
            newErrors.cnic = 'CNIC must be in 12345-1234567-1 format';
        }

        if (!formData.dob.trim()) {
            newErrors.dob = 'Date of birth is required';
        }

        if (!formData.contactNo.trim()) {
            newErrors.contactNo = 'Contact number is required';
        } else if (!/^\+?\d{10,15}$/.test(formData.contactNo)) {
            newErrors.contactNo = 'Contact number must be 10-15 digits';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            const isoDob = new Date(formData.dob).toISOString();

            await registerUser({
                email: formData.email,
                password: formData.password,
                dob: isoDob,
                cnic: formData.cnic,
                contactNo: formData.contactNo,
                address: formData.address,
            });

            toast.success('Sign up successful!');
            setFormData({
                email: '',
                cnic: '',
                dob: '',
                contactNo: '',
                address: '',
                password: '',
            });
            router.push('/dashboard');
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Sign up failed';
            setApiError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-2">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 pt-6 ">
                    <div className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-center px-6 py-5 shadow-md">
                        <h1 className="text-[17px] text-xl  text-white mb-1">
                            Sign Up
                        </h1>
                        <p className="text-[13px] text-sm text-white">
                            Please fill in your details to create an account
                        </p>
                    </div>
                </div>

                {/* ⚪ FORM */}
                <div className="p-8 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* API Error Display */}
                        {apiError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{apiError}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.email
                                    ? "border-black-500 bg-pink-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* CNIC */}
                        <div>
                            <input
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                placeholder="CNIC (12345-1234567-1)"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.cnic
                                    ? "border-black-500 bg-pink-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.cnic && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.cnic}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.dob
                                    ? "border-black-500 bg-pink-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.dob && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.dob}
                                </p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <input
                                type="text"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                placeholder="Contact Number (e.g. +923001234567)"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.contactNo
                                    ? "border-black-500 bg-pink-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.contactNo && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.contactNo}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.address
                                    ? "border-black-500 bg-pink-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                disabled={isLoading || isPending}
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors.password
                                    ? "border-black-500 bg-black-50"
                                    : "border-black-200 hover:border-black-300"
                                    } ${(isLoading || isPending) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-black-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>



                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isPending}
                            className={`text-[14px] w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 transition shadow-md ${(isLoading || isPending) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {(isLoading || isPending) ? 'SIGNING UP...' : 'SIGN UP'}
                        </button>

                        {/* Sign In link */}
                        <div className="text-center pt-4 border-t border-black-100 ">
                            <p className="text-sm text-black-700 text-[15px]">
                                Already have an account?{" "}
                                <span
                                    className=" text-[15px] font-semibold text-pink-600 hover:text-black cursor-pointer"
                                    onClick={() => router.push('/login')}
                                    tabIndex={0}
                                    role="button"
                                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/login'); }}
                                >
                                    Sign In
                                </span>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );


};

export default SignUpForm;