# GitHub Actions CI/CD

CI implementation is maintained in [acs-website-infra](https://github.com/asc-base/acs-website-infra/blob/main/docs/ci-cd.md).
The workflows in this repository only forward application events to the centralized reusable workflows.

- Pull requests into `development`: existing Node.js lint/build checks.
- Push to `release/1.0.1`: build `ghcr.io/asc-base/acs-portal:staging-1.0.1`, pin staging to its digest, and publish a GitHub pre-release with `image.json`.
- Merge `release/1.0.1` into `main`: promote that pre-release's `IMAGE_DIGEST` to `ghcr.io/asc-base/acs-portal:1.0.1` and publish release/tag `1.0.1`. No rebuild on merge or Git tag push.

See the infra guide for secrets, access settings and rollout order.
