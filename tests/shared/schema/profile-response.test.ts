import { describe, expect, it } from "vitest";
import {
  ProfessorResponseSchema,
  StudentResponseSchema,
  UserProfileSchema,
} from "@/shared/schema/profile-response";

const user = {
  id: 101,
  email: "user@example.com",
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  firstNameEn: null,
  lastNameEn: null,
  nickName: null,
  imageUrl: null,
  prefix: null,
};

describe("profile response schemas", () => {
  it("validates the current user profile and its required role list", () => {
    const profile = {
      ...user,
      roles: [{ id: 1, name: "Admin" }],
    };

    expect(UserProfileSchema.parse(profile)).toEqual(profile);
    expect(
      UserProfileSchema.safeParse({ ...profile, roles: undefined }).success,
    ).toBe(false);
    expect(
      UserProfileSchema.safeParse({ ...profile, roles: [{ id: 1, name: 2 }] })
        .success,
    ).toBe(false);
  });
  it("uses the user ID as the student root and allows nullable profile data", () => {
    const response = {
      ...user,
      student: {
        id: 9,
        studentCode: "S1",
        classBookID: null,
        facebook: null,
        skills: [],
      },
    };

    expect(StudentResponseSchema.parse(response)).toEqual(response);
    expect(
      StudentResponseSchema.safeParse({
        id: 9,
        studentCode: "S1",
        classBookID: null,
        skills: [],
        user,
      }).success,
    ).toBe(false);
  });

  it("keeps professor-only fields under the user", () => {
    const response = {
      ...user,
      professor: {
        id: 9,
        profRoom: "1/1",
        phone: "0123456789",
        expertFields: [],
        educations: [],
        research_profile: null,
      },
    };

    expect(ProfessorResponseSchema.parse(response)).toEqual(response);
    expect(
      ProfessorResponseSchema.safeParse({
        id: 9,
        profRoom: "1/1",
        phone: "0123456789",
        expertFields: [],
        educations: [],
        research_profile: null,
        user,
      }).success,
    ).toBe(false);
  });
});
