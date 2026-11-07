# News unit-test follow-ups

The unit-test ticket preserves production behavior. These findings are not asserted as correct behavior and need separate fixes.

1. **Image-only edits can be discarded.** `components/admin/[id]/news.info.tsx` computes `assetsChanged`, modern `deletedImageIds`, and `detailImageOrder`, but the save guard only checks React Hook Form dirtiness, new files, and legacy deletion IDs. Removing an existing modern DETAIL image, or reordering saved assets without changing a form field, can reset the editor without calling `updateNews`. After a fix, add regression checks that these edits persist; an unchanged form should still skip the request.
2. **End-date validation is incomplete.** Both create/update form schemas accept any string for `dueDate`; they do not validate date validity or ordering relative to the start date. Update titles/details and category values also have weaker constraints than create. No tests invent stricter rules or assert invalid end dates/empty update titles as desirable behavior.
