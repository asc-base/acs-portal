# Classbook issues found while adding unit tests

These existing validation and form behaviors are preserved by the unit-test ticket.

- `curriculumID` requires a number of at least 1 but does not require an integer, so fractional IDs pass both schemas.
- `classof` accepts any non-empty digit string and `firstYearAcademic` accepts any four digits, including values outside a plausible academic-year range.
- The create form does not require a thumbnail, while the service always appends `thumbnailFile`; submitting without a selected image passes `null` through the non-null assertion.
