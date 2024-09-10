import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordGenerator } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
@Injectable()

export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}


  isExistEmail = async (email: string) => {
    const user = await this.userModel.exists({email});
    if(user){
      return true
    } else {
      return false
    }
  }
  async create(createUserDto: CreateUserDto) {
    //hash password
    const { name, email, password, phone, address, image } = createUserDto
    const isExist = await this.isExistEmail(email)
    if(isExist){
      throw new BadRequestException("Email already exist")
    }
    const hashPassword = await hashPasswordGenerator(password)
    const user = await this.userModel.create({ name, email, password: hashPassword, phone, address, image });
    return {
      _id : user._id
    }

  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize
    if(!current) current = 1
    if(!pageSize) pageSize=10
    const totalItems= (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems/pageSize)
    let skip = (current - 1) * pageSize
    const results = await this.userModel.find(filter).skip(skip).select("-password").limit(pageSize).sort(sort as any);
    return {results, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string){
    return await this.userModel.findOne({email})
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto});
  }

  async remove(_id: string) {
    if(!mongoose.isValidObjectId(_id)){
      throw new BadRequestException("Invalid id")
    } else {
      return await this.userModel.deleteOne({_id})
    }
  }
}
