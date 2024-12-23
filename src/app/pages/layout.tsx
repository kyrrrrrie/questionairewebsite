'use client'
import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Page from "../components/reSignIn/page";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    /* const router=useRouter()
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    

    const tokenn=localStorage.getItem('token')
    setToken(tokenn) */

    /* const token=localStorage.getItem('token'); */

    /* useEffect(()=>{
        const tokenn = localStorage.getItem('token') ||;
        setToken(tokenn)
    }) */

    var token = ""
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || "";
    }
    const router = useRouter()




    return (
        /* <>
            {token ? (
                <div className="flex h-screen">
                    <nav className="bg-blue-300 text-white  w-24 p-4">
                        <div className="flex flex-col space-y-4">
                            <Link href="/pages/showDataPage" className="hover:text-gray-300">
                                数据展示
                            </Link>
                            <Link href="/pages/createUserPage" className="hover:text-gray-300">
                                添加账户
                            </Link>
                            <Link href="/pages/changeUserPasswordPage" className="hover:text-gray-300">
                                账户修改
                            </Link>
                        </div>
                    </nav>
                    <main className="flex-1 p-4" >{children}</main>
                </div>
            ) : (
                <div>
                    <Page/>
                </div>
            )}
        </> */
        <>
            {
                token ? (
                    <div className="flex  bg-slate-100">
                        <Sider trigger={null} collapsible collapsed={collapsed} width={150} className=" bg-sky-200" theme="light">
                            <div className="demo-logo-vertical" />
                            <Menu
                                className=" bg-sky-200"
                                theme="light"
                                mode="inline"

                                defaultSelectedKeys={['1']}
                                items={[
                                    {
                                        key: '1',
                                        icon: <UserOutlined />,

                                        label: '显示信息',
                                        onClick: () => { router.push('/pages/showDataPage') },
                                    },
                                    {
                                        key: '2',
                                        icon: <VideoCameraOutlined />,
                                        label: '添加账户',
                                        onClick: () => { router.push('/pages/createUserPage') },
                                    },
                                    {
                                        key: '3',
                                        icon: <UploadOutlined />,
                                        label: '修改密码',
                                        onClick: () => { router.push('/pages/changeUserPasswordPage') },
                                    },
                                ]}
                            />
                        </Sider>

                        <Header style={{ padding: 0, height: 0, marginTop: -10 }} >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 14,
                                }}
                            />
                        </Header>

                        <main className="flex-1 " >{children}</main>

                    </div>
                )

                    : (<div>
                        <Page />
                    </div>)

            }


        </>
    );
}
