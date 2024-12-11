import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class BaseSchema extends Document {

  @Prop()
    isActive?: boolean;

}

