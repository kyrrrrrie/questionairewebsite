'use client'
import React, { useEffect, useState } from 'react';
import { createAdminUrl } from '@/app/Urls';

export default function Page() {

  const [newAccount, setNewAccount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword]=useState('')

  /*   const token = localStorage.getItem('token') */
  var token = ""
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || "";
  }


  const data = {
    username: newAccount,
    password: newPassword
  };



  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newAccount && newPassword && confirmPassword && (newPassword === confirmPassword) && (newPassword.length >= 8) && (newAccount.length >= 6)) {

      try {
        const response = await fetch(createAdminUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
          
          if(result.code === 401){
            localStorage.removeItem('token');
            console.error('Token expired or invalid. Removed from localStorage.');
            alert('token失效,已删除本地token,请刷新重试')
            return
          }
          if(result.code === 202){
            alert('账号已存在，请重新输入')
            return
          }

          console.log('create:',result);
          setNewAccount('')
          setNewPassword('')
          setConfirmPassword('')
          alert('success')

        } else {
          console.log('添加管理员失败');

        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert('请正确填写:账号长度大于等于6位，密码长度大于等于8位，密码和确认密码必须相同')
    }

  }

  return (
    <>
      {
        token ? <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black" style={{ backgroundImage: "url('/7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>

          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4">添加账户</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">账号</label>
                <input type="text" id="username" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
                <input type="text" id="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">确认密码</label>
                <input type="text" id="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">添加</button>
              </div>
            </form>
          </div>


        </div> : <h1 className='text-3xl text-red-500'>登录失效，请刷新重试</h1>
      }


    </>

  );

}
