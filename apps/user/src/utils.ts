import * as bcrypt from 'bcrypt';

/**
 * 对密码进行hash处理
 * @param password
 * @returns
 */
export function genSaltAndHashPwd(password: string) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

/**
 * 密码检查
 * @param password
 * @param hash
 * @returns
 */
export function comparePwdByHash(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
