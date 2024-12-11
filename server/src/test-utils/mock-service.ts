const item = { name: 'Test' };

export const mockServiceMethods = {
  create: jest.fn().mockResolvedValue(item),
  findAll: jest.fn().mockResolvedValue([item]),
  findOne: jest.fn().mockResolvedValue(item),
  update: jest.fn().mockResolvedValue(item),
  delete: jest.fn().mockResolvedValue(item),
};