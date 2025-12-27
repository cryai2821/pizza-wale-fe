'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';
import { useUIStore } from '@/lib/store/ui';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'phone' | 'otp';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuthStore();

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
            await api.post('/auth/otp/send', { phone: formattedPhone });
            setPhone(formattedPhone);
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/otp/verify', { phone, otp });
            login(data.access_token, data.user);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep('phone');
        setPhone('');
        setOtp('');
        setError('');
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleBack = () => {
        setStep('phone');
        setOtp('');
        setError('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={step === 'phone' ? 'Login' : 'Verify OTP'}
        >
            <div className="space-y-4 px-6 py-2">
                {step === 'phone' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    value={phone.replace('+91', '')}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="9999999999"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    disabled={loading}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendOtp()}
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                We'll send you an OTP to verify your number
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleSendOtp}
                            disabled={loading || !phone}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl tracking-widest"
                                disabled={loading}
                                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOtp()}
                                autoFocus
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                OTP sent to {phone}
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Button
                                className="w-full"
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>

                            <button
                                onClick={handleBack}
                                className="w-full text-sm text-gray-600 hover:text-gray-900"
                                disabled={loading}
                            >
                                Change phone number
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
