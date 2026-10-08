// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudentCard } from "@/features/students/components/studentcard";

const user = {
  id: 17,
  email: "student@example.test",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  imageUrl: "https://example.test/member.png",
};

describe("StudentCard", () => {
  it("renders a project member with the existing image and name but no student-only footer", () => {
    render(<StudentCard {...user} />);

    expect(screen.getByText("สมชาย ใจดี")).toBeTruthy();
    expect(screen.getByRole("img", { name: "สมชาย ใจดี" }).getAttribute("src")).toBe(user.imageUrl);
    expect(screen.queryByText(/รุ่นที่/)).toBeNull();
  });

  it("keeps the student cohort and code footer for full student data", () => {
    render(
      <StudentCard
        {...user}
        student={{
          id: 5,
          studentCode: "65012345678",
          classBookID: 68,
          skills: [],
        }}
      />,
    );

    expect(screen.getByText("สมชาย ใจดี")).toBeTruthy();
    expect(screen.getByRole("img", { name: "สมชาย ใจดี" }).getAttribute("src")).toBe(user.imageUrl);
    expect(screen.getByText("รุ่นที่ 68")).toBeTruthy();
    expect(screen.getByText("65-678")).toBeTruthy();
  });
});
