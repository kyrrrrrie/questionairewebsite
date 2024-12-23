import { api } from "../api"


/* 用户退出的接口 */
export  const dropOutUrl = `${api}/admin_user/auth`

/* 获取所有填写问卷的用户信息的接口 */
export const customerInfoUrl=`${api}/user/survey_user`

/*  根据用户的appid查询到指定问卷详细数据接口 */
export const customerInfoByAppidUrl=`${api}/survey_user/survey_1/search`

/* 根据指定用户字段查询数据接口 */
export const customerInfoByKeywordUrl=`${api}/survey_1/search`

/* 按照文字展示数据接口 */
export const showDataUseTextUrl=`${api}/survey_1/admin_export_text`

/* 按照编码展示数据接口 */
export const showDataUseNumberUrl=`${api}/survey_1/admin_export`

/* 修改管理员密码接口 */
export const changeAdminPasswordUrl=`${api}/admin_user/`

/* 根据appid删除对应问卷数据接口 */
export const deleteDataByAppidUrl=`${api}/user/survey_user`

/* 创建用户接口 */
export const createAdminUrl=`${api}/admin_user/`

/* 用户登录的接口 */
export const logInurl = `${api}/admin_user/auth`
