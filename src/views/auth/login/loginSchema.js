import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { required, isEmail } from '@utils/rules.util'

export const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .refine(required, {
        message: 'Required'
      })
      .refine(isEmail, {
        message: 'Invalid email format'
      }),
    password: z.string().refine(required, {
      message: 'Required'
    })
  })
)
