import * as v from 'valibot'

v.setGlobalConfig({ lang: 'vi' })

export const LoginSchema = v.object({
  uesrname: v.pipe(v.string(), v.trim(), v.nonEmpty('Tên người dùng không được để trống')),
  password: v.pipe(v.string(), v.trim(), v.nonEmpty('Mật khẩu không được để trống')),
})

export type LoginInput = v.InferInput<typeof LoginSchema>
