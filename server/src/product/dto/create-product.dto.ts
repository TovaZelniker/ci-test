import { Types } from 'mongoose';


export class CreateProductDto {
  name: string;
  openRequest: string;
  orderBranch: string; // TODO: enum
  orderSection: string; // TODO: enum
  orderCourse: string; // TODO: enum
  summary: string;
  purpose: string;
  projector: Types.ObjectId;
  contentSpecialist: Types.ObjectId;
  productType: Types.ObjectId;
  deadline?: Date;
  status: {
    workflowStatus: number;
    isCompleted: boolean;
    deadline: Date;
    changesNumber: number;
  }[];
  mandatoryCategories: {
    categoryId: Types.ObjectId;
    files: string[];
  }[];
  optionalCategories: {
    categoryId: Types.ObjectId;
    files: string[];
  }[];
}
