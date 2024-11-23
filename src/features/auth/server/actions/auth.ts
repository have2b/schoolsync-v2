import { PipelineResult } from '@/lib/interfaces/pipeline.interfaces'
import { logger } from '@/lib/logger'
import brcypt from 'bcryptjs'
import * as v from 'valibot'
import { LoginInput, LoginOutput, LoginSchema } from '../../schemas/auth'
import { findAccountByUsername } from '../db/auth'

export async function login(model: LoginInput): Promise<PipelineResult<LoginOutput | null>> {
  try {
    const validateResult = v.safeParse(LoginSchema, model, { abortEarly: true })
    if (validateResult.success) {
      const res = await findAccountByUsername({ username: validateResult.output.username })
      if (!res || res.isDeleted) {
        return {
          status: 400,
          message: 'Sai tài khoản hoặc mật khẩu',
          data: null,
        }
      }
      const isCorrectPassword = await brcypt.compare(validateResult.output.password, res.password)

      if (!isCorrectPassword) {
        return {
          status: 400,
          message: 'Sai tài khoản hoặc mật khẩu',
          data: null,
        }
      }

      return {
        status: 200,
        message: 'Đăng nhập thành công',
        data: {
          username: res.username,
        },
      }
    }
    if (validateResult.issues) {
      logger.error(v.flatten<typeof LoginSchema>(validateResult.issues))
    }
  } catch (error) {
    logger.error(error)
    return {
      status: 500,
      message: 'Có lỗi xảy ra trong quá trình đăng nhập',
      data: null,
    }
  }

  return {
    status: 500,
    message: 'Có lỗi xảy ra trong quá trình đăng nhập',
    data: null,
  }
}
