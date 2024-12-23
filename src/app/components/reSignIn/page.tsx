'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { logInurl } from "@/app/Urls";

export default function Page() {
  const router = useRouter()

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const data = {
    username: username,
    password: password
  };

  /*  useEffect(()=>{
     if(localStorage.getItem('token')){
       router.push('/pages/createUserPage')
     }
   }) */

  function handleLogin() {

    fetch(logInurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        if (responseData.code === 200) {

          localStorage.setItem('token', responseData.data.token);


          setPassword('')
          setUserName('')
          router.push('/pages/createUserPage')
          window.location.reload();


        } else {
          alert('账号或密码错误')
          console.error('Login failed:', responseData.msg);
        }
      })
      .catch(error => {
        console.error('There was a problem logging in:', error);
      });

  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >

      <div className="w-[400px] h-[350px] bg-white opacity-90 backdrop-blur-xl backdrop-filter  relative z-10 flex flex-col items-center justify-center">
        <p className="text-black text-2xl mb-5">问卷后台管理系统</p>
        <input
          type="text"
          value={username}
          placeholder="用户名"
          className="w-3/4 p-2 rounded-md mb-4 text-black"
          onChange={e => setUserName(e.target.value)}
        />
        <Input.Password
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-3/4 p-2 rounded-md mb-4 text-black  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="密码"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => { handleLogin() }}>
            登录
          </button>

        </div>
      </div>


    </div>
  );
}
