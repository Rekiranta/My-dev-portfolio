provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "ns" {
  metadata {
    name = var.namespace
    labels = {
      app = var.app_name
    }
  }
}

resource "random_pet" "suffix" {
  length    = 2
  separator = "-"
}

# ConfigMap blueprint: environment status data (like a config source)
resource "kubernetes_config_map" "status_data" {
  metadata {
    name      = "status-data-${random_pet.suffix.id}"
    namespace = kubernetes_namespace.ns.metadata[0].name
    labels = {
      app  = var.app_name
      tier = "config"
    }
  }

  data = {
    "status.json" = jsonencode({
      environments = [
        { name = "dev", status = "healthy" },
        { name = "staging", status = "degraded" },
        { name = "prod", status = "healthy" }
      ]
      generatedBy = "terraform"
    })
  }
}

# A simple Nginx deployment that serves the config from a mounted configmap
resource "kubernetes_deployment" "web" {
  metadata {
    name      = "statusboard-web"
    namespace = kubernetes_namespace.ns.metadata[0].name
    labels = {
      app  = var.app_name
      tier = "web"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app  = var.app_name
        tier = "web"
      }
    }

    template {
      metadata {
        labels = {
          app  = var.app_name
          tier = "web"
        }
      }

      spec {
        container {
          name  = "nginx"
          image = "nginx:alpine"

          port {
            container_port = 80
          }

          volume_mount {
            name       = "status-data"
            mount_path = "/usr/share/nginx/html"
            read_only  = true
          }
        }

        volume {
          name = "status-data"

          config_map {
            name = kubernetes_config_map.status_data.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "web" {
  metadata {
    name      = "statusboard-svc"
    namespace = kubernetes_namespace.ns.metadata[0].name
    labels = {
      app  = var.app_name
      tier = "web"
    }
  }

  spec {
    selector = {
      app  = var.app_name
      tier = "web"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "ClusterIP"
  }
}
