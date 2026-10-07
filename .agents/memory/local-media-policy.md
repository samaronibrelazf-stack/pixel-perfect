---
name: Local media policy
description: User decision to keep this project's image assets local instead of relying on Lovable hosting.
---

All app images should be stored in the project and referenced as local build assets or public files; do not depend on Lovable-hosted image URLs at runtime.

**Why:** The user asked to bring all images into the project and remove the Lovable image-host dependency.

**How to apply:** Add future site media to `src/assets` or `public`. Normalize any legacy database image URLs from Lovable to the matching local asset.
