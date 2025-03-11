# edr-web

# 一、全局配置文件
全局配置文件为public/config/sysConfig.js，在public/index.html中引入并挂在window对象下。
好处：public目录不会经过webpack打包编译，项目部署后，可直接修改dist/config/sysConfig.js文件中参数，即可生效，无需再获取新的项目包。

# 二、公共js
自定义工具类、第三方放在utils目录
自定义指令utils/directive，自定义混入utils/mixins
部分与组件联合使用的js可直接放在组件目录下

-- 全局自定义指令
v-copyText：复制文本
v-dialogDrag: 弹窗拖拽
v-hasPermission：按钮权限
v-inputFilter:int：限制文本框
-- 全局工具类
mixins:
    leavePage.js：离开页面提示
    newHashMixin.js：版本更新提示
websocket:
    heartbeat.js：心跳封装
    websocket.js：websocket二次封装   
convertCount.js：数据单位转换
dataFunction.js：数据结构转换
dict.js：字典枚举值，映射列表，工具类
flexible.js: 淘宝rem解决方案
ipv4Util.js：各种ipv4形式校验
jsencryptjs：rsa加密方法
pageTitle.js：浏览器标签文本
tooltip.js：echarts自动轮播
urlUtils.js：url方法
validateUtils.js：校验工具
vueBus.js：bus二次封装
webStorage.js：本地存储二次封装
-- 全局挂载项
$router：vue路由
$store：vue状态管理
$db：webStorage
$echarts：echarts
$bus：事件总线
$moment：日期时间处理类

# 三、公共样式
公共样式统一放在style目录
common.less元素公共样式
fonts.less自定义字体
variable.less全局自定义变量
skin目录为主体样式文件，即组件级公共样式

-- 已有default.less公共样式类，类名：default-组件名-style
default-message-style：询问框样式
default-dialog-style：弹出对话框样式
default-form-style：表单样式
default-table-title-style：表格标题和整体操作按钮样式
default-header-style：页面标题样式
default-page-tabs：页面级tabs样式
default-tabs：表格级tabs样式

# 四、静态资源
图片放置src/assets/img

# 五、接口
请求对应微服务前缀，放在src/api/urlPrefix.js中管理。
接口调用方法统一放在src/api/request目录，菜单页面的接口放在对应js，js内引入封装的请求处理方法
import { getdata } from '@/api/axios/request'
用export对外暴露自定义的接口调用方法，例如：
//  获取用户权限
export const welcome = () => {
  return getdata('GET', `${urlPrefix.system}welcome`)
}
在组件中使用：
import { welcome } from '@/api/request/common'
const res = await welcome()

导出方法exportReq

# 六、公共组件
路由页面内自己的组件之间放置在views/对应页面组件目录/components。
公共组件必须具有一定通用性，目录为components

-- 已有组件
table：表格组件
chart：echarts图表组件

# 七、单点登录/认证跳转
sass化的服务的登录认证统一在公共服务平台进行，登录后从公共服务平台用户侧跳转子服务，需要携带登录后的token和进入服务的团队id，url为：
https://${子服务域名}/#/?accessToken=${token}
在子服务的@/router/router.js拦截器中，从sessionStorage和路由参数中取token，如果两者都没取到则跳转认证平台window.sysConfig.oauthLoginUrl；
如果sessionStorage没取到token而路由参数中取到了，则将token存储在sessionStorage，之后的http请求头里都会带上Authorization=token然后通过welcome接口获取用户的基本信息、角色信息、菜单权限id数组、按钮操作权限数组，存储在sessionStorage和vuex。

http://10.45.111.33:8080/#/?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDM1ODM3OTMsImlzcyI6InNlY3Rvb2xzIiwibmFtZSI6InNlY0FkbWluIiwicm9sZSI6MSwidXNlcklkIjoxfQ.cxw8z-b_b98fYu9x3NNxVoWs-UrT-bFgMJU2OATnahY

local化的服务的登录直接使用用户名+密码组合登录认证即可。

# 八、mock
mock的开关在public/config/sysConfig.js的mockInterface中配置，支持两种mock数据的方法
-1、在axios拦截器中重写请求url，重定向去请求对应json文件，主要解决demo版本下，使用mockjs插件导致导出文件失败的问题。
-2、第三方mockjs，定义的模拟数据放在@/mock/modules，会被@/mock/index.js动态加载

# 九、路由/菜单/面包屑
路由对应目录router
其中router/router.js实例化路由对象及路由守卫的封装，router/constantRoutes.js为无需登录的路由配置，router/asyncRoutes.js为项目菜单动态路由配置，router/pageRoutes.js为脱离布局容器的页面组件动态路由配置。
项目菜单仅支持到二级菜单项，菜单路由meta参数为：
 * id：菜单项首页id，有id的属于菜单项，没有id的是菜单项页面的子页面，需要配置activeId
 * activeId：对应高亮状态的菜单id
 * name：菜单项或路由页面名称
 * iconClass：一级菜单项图标
 * allDeadChildren：为true时说明，其子路由都不属于菜单项
 * titleName：拓展的标签名
一开始不加载需要鉴权的动态路由配置项，在路由守卫中判断是否登录，未登录则跳转登录页面，已登录则根据用户权限菜单Id列表和动态路由项得到展示的菜单路由列表，存入vuex，并重定向到菜单路由列表中第一个二级菜单页面。
布局容器的菜单组件sideBar.vue从vuex中获取菜单路由列表获取数据，加载显示的菜单，并能根据当前路由，切换当前激活状态的菜单项。
面包屑组件breadcrumbBlock.vue监听$route的变化，根据当前路由matched（包含当前路由的所有嵌套路径片段的路由记录的数组），进行展示。
