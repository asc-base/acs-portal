import { Pageable } from "@/interface/response";
import {
  INews,
  INewsInformation,
} from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
import { CreateNewsInputs } from "../schema/news";
import { UpsertNewsInformationInputs } from "../schema/newsinformation";
import { UpdateNewsPayload } from "../schema/news";

export class NewsService {
  constructor(private readonly newsRepository: INewsRepository) {}

async createNews(data: CreateNewsInputs): Promise<INews> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("detail", data.detail);
  formData.append("newsCategoryId", String(data.tagID));
  formData.append("eventStartAt", new Date(data.startDate).toISOString());
  if (data.dueDate) formData.append("eventEndAt", new Date(data.dueDate).toISOString());
  formData.append("cardImage", data.thumbnail);
  if (data.thumbnailImage) formData.append("thumbnailImage", data.thumbnailImage);
  data.additionalImages?.forEach((file) => formData.append("detailImages", file));
  for (const key of ["cardFocalPointX", "cardFocalPointY", "thumbnailFocalPointX", "thumbnailFocalPointY"] as const) {
    const value = data[key];
    if (value !== undefined) formData.append(key, String(value));
  }

  const response = await this.newsRepository.createNews(formData);
  return response.data;
}

  async getNews(
    page: number,
    pageSize: number,
    tagID?: number,
    orderBy: string = "startDate",
    sortBy: string = "desc",
    search?: string,
    searchBy?: string,
  ): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(
      page,
      pageSize,
      tagID,
      orderBy,
      sortBy,
      search,
      searchBy,
    );
    return response.data;
  }

  async getNewsById(id: string): Promise<INews> {
    const response = await this.newsRepository.getNewsById(id);
    return response.data;
  }

  async updateNews(
    id: number,
    data: UpdateNewsPayload,
  ) {
    try {
      const formData = new FormData();
      const { newAdditionalImages, detailImages, deletedAdditionalImagesId, deletedImageIds, detailImageOrder, cardImage, thumbnailImage, ...fields } = data;
      Object.entries(fields).forEach(([key, value]) => {
        if (key === "thumbnail") {
          if (value instanceof File) formData.append("cardImage", value);
          return;
        }
        if (key === "thumbnailImage") {
          if (value instanceof File) formData.append("thumbnailImage", value);
          return;
        }
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key === "dueDate" && value === "") {
          formData.append("eventEndAt", "null");
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (cardImage && !(fields.thumbnail instanceof File)) formData.append("cardImage", cardImage);
      if (thumbnailImage instanceof File) formData.append("thumbnailImage", thumbnailImage);
      (detailImages ?? newAdditionalImages)?.forEach((file) =>
        formData.append("detailImages", file),
      );
      if (deletedImageIds?.length) formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
      if (detailImageOrder) formData.append("detailImageOrder", detailImageOrder);
      if (deletedAdditionalImagesId?.length) {
        formData.append(
          "deletedAdditionalImagesId",
          JSON.stringify(deletedAdditionalImagesId),
        );
      }
      const response = await this.newsRepository.updateNews(id, formData);
      return response.data;
    } catch (error) {
      console.error("Failed to update news:", error);
      return null;
    }
  }

  async getNewsInformations(
    page: number,
    pageSize: number,
    tagId?: number,
    orderBy?: string,
    sortBy?: string,
  ): Promise<Pageable<INewsInformation>> {
    const response = await this.newsRepository.getNewsInformations(
      page,
      pageSize,
      tagId,
      orderBy,
      sortBy,
    );
    return response.data;
  }

  async upsertNewsInformation(data: UpsertNewsInformationInputs): Promise<INewsInformation> {

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await this.newsRepository.upsertNewsInformation(formData);
    return response.data;
  }

  async getNewsInformationById(id: number): Promise<INewsInformation> {
    const response = await this.newsRepository.getNewsInformationById(id);
    return response.data;
  }

  async getNewsBulletins(type: "HIGHLIGHT" | "ANNOUNCEMENT"): Promise<INewsInformation[]> {
    const response = await this.newsRepository.getNewsBulletins(type);
    return response.data.map(({ id, type, news }) => {
      const imageType = type === "HIGHLIGHT" ? "THUMBNAIL" : "CARD";
      const image = news.images?.find((row) => row.imageType === imageType);
      return {
      id,
      type,
      news,
      thumbnailURL: image?.imageUrl ?? news.thumbnailURL,
      thumbnailFocalPointX: image?.focalPointX ?? news.thumbnailFocalPointX,
      thumbnailFocalPointY: image?.focalPointY ?? news.thumbnailFocalPointY,
    };
    });
  }

  async setNewsBulletin(id: number, type: "HIGHLIGHT" | "ANNOUNCEMENT", enabled: boolean) {
    return this.newsRepository.setNewsBulletin(id, type, enabled);
  }

  async deleteNews(id: number): Promise<INews> {
    const response = await this.newsRepository.deleteNews(id);
    return response.data;
  }
}
