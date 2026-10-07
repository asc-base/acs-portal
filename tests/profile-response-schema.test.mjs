import assert from "node:assert/strict";
import test from "node:test";
import {
  ProfessorResponseSchema,
  StudentResponseSchema,
} from "../src/core/schema/profile-response.ts";

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

test("student responses use the user ID as the root and allow nullable profile data", () => {
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

  assert.deepEqual(StudentResponseSchema.parse(response), response);
  assert.equal(
    StudentResponseSchema.safeParse({
      id: 9,
      studentCode: "S1",
      classBookID: null,
      skills: [],
      user,
    }).success,
    false,
  );
});

test("professor responses keep professor-only fields under the user", () => {
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

  assert.deepEqual(ProfessorResponseSchema.parse(response), response);
  assert.equal(
    ProfessorResponseSchema.safeParse({
      id: 9,
      profRoom: "1/1",
      phone: "0123456789",
      expertFields: [],
      educations: [],
      research_profile: null,
      user,
    }).success,
    false,
  );
});
