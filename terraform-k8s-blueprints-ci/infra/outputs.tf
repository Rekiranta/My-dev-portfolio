output "namespace" {
  value = var.namespace
}

output "service_name" {
  value = kubernetes_service.web.metadata[0].name
}

output "configmap_name" {
  value = kubernetes_config_map.status_data.metadata[0].name
}
