import * as bcrypt from 'bcrypt'
const saltRounds = 10

const hashPasswordGenerator = async (password: string) => {
    return await bcrypt.hash(password, saltRounds)
}

export { hashPasswordGenerator }