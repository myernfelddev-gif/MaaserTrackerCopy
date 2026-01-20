
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login as setLoginState } from '../store';
import { authService } from '../services/api';
import { Calendar, Mail, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const loginMutation = useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (data) => {
      /**
       * מבנה התגובה הצפוי מה-API:
       * {
       *   "token": "<JWT_TOKEN>",
       *   "user": {
       *     "id": "<USER_ID>",
       *     "username": "<USERNAME>",
       *     ...
       *   }
       * }
       */
      const { token, user } = data;

      if (token && user) {
        dispatch(setLoginState({
          token: token,
          userId: user.id,
          user: {
            id: user.id,
            username: user.username,
            name: user.username, // הצגת שם המשתמש במקום שבו מוצג ה-name במערכת
            email: user.email || '' // שמירה על עקביות עם טיפוס המשתמש
          }
        }));
        navigate('/');
      } else {
        console.error('API response missing token or user data');
      }
    },
    onError: (error: Error) => {
      console.error('Login failure:', error);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: () => {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsLogin(true);
      }, 3000);
    },
    onError: (error: Error) => {
      console.error('Registration failure:', error);
    }
  });

  const onSubmit = (data: any) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error = (loginMutation.error as Error)?.message || (registerMutation.error as Error)?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
            <Calendar size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">ניהול מעשרות</h1>
          <p className="text-slate-500">המערכת החכמה לניהול תרומות וצדקה</p>
        </div>

        <div className="px-10 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} />
              <span>ההרשמה בוצעה בהצלחה! מעביר אותך להתחברות...</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase px-1">שם פרטי</label>
                  <input 
                    {...register('firstName', { required: 'שדה חובה' })}
                    type="text" 
                    placeholder="ישראל"
                    className={`w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold ${errors.firstName ? 'border-red-300' : 'border-slate-100'}`}
                  />
                  {errors.firstName && <p className="text-[10px] text-red-500 font-bold px-1">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase px-1">שם משפחה</label>
                  <input 
                    {...register('lastName', { required: 'שדה חובה' })}
                    type="text" 
                    placeholder="ישראלי"
                    className={`w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold ${errors.lastName ? 'border-red-300' : 'border-slate-100'}`}
                  />
                  {errors.lastName && <p className="text-[10px] text-red-500 font-bold px-1">{errors.lastName.message as string}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase px-1">אימייל</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  {...register('email', { 
                    required: 'שדה חובה',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'כתובת אימייל לא תקינה'
                    }
                  })}
                  type="email" 
                  placeholder="name@example.com"
                  className={`w-full pr-12 pl-5 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold ${errors.email ? 'border-red-300' : 'border-slate-100'}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold px-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase px-1">סיסמה</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  {...register('password', { 
                    required: 'שדה חובה', 
                    minLength: { value: 2, message: 'לפחות 2 תווים' } 
                  })}
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full pr-12 pl-5 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold ${errors.password ? 'border-red-300' : 'border-slate-100'}`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold px-1">{errors.password.message as string}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100 hover:shadow-xl'}`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                isLogin ? 'התחברות למערכת' : 'הרשמה מהירה'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setShowSuccessMessage(false);
              }}
              disabled={isLoading}
              className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isLogin ? 'עדיין אין לך חשבון? הירשם עכשיו' : 'כבר רשום? התחבר כאן'}
              <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
