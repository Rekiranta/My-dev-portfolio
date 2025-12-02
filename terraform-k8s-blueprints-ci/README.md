# Terraform K8s Blueprints + CI (Local)

A local Infrastructure-as-Code project that provisions Kubernetes resources using Terraform.
Designed as a portfolio demo for Cloud/DevOps roles: Terraform + Kubernetes + CI.

## What it does

Terraform creates:

- A dedicated namespace
- A ConfigMap containing environment status data (`status.json`)
- A small Nginx deployment that serves the ConfigMap content
- A ClusterIP service for access inside the cluster

You can access the JSON locally via `kubectl port-forward`.

## Tech stack

- Terraform
- Kubernetes (Minikube)
- kubectl
- GitHub Actions (CI)

## Prerequisites

- Terraform installed and available in PATH
- Minikube installed
- kubectl installed

## Run locally

Start Minikube:

```bash
minikube start
```
