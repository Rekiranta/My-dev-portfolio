variable "namespace" {
  type        = string
  description = "Kubernetes namespace for the demo"
  default     = "statusboard"
}

variable "app_name" {
  type        = string
  description = "App name label"
  default     = "devops-statusboard"
}
