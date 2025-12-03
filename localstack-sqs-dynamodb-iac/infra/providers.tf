terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "localstack_endpoint" {
  type    = string
  default = "http://127.0.0.1:4566"
}

provider "aws" {
  region                      = var.region
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  endpoints {
    sqs      = var.localstack_endpoint
    dynamodb = var.localstack_endpoint
  }
}
