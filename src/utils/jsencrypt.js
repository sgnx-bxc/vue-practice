import { JSEncrypt } from 'jsencrypt'
// 加密
export function encryptedData(publicKey, data) {
  // 新建JSEncrypt对象
  const encryptor = new JSEncrypt()
  // 设置公钥
  encryptor.setPublicKey(publicKey)
  // 加密数据
  return encryptor.encrypt(data)
}
// 解密
export function decryptData(privateKey, data) {
  // 新建JSEncrypt对象
  const decrypt = new JSEncrypt()
  // 设置私钥
  decrypt.setPrivateKey(privateKey)
  // 解密数据
  return decrypt.decrypt(data)
}
