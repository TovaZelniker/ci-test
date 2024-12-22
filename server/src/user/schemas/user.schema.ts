import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '../../schemas/base.schema';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseSchema{

  @Prop({ required: true, trim: true })
    userID: string;//TODO

  @Prop({ required: true, trim: true })
    name: string;

  @Prop({ required: true, minlength:7, maxlength:11, match: [
    /^(?![-.])(?=.*\d)(\d+([-]\d+)?|\d+([.]\d+)?|\d+)$/,
    'invalid phone number format',
  ]})
    phone: string; 

  @Prop({ required: true })
    rank: string;  //TODO

  @Prop({ required: true, trim: true, match: [
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    'invalid email address',
  ]})
    mail: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
