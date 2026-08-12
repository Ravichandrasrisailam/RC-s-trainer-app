import React, { useState } from 'react';
import { UserProfile } from '../types/fitness';
import { Phone, ShieldCheck, ArrowRight, Lock, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'google'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Ravichandra');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        isLoggedIn: true,
        name: userName || 'Ravichandra',
        phone: `${countryCode} ${phoneNumber}`,
        email: `${(userName || 'ravichandra').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        authProvider: 'phone',
        avatarUrl: '/rc_trainer_hero.jpg',
      });
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        isLoggedIn: true,
        name: userName || 'Ravichandra',
        email: 'srisailam.ravichandra3828@gmail.com',
        phone: '+1 9876543210',
        authProvider: 'google',
        avatarUrl: '/rc_trainer_hero.jpg',
      });
    }, 800);
  };

  return (
    <div className="relative w-full min-h-screen sm:min-h-[730px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden bg-[#060608] text-zinc-200 select-none">
      {/* Background Attached Image with Thin, Subtle Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/rc_trainer_hero.jpg"
          alt="RC Trainer Athlete Background"
          className="w-full h-full object-cover object-center opacity-30 filter contrast-110 saturate-90 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/80 via-transparent to-[#060608]" />
      </div>

      {/* Top Brand Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/90 border border-red-500/30 text-white font-bitcount text-xs font-normal flex items-center justify-center">
            RC
          </div>
          <div>
            <h1 className="text-white font-bitcount text-sm tracking-wider font-normal">
              RC TRAINER
            </h1>
            <p className="text-red-400 text-[9px] font-mono tracking-widest uppercase font-light">
              AI Fitness & Macro Intelligence
            </p>
          </div>
        </div>

        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900/80 border border-zinc-800 px-2.5 py-0.5 rounded-full backdrop-blur-md">
          v2.5
        </span>
      </div>

      {/* Hero Welcome Text - Thin & Crisp Typography */}
      <div className="relative z-10 my-auto py-6 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono tracking-wider backdrop-blur-sm font-light">
          <Sparkles className="w-3 h-3" />
          <span>Adaptive AI Biometrics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bitcount font-normal tracking-wide text-white leading-tight">
          Unlock Your Peak <br />
          <span className="text-red-400 font-light">
            Physical Potential
          </span>
        </h2>
        <p className="text-zinc-400 text-xs max-w-xs font-light leading-relaxed">
          Access your personal AI workout generator, thin macro analytics, live calorie counter, and customized meal plans.
        </p>
      </div>

      {/* Login Container Box */}
      <div className="relative z-10 bg-[#121216]/90 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-2xl space-y-3.5">
        {/* User Name Customizer Input */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest block font-light">
            Athlete Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-light"
          />
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-1.5 text-xs font-light rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-red-600/90 text-white font-bitcount'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('google')}
            className={`flex-1 py-1.5 text-xs font-light rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMethod === 'google'
                ? 'bg-red-600/90 text-white font-bitcount'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Login</span>
          </button>
        </div>

        {/* Tab 1: Phone OTP Form */}
        {authMethod === 'phone' && (
          <div className="space-y-3 animate-fadeIn">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest block font-light">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono font-light"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>

                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="987 654 3210"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono font-light"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600/90 hover:bg-red-500 text-white text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bitcount font-normal active:scale-98"
                >
                  <span>Send OTP Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-light">OTP sent to {countryCode} {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-red-400 font-mono text-[11px] hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest block font-light">
                    6-Digit Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center text-base font-mono tracking-widest text-white focus:outline-none focus:border-red-500 font-light"
                  />
                  <p className="text-[10px] text-zinc-500 text-center font-mono pt-0.5">
                    Demo OTP is <span className="text-red-400">123456</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-red-600/90 hover:bg-red-500 text-white text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bitcount font-normal disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify OTP & Access App</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Google OAuth Login Button */}
        {authMethod === 'google' && (
          <div className="space-y-3 animate-fadeIn pt-1">
            <p className="text-zinc-400 text-xs text-center font-light">
              Sign in securely using your Google account:
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isVerifying}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs py-2.5 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 border border-zinc-700/80 font-light"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isVerifying ? 'Signing in...' : 'Continue with Google Account'}</span>
            </button>

            <div className="flex items-center gap-1.5 justify-center text-[10px] text-zinc-500 font-mono font-light pt-1">
              <Lock className="w-3 h-3 text-red-500" />
              <span>OAuth 2.0 Encrypted Sign-In</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
