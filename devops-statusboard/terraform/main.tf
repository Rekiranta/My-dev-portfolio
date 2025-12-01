provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "statusboard" {
  metadata {
    name = "devops-statusboard"
  }
}

resource "kubernetes_deployment" "statusboard" {
  metadata {
    name      = "statusboard"
    namespace = kubernetes_namespace.statusboard.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "statusboard"
      }
    }
    template {
      metadata {
        labels = {
          app = "statusboard"
        }
      }
      spec {
        container {
          image = "teemu/statusboard-backend:latest"
          name  = "statusboard-backend"
          port {
            container_port = 5000
          }
        }
      }
    }
  }
}
