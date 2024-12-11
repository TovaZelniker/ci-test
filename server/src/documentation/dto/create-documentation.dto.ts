import { Types } from 'mongoose';


export class CreateDocumentationDto {
  productId: Types.ObjectId;
  content: string;
  editedBy: Types.ObjectId;
  isManualChange: boolean;
  type: number;
  date: Date;
}
