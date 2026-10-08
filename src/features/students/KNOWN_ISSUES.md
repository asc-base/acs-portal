# Student known issues

- `studentCode` in the create/update form schemas has only a maximum length, so short numeric codes pass; CSV rows require exactly 11 digits.
- Student focal-point schemas accept numbers outside the image percentage range, and reject `null` even though the shared user focal-point schema allows it.
- Only `CreateStudentSchema` validates Facebook and Instagram URLs. Update fields for all four social links, plus create fields for LinkedIn and GitHub, accept arbitrary strings that are rendered as links in student profiles.
