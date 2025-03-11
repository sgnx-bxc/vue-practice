export default [
  // 账号管理-查询用户
  {
    name: 'postuserlist',
    url: 'postuserlist',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            name: 'name1',
            userName: 'userName1',
            roleName: 'roleName1',
            email: 'email1',
            phone: 'phone1',
            stateName: 1,
            status: 0,
            createTime: 'createTime1',
            modifyTime: 'modifyTim1e',
            safeQuestion: 'safeQuestion1',
            answer: 'answer1'
          },
          {
            name: 'name2',
            userName: 'userName2',
            roleName: 'roleName2',
            email: 'email2',
            phone: 'phone2',
            stateName: 1,
            status: 1,
            createTime: 'createTime2',
            modifyTime: 'modifyTime2',
            safeQuestion: 'safeQuestion1',
            answer: 'answer1'
          },
          {
            name: 'name3',
            userName: 'userName3',
            roleName: 'roleName3',
            email: 'email3',
            phone: 'phone3',
            stateName: 0,
            createTime: 'createTime3',
            modifyTime: 'modifyTime3',
            safeQuestion: 'safeQuestion1',
            answer: 'answer1'
          },
          {
            name: 'name4',
            userName: 'userName4',
            roleName: 'roleName4',
            email: 'email4',
            phone: 'phone4',
            stateName: 1,
            createTime: 'createTime4',
            modifyTime: 'modifyTime4',
            safeQuestion: 'safeQuestion1',
            answer: 'answer1'
          }
        ]
      }
    }
  },
  // 账号管理-查询角色
  {
    name: 'postrolelist',
    url: 'postrolelist',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            roleId: 1,
            roleName: 'roleName1',
            roleDesc: 'roleDesc1',
            createTime: 'createTime1',
            modifyTime: 'modifyTim1e1'
          },
          {
            roleId: 2,
            roleName: 'roleName2',
            roleDesc: 'roleDesc2',
            createTime: 'createTime2',
            modifyTime: 'modifyTim1e2'
          },
          {
            roleId: 3,
            roleName: 'roleName3',
            roleDesc: 'roleDesc3',
            createTime: 'createTime3',
            modifyTime: 'modifyTim1e3'
          },
          {
            roleId: 4,
            roleName: 'roleName4',
            roleDesc: 'roleDesc4',
            createTime: 'createTime4',
            modifyTime: 'modifyTim1e4'
          }
        ]
      }
    }
  },
  // 账号管理-获取安全问题
  {
    name: 'postquestionlist',
    url: 'postquestionlist',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [{ name: 'Who are you?', id: 1 }]
      }
    }
  }
]
