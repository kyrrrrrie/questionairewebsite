'use client'
import React, { useEffect, useState } from 'react';
import { changeAdminPasswordUrl } from '@/app/Urls';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
export default function Page() {

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  /*  const [token,setToken]=useState() */

  /*  const token = localStorage.getItem('token') */
  var token = ""
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || "";
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // 阻止默认表单提交行为
    // 这里可以添加处理提交逻辑，比如将账号和密码保存到数据库或其他地方

    if ((newPassword && confirmPassword) && (newPassword === confirmPassword) && (newPassword.length >= 8)) {

      try {
        const response = await fetch(changeAdminPasswordUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`
          },
          body: JSON.stringify({ new_password: newPassword })
        });
        const result = await response.json();
        if (response.ok) {
          if (result.code === 401) {
            localStorage.removeItem('token');
            console.error('Token expired or invalid. Removed from localStorage.');
            alert('token失效,已删除本地token,请刷新重试')
            return
          }

          console.log('create:', result);
          setNewPassword('')
          setConfirmPassword('')
          alert('success')

        } else {
          console.log('修改密码失败,密码长度应大于等于8位');

        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert('请正确填写')
    }

  }

  /* try {
        const response = await fetch(changeAdminPasswordUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`
          },
          body: JSON.stringify({ new_password: newPassword })
        });
        const result = await response.json();
        if (response.ok) {
          if(result.code === 401){
            localStorage.removeItem('token');
            console.error('Token expired or invalid. Removed from localStorage.');
            alert('token失效,已删除本地token,请刷新重试')
            return
          }

          console.log('create:',result);
          setNewPassword('')
      setConfirmPassword('')
          alert('success')

        } else {
          console.log('修改密码失败');

        }
      } catch (error) {
        console.error('Error:', error);
      } */

  return (

    <>
      {
  token ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black" style={{ backgroundImage: "url('/5.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">密码修改</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-3/4 p-2 rounded-md mb-4 text-black focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="新的密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>
          <div className="mb-4">
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-3/4 p-2 rounded-md mb-4 text-black focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="确认密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">确定修改</button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <h1 className='text-3xl text-red-500'>登录失效，请刷新重试</h1>
  )
}


    </>


  );

}
