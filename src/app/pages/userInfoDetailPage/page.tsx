'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { nanoid } from 'nanoid'
import { api } from '@/app/api'

export default function Page() {
  const searchParams = useSearchParams()
  /* const token = localStorage.getItem('token') */
  var token = ""
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || "";
  }
  const [userDetail, setUserDetail] = useState<any>(null) // 设置初始值为 null

  const uniqueID = nanoid()

  useEffect(() => {
    const id = searchParams.get('id')

    if (typeof id === 'string') {
      getCustomerInfoByAppid(id)
    }
  }, [])

  /* 通过指定appid获取问卷详细数据 */
  function getCustomerInfoByAppid(value: string) {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    if (value === 'null') {
      console.error('请选择正确的appid');
      return;
    }

    fetch(`${api}/survey_1/search?app_id=${value}`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(responseData => {

      if (responseData.code === 401) {

        // 如果返回状态码为 401，则删除当前浏览器的 token
        localStorage.removeItem('token');
        console.error('Token expired or invalid. Removed from localStorage.');
        alert('token失效,已删除本地token,请刷新重试')
        return
      }
      setUserDetail(responseData.data)


    }).catch(error => {
      console.error('There was a problem:', error);
    });
  }

  return (
    <div className='text-black max-w-4xl mx-auto p-4 '>
      {userDetail ? ( // 检查是否有 userDetail 数据
        <div>
          <p className="text-2xl font-bold">A. 一般情况</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">身体信息</h2>
              <p><span className="font-bold">身高:</span> {userDetail.A1} 厘米(公分)</p>
              <p><span className="font-bold">体重:</span> {userDetail.A2} 公斤</p>
              <p><span className="font-bold">腰围:</span> {userDetail.A3}</p>
            </div>
            <div className="w-full p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">个人情况</h2>
              <p><span className="font-bold">文化程度:</span> {userDetail.A4}</p>
              <p><span className="font-bold">婚姻状况:</span> {userDetail.A5}</p>
              <p><span className="font-bold">职业情况:</span> {userDetail.A6}</p>
              <p><span className="font-bold">家庭月收入:</span> {userDetail.A7}</p>
              <p><span className="font-bold">是否有有害物质职业接触:</span> {userDetail.A8}</p>
              {userDetail.A8 === '是' && <p className='pl-4'>{userDetail.A8_1}</p>}
            </div>
          </div>

          <p className="text-2xl mt-8 font-bold">B. 饮食情况</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃主食频率</p>
              <p className="text-lg">答案: {userDetail.B1}; 每次摄入:{userDetail.B1a}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃新鲜蔬菜、水果频率</p>
              <p className="text-lg">答案: {userDetail.B2};每次摄入: {userDetail.B2a}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃猪羊肉等畜肉频率</p>
              <p className="text-lg">答案: {userDetail.B3}; 每次摄入: {userDetail.B3a}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃鸡鸭鹅等禽肉频率</p>
              <p className="text-lg">答案: {userDetail.B4}; 每次摄入: {userDetail.B4a}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃鱼虾、扇贝等水产品频率</p>
              <p className="text-lg">答案: {userDetail.B5}; 每次摄入: {userDetail.B5a}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃蛋类和奶类频率</p>
              <p className="text-lg">答案: {userDetail.B6};</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃豆类及豆制品频率</p>
              <p className="text-lg">答案: {userDetail.B7}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃加工肉类及蔬菜（腊肉腊肠、酸菜咸菜等）</p>
              <p className="text-lg">答案:{userDetail.B8}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">是否喜烫食、热食</p>
              <p className="text-lg">答案: {userDetail.B9}; {userDetail.B9 === '是' && <span>频率是 {userDetail.B9a}</span>}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">是否喜辛辣食物</p>
              <p className="text-lg">答案: {userDetail.B10}; {userDetail.B10 === '是' && <span>频率是 {userDetail.B10a}</span>}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">是否喜欢喝茶</p>
              <p className="text-lg">答案: {userDetail.B11}; {userDetail.B11 === '是' && <span> 频率是 {userDetail.B11a}</span>}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">是否吃夜宵、频率</p>
              <p className="text-lg">答案: {userDetail.B12}; {userDetail.B12 === '是' && <span> 频率是 {userDetail.B12a}</span>}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃大蒜</p>
              <p className="text-lg">答案: {userDetail.B13}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">吃的油类</p>
              <p className="text-lg">答案: {userDetail.B14}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">口味偏好</p>
              <p className="text-lg">答案: {userDetail.B15}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">饮食是否规律</p>
              <p className="text-lg">答案: {userDetail.B16}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-xl font-bold">您最近一周在外就餐的次数为</p>
              <p className="text-lg">答案: {userDetail.B17}</p>
            </div>

          </div>



          <p className='text-2xl mt-8 font-bold'>C.生活环境、方式和习惯</p>



          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4  ">
            <div className="w-full p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">C1.嚼槟榔情况</h2>
              <p><span className="font-bold">您是否嚼槟榔:</span> {userDetail.C1_1}</p>
              {
                userDetail.C1_1[0] === '否' ? '' :
                  <div>
                    <p><span className="font-bold">开始嚼槟榔年龄为:</span> {userDetail.C1_2}岁</p>
                    <p><span className="font-bold">平均每天嚼槟榔数量:</span> {userDetail.C1_3}颗</p>
                    <p><span className="font-bold">平均每次嚼槟榔持续:</span> {userDetail.C1_4}分钟</p>
                    <p><span className="font-bold">嚼槟榔多久:</span> {userDetail.C1_5}</p>
                    <p><span className="font-bold">戒槟榔持续多久:</span> {userDetail.C1_6}</p>




                  </div>
              }

            </div>




            <div className="w-full p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">C2. 厨房油烟暴露情况</h2>
              <p><span className="font-bold">在过去的几十年里，您自己经常做饭吗:</span> {userDetail.C2_1}</p>

              {
                userDetail.C2_1[0] === '否' ? '' :
                  <div>
                    <p><span className="font-bold">做饭时厨房内的油烟情况:</span> {userDetail.C2_2}</p>
                    <p><span className="font-bold">您本人做饭做了多少年:</span> {userDetail.C2_3}年</p>
                    <p><span className="font-bold">在您做饭的日子里，您本人每周大约做几次饭？:</span> {userDetail.C2_4}</p>



                  </div>
              }

            </div>



            <div className="w-full p-4 bg-gray-100 rounded-lg h-fit  ">
              <h2 className="text-xl font-bold mb-2">C3.吸烟情况</h2>
              <p><span className="font-bold ">您是否吸烟:</span> {userDetail.C3_1}</p>


              {
                userDetail.C3_1[0] === '否' ? '' :
                  <div>
                    <p><span className="font-bold">开始吸烟年龄:</span> {userDetail.C3_2}岁</p>
                    <p><span className="font-bold">如果您仍在吸烟或曾吸烟，平均每天吸烟多少支（1两烟叶≈50支卷烟）:</span> {userDetail.C3_3}</p>
                    <p><span className="font-bold">如果您仍在吸烟，吸烟多久了:</span> {userDetail.C3_4}</p>
                    {
                      userDetail.C3_1[0] === '是' ? '' :
                        <p><span className="font-bold">如果您目前已戒烟，这次戒烟已持续多久:</span> {userDetail.C3_5}</p>
                    }
                    <p><span className="font-bold">您是否与长期吸烟的家人共同生活？:</span> {userDetail.C3_6}</p>
                    {
                      userDetail.C3_6[0] === '否' ? '' :
                        <p><span className="font-bold">与吸烟的家人共同生活多少年？:</span> {userDetail.C3_7}年</p>
                    }
                    <p><span className="font-bold">您是否与长期吸烟的同事同室工作？:</span> {userDetail.C3_8}</p>
                    {
                      userDetail.C3_8[0] === '否' ? '' :
                        <p><span className="font-bold">与吸烟的同事同室工作多少年？:</span> {userDetail.C3_9}年</p>
                    }
                  </div>
              }
            </div>



            <div className="w-full p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">C4.饮酒情况</h2>
              <p><span className="font-bold ">C4.1.您是否饮酒:</span> {userDetail.C4_1}</p>
              {
                userDetail.C4_1[0] === '否' ? '' :
                  <div>
                    <p><span className="font-bold text-xl">是否喝高度白酒:</span> <span className='text-xl'>{userDetail.C4_2a1}</span></p>

                    <p className=' w-full  p-1 text-xl'>
                      {
                        userDetail.C4_2a1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2a2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2a3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2a4}年
                          </span>
                      }
                    </p>
                    <p><span className="font-bold text-xl">是否喝低度白酒:</span> <span className='text-xl'>{userDetail.C4_2b1}</span></p>


                    <p className=' text-xl'>
                      {
                        userDetail.C4_2b1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2b2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2b3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2b4}年
                          </span>
                      }
                    </p>
                    <p><span className="font-bold text-xl">是否喝啤酒:</span> <span className='text-xl'>{userDetail.C4_2c1}</span></p>


                    <p className=' text-xl'>
                      {
                        userDetail.C4_2c1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2c2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2c3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2c4}年
                          </span>
                      }
                    </p>
                    <p><span className="font-bold text-xl">是否喝黄酒:</span> <span className='text-xl'>{userDetail.C4_2d1}</span></p>


                    <p className=' text-xl'>
                      {
                        userDetail.C4_2d1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2d2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2d3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2d4}年
                          </span>
                      }
                    </p>
                    <p><span className="font-bold text-xl">是否喝葡萄酒:</span> <span className='text-xl'>{userDetail.C4_2e1}</span></p>


                    <p className=' text-xl'>
                      {
                        userDetail.C4_2e1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2e2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2e3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2e4}年
                          </span>
                      }
                    </p>
                    <p><span className="font-bold text-xl">是否喝米酒:</span> <span className='text-xl'>{userDetail.C4_2f1}</span></p>


                    <p className=' text-xl'>
                      {
                        userDetail.C4_2f1[0] === '否' ? '' :
                          <span>
                            <span className=' text-xl'></span>饮用频率：每{userDetail.C4_2f2}---
                            <span className=' text-xl'></span>每次饮酒量：{userDetail.C4_2f3}两/次---
                            <span className=' text-xl'></span>饮酒年限:{userDetail.C4_2f4}年
                          </span>
                      }
                    </p>


                  </div>
              }


            </div>








            <div className="w-full p-4 bg-gray-100 rounded-lg  md:-mt-[300px] sm:-mt-[100px] h-fit">
              <h2 className="text-xl font-bold mb-2">C5.口腔卫生情况</h2>
              <p><span className="font-bold">您是否每天刷牙？:</span> {userDetail.C5_1}</p>
              {
                userDetail.C5_1[0] === '否' ? '' :
                  <div>
                    <p><span className="font-bold">如果您每天刷牙，您每天的刷牙频率是:</span> {userDetail.C5_2}</p>
                    <p><span className="font-bold">您是否有牙齿缺失:</span> {userDetail.C5_3}</p>
                    <p><span className="font-bold">您是否有定期口腔检查（规律看牙医）:</span> {userDetail.C5_4}</p>

                  </div>
              }

            </div>







            <div className="w-full p-4 bg-gray-100 rounded-lg h-fit ">
              <h2 className="text-xl font-bold mb-2">C7.睡眠情况</h2>
              <p><span className="font-bold">您在最近一个月是否经常午睡:</span> {userDetail.C7_1}  {userDetail.C7_1 === '否' ? '' : <span>{userDetail.C7_1a}</span>}</p>
              {
                userDetail.C7_1 === '否' ? '' :
                  <div>
                    <p><span className="font-bold">您感觉您最近的午休睡眠质量怎么样？:</span> {userDetail.C7_2}</p>
                  </div>
              }

              <p><span className="font-bold">您最近通常:</span>晚上{userDetail.C7_3.slice(0, 2)}点{userDetail.C7_3.slice(3, 5)}分上床睡觉,需要{userDetail.C7_3.slice(6, 8)}分钟才能入睡，早上{userDetail.C7_3[9]}点{userDetail.C7_3.slice(-2)}分起床</p>
              <p><span className="font-bold">您感觉您最近的夜晚睡眠质量怎么样:</span> {userDetail.C7_4}</p>
              <p><span className="font-bold">您最近半年是否上过夜班:</span>{userDetail.C7_5}</p>
              <p><span className="font-bold">最近一个月睡眠情况:</span> </p>
              <p><span className="font-bold">夜间睡眠易醒或早醒:</span> {userDetail.C7a}</p>
              <p><span className="font-bold">夜间睡眠时咳嗽或打鼾:</span> {userDetail.C7b}</p>
              <p><span className="font-bold">夜间睡眠时做梦:</span> {userDetail.C7c}</p>
              <p><span className="font-bold">要服安眠药、镇定药才能入睡:</span> {userDetail.C7d}</p>
            </div>

            <div className="w-full p-4 bg-gray-100 rounded-lg h-fit md:-mt-[480px] sm:-mt-[300px] ">
              <h2 className="text-xl font-bold mb-2">C6.运动情况</h2>
              <p><span className="font-bold">您是否经常参加体育锻炼（“经常”是指平均每周3次以上，每次超过30分钟）:</span> {userDetail.C6_1}</p>
              <p><span className="font-bold">您每天花在走路活动上的时间大概有多久:</span> {userDetail.C6_2}小时</p>
              <p><span className="font-bold">您每天大概有多次时间是坐着的:</span> {userDetail.C6_3}</p>

            </div>


            <div className="w-full p-4 bg-gray-100 rounded-lg h-fit ">

            </div>
            <div className="w-full p-4 bg-gray-100 rounded-lg h-fit md:-mt-[300px] sm:-mt-[100px] ">
              <h2 className="text-xl font-bold mb-2">C8.心理状况</h2>
              <p><span className="font-bold">做事时提不起劲或没有兴趣:</span> {userDetail.C8_1}</p>
              <p><span className="font-bold">感到情绪低落、沮丧或绝望:</span> {userDetail.C8_2}</p>
              <p><span className="font-bold">感觉紧张、焦虑或急切:</span> {userDetail.C8_3}</p>
              <p><span className="font-bold">不能够停止或控制担忧:</span> {userDetail.C8_4}</p>
              <p><span className="font-bold">有“不如死掉”或用某种方式伤害自己的念头:</span> {userDetail.C8_5}</p>
            </div>


          </div>



          <p className='text-2xl mt-8 font-bold'>D.既往史</p>


          <div className="max-w-4xl mx-auto mt-8 border-2 rounded-lg ">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 border-r">D1:您是否曾被确诊患有任何癌症？</td>
                  <td className="py-2 px-4">{userDetail.D1}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">D2.口腔疾病史</td>
                  <td className="py-2 px-4"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">您是否患有口腔疾病？</td>
                  <td className="py-2 px-4">{userDetail.D2_1}</td>
                </tr>

                {
                  userDetail.D2_1[0] === '否' ? '' :
                    <><tr className="border-b">
                      <td className="py-2 px-4">口腔溃疡</td>
                      <td className="py-2 px-4">{userDetail.D2_2a}</td>
                    </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">口腔白斑或红斑</td>
                        <td className="py-2 px-4">{userDetail.D2_2b}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">口腔扁平苔藓</td>
                        <td className="py-2 px-4">{userDetail.D2_2c}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">牙周病（如牙龈炎、牙周炎等）</td>
                        <td className="py-2 px-4">{userDetail.D2_2d}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">黏膜下纤维性变</td>
                        <td className="py-2 px-4">{userDetail.D2_2e}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">残根、残冠</td>
                        <td className="py-2 px-4">{userDetail.D2_2f}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">不良修复体</td>
                        <td className="py-2 px-4">{userDetail.D2_2g}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">龋病</td>
                        <td className="py-2 px-4">{userDetail.D2_2h}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">口腔单纯疱疹</td>
                        <td className="py-2 px-4">{userDetail.D2_2i}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">口腔念珠菌感染</td>
                        <td className="py-2 px-4">{userDetail.D2_2j}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">其他,请注明</td>
                        <td className="py-2 px-4">{userDetail.D2_2k}</td>
                      </tr></>



                }


                <tr className="border-b">
                  <td className="py-2 px-4">D3.其他疾病史</td>
                  <td className="py-2 px-4"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">D3.1:您是否患有其他慢性疾病？</td>
                  <td className="py-2 px-4">{userDetail.D3_1}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">D3.2:若是，请选择具体疾病（多选）</td>
                  <td className="py-2 px-4">{userDetail.D3_2}</td>
                </tr>
              </tbody>
            </table>
          </div>


          <p className='text-2xl mt-8 font-bold'>E.恶性肿瘤家族史</p>
          <div className="mt-4">
            <div className="w-full  p-1">
              <p className="text-xl font-bold">E1:您家族（直系或旁系亲属）是否有人患肿瘤？</p>
              <p className="text-lg">答案:{userDetail.E1}</p>
            </div>
            {
              userDetail.E1 === '否' ? '' :
                <div>
                  <div>
                    <span className=' text-xl font-bold'>E2:</span>



                    <div className="max-w-4xl mx-auto mt-8 border-2 rounded-lg ">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <td className="py-2 px-4 border-r">亲属关系</td>
                            <td className="py-2 px-4 border-r">肿瘤名称</td>
                            <td className="py-2 px-4 border-r">患病年龄</td>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            userDetail.E2.map((item: any, index: number) => {
                              return (
                                <tr key={index} className='border-b'>
                                  <td className="py-2 px-4 border-r">{item.id}</td>
                                  <td className="py-2 px-4 border-r">{item.name}</td>
                                  <td className="py-2 px-4 border-r">{item.age}</td>
                                </tr>
                              )
                            })
                          }


                        </tbody>
                      </table>
                    </div>





                  </div>

                </div>
            }
          </div>
          <div className=' h-48'>

          </div>
        </div>
      ) : (
        <div>Loading... 请刷新重试</div> // 显示加载状态
      )}
    </div>
  )
}

