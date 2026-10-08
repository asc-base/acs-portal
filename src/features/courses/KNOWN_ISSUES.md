# Known issues

- `createCourseSchema` requires `preCoursesID`, while `ICreateCourse` declares it optional. A create caller that omits prerequisites must currently send `preCoursesID: []` to pass validation.
