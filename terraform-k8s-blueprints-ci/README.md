# Terraform Kubernetes Blueprints + CI

A local Infrastructure-as-Code project demonstrating Kubernetes resource provisioning with Terraform. Features CI pipeline integration for Cloud/DevOps portfolio demonstrations.

## Features

- **Kubernetes provisioning** - Terraform manages K8s resources
- **Namespace isolation** - Dedicated namespace for resources
- **ConfigMap deployment** - Environment status data as JSON
- **Nginx deployment** - Serves ConfigMap content
- **ClusterIP service** - Internal cluster access
- **CI integration** - GitHub Actions workflow

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Terraform | Infrastructure as Code |
| Kubernetes | Container orchestration |
| Minikube | Local K8s cluster |
| Nginx | Static content server |
| GitHub Actions | CI pipeline |

## What Gets Created

| Resource | Type | Description |
|----------|------|-------------|
| `statusboard` | Namespace | Isolated namespace |
| `status-data` | ConfigMap | JSON status data |
| `status-server` | Deployment | Nginx serving ConfigMap |
| `status-service` | Service | ClusterIP for internal access |

## Prerequisites

- Terraform installed and in PATH
- Minikube installed
- kubectl installed

## Run Locally

```powershell
cd terraform-k8s-blueprints-ci

# Start Minikube
minikube start

# Initialize Terraform
cd infra
terraform init

# Apply infrastructure
terraform apply

# Port forward to access locally
kubectl port-forward svc/status-service -n statusboard 8080:80
```

Access the service at http://localhost:8080

## Project Structure

```
terraform-k8s-blueprints-ci/
├── infra/
│   ├── main.tf           # Terraform resources
│   ├── variables.tf      # Input variables
│   ├── outputs.tf        # Output values
│   └── status.json       # ConfigMap data
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions
└── README.md
```

## Terraform Resources

```hcl
# Namespace
resource "kubernetes_namespace" "statusboard" {
  metadata { name = "statusboard" }
}

# ConfigMap with status data
resource "kubernetes_config_map" "status" {
  data = { "status.json" = file("status.json") }
}

# Nginx deployment serving ConfigMap
resource "kubernetes_deployment" "nginx" {
  # ... serves /status.json from ConfigMap
}

# ClusterIP service
resource "kubernetes_service" "status" {
  type = "ClusterIP"
  port { port = 80 }
}
```

## Status Data Format

```json
{
  "environments": [
    {"name": "dev", "status": "healthy"},
    {"name": "staging", "status": "degraded"},
    {"name": "prod", "status": "healthy"}
  ],
  "generated": "2024-01-15T12:00:00Z"
}
```

## CI Pipeline

GitHub Actions workflow:
1. Validates Terraform syntax
2. Runs `terraform plan`
3. Checks for formatting issues

## Use Cases

- Cloud/DevOps portfolio demonstrations
- Terraform + Kubernetes learning
- Infrastructure as Code patterns
- CI/CD pipeline integration

