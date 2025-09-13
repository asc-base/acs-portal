# GitHub Actions CI/CD Setup

This repository includes GitHub Actions workflows for Continuous Integration and Continuous Deployment (CI/CD) that automatically builds and pushes Docker images to Docker Hub.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

A comprehensive pipeline that includes:

- **Testing**: Runs linting and unit tests with PostgreSQL database
- **Building**: Builds Docker image for multiple architectures
- **Pushing**: Pushes to Docker Hub on successful tests

### 2. Docker Build and Push (`docker-build-push.yml`)

A simpler workflow focused only on building and pushing Docker images.

## Setup Instructions

### 1. Docker Hub Setup

1. Create a Docker Hub account if you don't have one
2. Create a repository for your image (e.g., `your-username/acs-be`)
3. Generate an access token:
   - Go to Docker Hub → Account Settings → Security
   - Click "New Access Token"
   - Give it a name and select appropriate permissions
   - Copy the generated token

### 2. GitHub Secrets Setup

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:

| Secret Name          | Description                  | Example              |
| -------------------- | ---------------------------- | -------------------- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username     | `your-username`      |
| `DOCKERHUB_TOKEN`    | Your Docker Hub access token | `dckr_pat_abc123...` |

### 3. Workflow Triggers

The workflows are triggered by:

- **Push to main/develop branches**: Builds and pushes with branch name tag + `latest` tag for main
- **Pull requests**: Builds image but doesn't push (for testing)
- **Git tags**: Builds and pushes with semantic version tags (e.g., `v1.0.0`)

### 4. Image Tags

The workflow automatically creates the following tags:

- `latest` - for main branch pushes
- `main` or `develop` - for respective branch pushes
- `pr-123` - for pull request #123
- `v1.0.0`, `v1.0`, `v1` - for semantic version tags

## Usage Examples

### Deploying to Production

1. Push to main branch or create a release tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The workflow will automatically:
   - Run tests
   - Build multi-architecture image (AMD64 + ARM64)
   - Push to Docker Hub with appropriate tags

### Using the Docker Image

After the workflow completes, you can pull and run your image:

```bash
# Pull the latest version
docker pull your-username/acs-be:latest

# Pull a specific version
docker pull your-username/acs-be:v1.0.0

# Run the container
docker run -p 3000:3000 your-username/acs-be:latest
```

## Features

- ✅ **Multi-architecture builds** (AMD64 + ARM64)
- ✅ **Build caching** for faster subsequent builds
- ✅ **Automated testing** before deployment
- ✅ **Security scanning** ready (can be extended)
- ✅ **Semantic versioning** support
- ✅ **Pull request validation** without pushing images
- ✅ **Production-optimized** Docker image building

## Troubleshooting

### Common Issues

1. **Authentication Error**

   - Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are set correctly
   - Ensure the Docker Hub token has push permissions

2. **Build Failures**

   - Check that all dependencies are properly listed in `package.json`
   - Ensure Dockerfile is valid and builds locally

3. **Test Failures**
   - Make sure tests pass locally first
   - Check if database connection string is correct for the test environment

### Monitoring Builds

- Go to the "Actions" tab in your GitHub repository to monitor workflow runs
- Each push/PR will trigger a new workflow run
- You can see detailed logs for each step

## Customization

You can customize the workflow by:

- Modifying trigger conditions in the `on:` section
- Adding more test steps or different testing frameworks
- Changing the Docker image tags or naming convention
- Adding deployment steps to cloud providers
- Including security scanning or vulnerability checks

## Security Best Practices

- Never commit Docker Hub credentials to your repository
- Use GitHub secrets for all sensitive information
- Regularly rotate your Docker Hub access tokens
- Consider using GitHub Container Registry as an alternative to Docker Hub
- Enable two-factor authentication on both GitHub and Docker Hub accounts
