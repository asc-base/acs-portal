import type { IClassBookRepository } from "@/features/classbook/ports/class-book.repository";
import type {
  IClassBook,
  QueryClassBookInput,
  ICreateClassBook,
  IUpdateClassBook,
} from "@/features/classbook/domain/classbook";
import {
  ClassBookIdSchema,
  ClassBookQuerySchema,
  CreateClassbookRequestSchema,
  UpdateClassbookRequestSchema,
  type ClassBookPage,
} from "@/features/classbook/schema/classbook";

export class ClassBookService {
  constructor(private readonly classBookRepository: IClassBookRepository) {}

  async getClassBooks(query: QueryClassBookInput): Promise<ClassBookPage> {
    const response = await this.classBookRepository.getClassBooks(
      ClassBookQuerySchema.parse(query),
    );
    return response.data;
  }

  async getClassBookById(id: number): Promise<IClassBook | null> {
    const response = await this.classBookRepository.getClassBookById(
      ClassBookIdSchema.parse(id),
    );
    return response?.data ?? null;
  }

  async createClassBook(data: ICreateClassBook, thumbnailFile: File) {
    const { thumbnailFile: requestThumbnail, ...request } =
      CreateClassbookRequestSchema.parse({ ...data, thumbnailFile });
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    formData.append("thumbnailFile", requestThumbnail);
    const response = await this.classBookRepository.createClassBook(formData);
    return response.data;
  }

  async updateClassBook(
    data: IUpdateClassBook,
    thumbnailFile: File | null,
    id: number,
  ) {
    const request = UpdateClassbookRequestSchema.parse({
      ...data,
      ...(thumbnailFile ? { thumbnailFile } : {}),
    });
    const { thumbnailFile: requestThumbnail, ...requestData } = request;
    const formData = new FormData();
    Object.entries(requestData).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    if (requestThumbnail) formData.append("thumbnailFile", requestThumbnail);

    const response = await this.classBookRepository.updateClassBook(
      formData,
      ClassBookIdSchema.parse(id),
    );
    return response.data;
  }

  async deleteClassBook(id: number): Promise<IClassBook> {
    const response = await this.classBookRepository.deleteClassBook(
      ClassBookIdSchema.parse(id),
    );
    return response.data;
  }
}
