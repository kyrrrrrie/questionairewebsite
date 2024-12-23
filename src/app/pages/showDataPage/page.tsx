'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Input, Switch, Table, InputNumber } from 'antd';
import type { TableColumnsType } from 'antd';
import { Select, Modal, Form, Col, Row, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { dropOutUrl, customerInfoUrl, customerInfoByAppidUrl, customerInfoByKeywordUrl, showDataUseTextUrl, showDataUseNumberUrl, deleteDataByAppidUrl } from '@/app/Urls';
import store from '@/app/store/store';
import { changeSearchResultAction } from '@/app/store/actions';
import * as XLSX from 'xlsx';

import Link from 'next/link'



import { headers } from '@/app/Model';
const { Option } = Select;




export default function page() {

  const [form] = Form.useForm();
  const ref = useRef<HTMLInputElement>(null);


  const [userInfo, setUserInfo] = useState([])

  const [searchTerm, setSearchTerm] = useState(store.getState().changeSearchResult);

  const DataArray: string[] = []




  /* 在组件渲染时渲染默认的数据 */
  useEffect(() => {
    if (searchTerm) {

      handleSearch();
    } else {
      getCustomerInfo();
    }
  }, [searchTerm]);

  /* 根据用户appid删除对应问卷数据 */

  function handleDelele() {

    if (DataArray.length === 0) {
      alert('请选择要删除的数据')
    }
    else {
      fetch(deleteDataByAppidUrl, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ app_ids: DataArray })
      }).then(response => {

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(responseData => {

        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage');
          alert('token失效,已删除本地token');
          return;
        }
        alert('删除成功,请刷新查看');
      }).catch(error => {
        console.error('Error:', error);
      });

    }
  }



  /* 根据用户appid导出对应问卷数据 */

  function handleExportExcel() {

    if (DataArray.length === 0) {
      alert('请选择要导出的数据')
    }
    else {
      fetch(deleteDataByAppidUrl, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ app_ids: DataArray })
      }).then(response => {

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(responseData => {

        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage');
          alert('token失效,已删除本地token');
          return;
        }
        alert('删除成功,请刷新查看');
      }).catch(error => {
        console.error('Error:', error);
      });

    }
  }

  /* function getCustomerInfo() {
    if (!token) {
      console.error('No token found in localStorage');
      alert('登录失效，请刷新重试')
      return;
    }
    fetch(customerInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${token}`
      }
    }).then(response => {


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(responseData => {
        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage.');
          alert('token失效,已删除本地token，请刷新重试')
          return
        }
        console.log('getUserInfo:', responseData);

        setUserInfo(responseData.data)
      })
      .catch(error => {
        console.error('There was a problem logging out:', error);
      });
  } */



  function pushArray(appid: string) {
    if (DataArray.includes(appid)) {
      DataArray.splice(DataArray.indexOf(appid), 1)
    }
    else {
      DataArray.push(appid)

    }



  }



  /* 导出根据多个app_id获取编号问卷的数据--根据多个app_id获取文字问卷的数据 */
  // 批量导出
  function exportData(count: number) {
    const data: any = []
    if (count > userInfo.length) {
      count = userInfo.length
    }
    if (count < 0) {
      count = 1
    }
    userInfo.slice(0, count).map((item: any) => {
      data.push(item.app_id)
    })


    // getShowDataByText(data)
    getShowDataByNumber(data)

    /*											
     */






  }
  // 导出选择的数据
  function exportSelectData(data: any) {

    // getShowDataByText(data)
    getShowDataByNumber(data)
  }
  /* 文字的 */
  function getShowDataByText(searchItem: any) {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    if (searchItem.length === 0) {
      alert('请选择需要导出的数据')
      return
    }
    fetch(showDataUseTextUrl, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`,
        "Content-Type": "application/json"

      },
      body: JSON.stringify({ "app_ids": searchItem })
    }).then(response => {



      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(responseData => {
        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage.');
          alert('token失效,已删除本地token，请刷新重试')
          return
        }
        const dataArray = responseData.data.map((obj: Record<string, any>) => headers.map(header => obj[Object.keys(obj)[headers.indexOf(header)]]));
        const modifiedArray = dataArray.map((subArray: string[]) => {
          const part1 = subArray.slice(0, 10)
          const part2 = subArray.slice(21, 34)
          const part3 = subArray.slice(10, 21)
          const part4 = subArray.slice(34, 119)
          /* 填写时间 */
          const part5 = subArray.slice(119, 120)
          /* 填写方式 */
          const part6 = subArray.slice(120, 121)
          /* 亲属 */
          const part7 = subArray.slice(121)
          return [...part5, ...part6, ...part1, ...part2, ...part3, ...part4, ...part7]
        })



        const modifiedArray2 = modifiedArray.map((subArray: any[]) => {
          const modifiedSubArray = subArray.map((item: any) => {
            if (typeof item === 'object') {
              return JSON.stringify(item); // 如果是对象，则转换为字符串形式
            } else {
              return item; // 如果不是对象，则保持原样
            }
          });
          return modifiedSubArray;
        });



        const ws = XLSX.utils.aoa_to_sheet([headers, ...modifiedArray2]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'outputText.xlsx');

      })
      .catch(error => {
        console.error('There was a problem logging out:', error);
        alert('登录失效，请刷新重试')
      });
  }


  /* 编号的 */
  function getShowDataByNumber(searchItem: any) {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    fetch(showDataUseNumberUrl, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`,
        "Content-Type": "application/json"

      },
      body: JSON.stringify({ "app_ids": searchItem })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(responseData => {
        console.log(responseData.data[0]);
        /* 合并的数据 */
        const dataArray = responseData.data.map((obj: Record<string, any>) => headers.map(header => obj[Object.keys(obj)[headers.indexOf(header)]]));
        /* 数据顺序错了，重新调整顺序 */
        const modifiedArray = dataArray.map((subArray: string[]) => {
          const part1 = subArray.slice(0, 10)
          const part2 = subArray.slice(21, 34)
          const part3 = subArray.slice(10, 21)
          const part4 = subArray.slice(34, 119)
          /* 填写时间 */
          const part5 = subArray.slice(119, 120)
          /* 填写方式 */
          const part6 = subArray.slice(120, 121)
          /* 亲属 */
          const part7 = subArray.slice(121)


          return [...part5, ...part6, ...part1, ...part2, ...part3, ...part4, ...part7]
        })
        /* 导出 */
        const ws = XLSX.utils.aoa_to_sheet([headers, ...modifiedArray]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'outputNumber.xlsx');

      })
      .catch(error => {
        console.error('There was a problem logging out:', error);
      });
  }





  /* 获取所有填写问卷的用户的信息 */
  function getCustomerInfo() {
    if (!token) {
      console.error('No token found in localStorage');
      alert('登录失效，请刷新重试')
      return;
    }
    fetch(customerInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${token}`
      }
    }).then(response => {


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(responseData => {
        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage.');
          alert('token失效,已删除本地token，请刷新重试')
          return
        }
        
        

        setUserInfo(responseData.data)
      })
      .catch(error => {
        console.error('There was a problem logging out:', error);
      });
  }

  const router = useRouter()

  const handleDetail = (id: string) => {
    router.push(`/pages/userInfoDetailPage?id=${id}`)


  }

  /*   const token = localStorage.getItem('token') */
  var token = ""
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || "";
  }





  /* 当退出时，清除token */
  function handleLogout() {
    if (!token) {
      console.error('No token found in localStorage');
      alert('登录失效，请刷新重试')
      return;
    }

    fetch(dropOutUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `JWT ${token}`
      }
    })
      .then(response => {
        console.log(response);


        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        console.log(responseData);

        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage.');
          alert('token失效,已删除本地token，请刷新重试')
          return
        }
        // 清除本地存储中的 token
        localStorage.removeItem('token');
        alert('success')
        console.log('User logged out successfully:', responseData);

      })
      .catch(error => {
        console.error('There was a problem logging out:', error);
      });

  }








  const [fixedTop, setFixedTop] = useState(false);

  /* 定义表结构的interface */
  interface DataType {
    id_card: string;
    username: string;
    age: number;
    address: string;
    app_id: string;
    nation: string;
    phone: string;
    relative_phone: string;
    sex: number;
    fill_time1: string;
    score1: number,
    ssid: string
  }
  /* 表头 */
  const columns: TableColumnsType<DataType> = [
    {
      title: '',
      key: '9',
      dataIndex: 'id_card',
      width: 40,
      render: (text, record) => <Checkbox onClick={() => { pushArray(record.app_id) }}></Checkbox>
    },
    {
      title: 'SSID',
      key: 'ssid',
      dataIndex: 'ssid',
      width: 80,

    },
    {
      title: '姓名',
      width: 80,
      dataIndex: 'username',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '性别',
      width: 80,
      dataIndex: 'sex',
      key: 'age',
      fixed: 'left',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: '1',
      width: 60,
    },
    {
      title: '常住地址',
      dataIndex: 'address',
      key: '2',
      width: 150,
    },
    {
      title: '民族',
      dataIndex: 'nation',
      key: '3',
      width: 100,
    },
    {
      title: '身份证',
      dataIndex: 'id_card',
      key: '4',
      width: 150,
    },
    {
      title: '本人联系电话',
      dataIndex: 'phone',
      key: '5',
      width: 100,
    },
    {
      title: '亲属联系电话',
      dataIndex: 'relative_phone',
      key: '6',
      width: 100,
    },
    {
      title: '填写时间',
      dataIndex: 'fill_time1',
      key: '7',
      width: 100
    },
    {
      title: '得分',
      dataIndex: 'score1',
      key: '8',
      width: 100
    },

    /* {
      title: '',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'app_id',
      width: 100,
      render: (text, record) => <button className="bg-sky-500 text-white px-4 py-2 rounded-md " onClick={() => handleDetail(record.app_id)
      } >
        详情
      </button >,
    }, */

  ];

  /* 通过输入的keyword进行搜索 */
  function handleSearch() {
    let formValues = form.getFieldsValue(true)


    if (!token) {
      console.error('No token found in localStorage');
      alert('登录失效,请刷新重试')
      return;
    }

    fetch(customerInfoByKeywordUrl, {
      method: "POST",
      headers: {
        "Authorization": `JWT ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formValues)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        if (responseData.code === 401) {
          // 如果返回状态码为 401，则删除当前浏览器的 token
          localStorage.removeItem('token');
          console.error('Token expired or invalid. Removed from localStorage.');
          alert('token失效,请刷新重试')
          return
        }
        


        setUserInfo(responseData.data)
        store.dispatch(changeSearchResultAction(searchTerm))


      })
      .catch(error => {
        alert('登录失效，请刷新页面')
        console.error('There was a problem logging out:', error);
      });

  }

  function onFinish(values: any) {
    console.log(values);

  }



  return (
    <>
      {
        token ? <div className="relative overflow-hidden  text-sm ">
          <div className="relative bg-opacity-75 py-8 px-4 mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between items-center mb-4"> {/* 使用justify-between将元素推向两端 */}



              <div className="flex ">
                {/* <input
                  type="text"
                  className="px-4 py-2 border border-gray-300 mr-2 text-black"
                  placeholder="搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />


                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSearch}
                >
                  搜索
                </button> */}


                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                  onClick={() => {
                    Modal.confirm({
                      title: `请输入提取的数量,当前总数为${userInfo.length}`,
                      content: <input type="number" ref={ref} className="border border-gray-300 px-4 py-2" />,
                      onOk() {
                        exportData(ref.current ? parseInt(ref.current.value, 10) : 0);
                      },
                      onCancel() {
                        console.log('cancel');
                      },
                    });
                  }}
                >
                  批量导出EXCEL
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                  onClick={() => {
                    Modal.confirm({
                      title: `当前已选${DataArray.length}条数据，是否导出？`,

                      onOk() {
                        exportSelectData(DataArray);
                      },
                      onCancel() {
                        console.log('cancel');
                      },
                    });
                  }}
                >
                  导出所选EXCEL
                </button>

                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  onClick={() => {
                    Modal.confirm({
                      title: '是否确认删除？',
                      onOk() {
                        handleDelele()

                      },
                      onCancel() {
                        console.log('cancel');
                      },
                    });
                  }}
                >
                  删除选中数据
                </button>
              </div>
              <button
                className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 ml-2"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>

            <Form
              form={form}
              name='control_form'
              onFinish={onFinish}
              className='bg-white shadow-md rounded-lg p-6 mb-5'


            >
              <Row gutter={24} wrap align='middle'>
                <Col span={6} >
                  <Form.Item name='ssid' label="SSID">
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='username' label="姓名">
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='sex' label="性别">
                    <Select
                      showSearch
                      placeholder="请选择"
                      options={[
                        {
                          value: 1,
                          label: '男'
                        },
                        {
                          value: 2,
                          label: '女'
                        }
                      ]}

                    />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='age' label="年龄">
                    <InputNumber placeholder='请输入' />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={24} wrap>
                <Col span={6} >
                  <Form.Item name='nation' label="民族">
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='id_card' label="身份证" rules={[{ pattern: /^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2])\d{4}(19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dxX]$/, message: '请填写正确' }]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='phone' label="本人联系电话" rules={[{ pattern: /^[1-9]\d{10}$/, message: '请填写正确' }]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item name='relative_phone' label="亲属联系电话" rules={[{ pattern: /^[1-9]\d{10}$/, message: '请填写正确' }]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>


              </Row>
              <Row gutter={24} wrap>
                <Col span={6} >
                  <Form.Item name='score1' label="得分">
                    <Input placeholder='请输入' />
                  </Form.Item>
                </Col>
                <Col span={6} >

                  <Button onClick={handleSearch} type='primary' size='large'> 搜索 </Button>
                </Col>



              </Row>
            </Form>

            <Table
              columns={columns}
              dataSource={userInfo}
              scroll={{ x: 'max-content' }}
              sticky={{ offsetHeader: 64 }}
            />
          </div>
        </div> : <h1 className='text-3xl text-red-500'>登录失效，请刷新重试</h1>
      }

    </>
  );



}




