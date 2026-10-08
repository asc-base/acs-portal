import {
  CreateNewsPayloadSchema,
  NewsQuerySchema,
  SetNewsBulletinSchema,
  UpdateNewsPayloadSchema,
} from "@/features/news/schema/news";
import { UpsertNewsInformationSchema } from "@/features/news/schema/newsinformation";
import type { INews, INewsInformation } from "@/features/news/domain/news";
import type { INewsRepository } from "../ports/news.repository";
import type { CreateNewsPayload, NewsQueryInput, UpdateNewsPayload } from "@/features/news/schema/news";
import type { NewsBulletin } from "@/features/news/schema/news";
import type { UpsertNewsInformationInputs } from "@/features/news/schema/newsinformation";
import type { Pageable } from "@/shared/types/response";
import type { ApiResponse } from "@/shared/types/response";

export class NewsService {
  constructor(private readonly newsRepository: INewsRepository) {}

  async createNews(data: CreateNewsPayload): Promise<INews> {
    const payload = CreateNewsPayloadSchema.parse(data);
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("detail", payload.detail);
    formData.append("newsCategoryId", String(payload.tagID));
    formData.append("eventStartAt", new Date(payload.startDate).toISOString());
    if (payload.dueDate) {
      formData.append("eventEndAt", new Date(payload.dueDate).toISOString());
    }
    formData.append("cardImage", payload.thumbnail);
    if (payload.thumbnailImage) {
      formData.append("thumbnailImage", payload.thumbnailImage);
    }
    payload.additionalImages?.forEach((file) => formData.append("detailImages", file));
    for (const key of [
      "cardFocalPointX",
      "cardFocalPointY",
      "thumbnailFocalPointX",
      "thumbnailFocalPointY",
    ] as const) {
      const value = payload[key];
      if (value !== undefined) formData.append(key, String(value));
    }

    const response = await this.newsRepository.createNews(formData);
    return response.data;
  }

  async getNews(
    page: NonNullable<NewsQueryInput["page"]>,
    pageSize: NonNullable<NewsQueryInput["pageSize"]>,
    tagID?: NewsQueryInput["tagID"],
    orderBy: string = "startDate",
    sortBy: string = "desc",
    search?: string,
    searchBy?: string,
  ) {
    const query = NewsQuerySchema.parse({
      page,
      pageSize,
      tagID,
      orderBy,
      sortBy,
      search,
      searchBy,
    });
    const response = await this.newsRepository.getNews(
      query.page ?? Number(page),
      query.pageSize ?? Number(pageSize),
      query.tagID,
      query.orderBy,
      query.sortBy,
      query.search,
      query.searchBy,
    );
    return response.data;
  }

  async getNewsById(id: string): Promise<INews | null> {
    const response = await this.newsRepository.getNewsById(id);
    return response.data;
  }

  async updateNews(id: number, data: UpdateNewsPayload): Promise<INews> {
    const payload = UpdateNewsPayloadSchema.parse(data);
    const formData = new FormData();
    const {
      newAdditionalImages,
      detailImages,
      deletedAdditionalImagesId,
      deletedImageIds,
      detailImageOrder,
      cardImage,
      thumbnailImage,
      ...fields
    } = payload;
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
    if (cardImage && !(fields.thumbnail instanceof File)) {
      formData.append("cardImage", cardImage);
    }
    if (thumbnailImage instanceof File) {
      formData.append("thumbnailImage", thumbnailImage);
    }
    (detailImages ?? newAdditionalImages)?.forEach((file) =>
      formData.append("detailImages", file),
    );
    if (deletedImageIds?.length) {
      formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
    }
    if (detailImageOrder) formData.append("detailImageOrder", detailImageOrder);
    if (deletedAdditionalImagesId?.length) {
      formData.append(
        "deletedAdditionalImagesId",
        JSON.stringify(deletedAdditionalImagesId),
      );
    }
    const response = await this.newsRepository.updateNews(id, formData);
    return response.data;
  }

  async getNewsInformations(
    page: NonNullable<NewsQueryInput["page"]>,
    pageSize: NonNullable<NewsQueryInput["pageSize"]>,
    tagId?: NewsQueryInput["tagID"],
    orderBy?: string,
    sortBy?: string,
  ): Promise<Pageable<INewsInformation>> {
    const query = NewsQuerySchema.parse({
      page,
      pageSize,
      tagID: tagId,
      orderBy,
      sortBy,
    });
    const response = await this.newsRepository.getNewsInformations(
      query.page ?? Number(page),
      query.pageSize ?? Number(pageSize),
      query.tagID,
      query.orderBy,
      query.sortBy,
    );
    return response.data;
  }

  async upsertNewsInformation(
    data: UpsertNewsInformationInputs,
  ): Promise<INewsInformation> {
    const payload = UpsertNewsInformationSchema.parse(data);
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
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

  async getNewsBulletins(
    type: "HIGHLIGHT" | "ANNOUNCEMENT",
  ): Promise<INewsInformation[]> {
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

  async setNewsBulletin(
    id: number,
    type: "HIGHLIGHT" | "ANNOUNCEMENT",
    enabled: boolean,
  ): Promise<ApiResponse<NewsBulletin | null>> {
    const request = SetNewsBulletinSchema.parse({ id, type, enabled });
    return this.newsRepository.setNewsBulletin(
      request.id,
      request.type,
      request.enabled,
    );
  }

  async deleteNews(id: number): Promise<INews> {
    const response = await this.newsRepository.deleteNews(id);
    return response.data;
  }
}
