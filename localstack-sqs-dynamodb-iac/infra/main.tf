locals {
  project = "localstack-sqs-dynamodb-iac"
}

resource "aws_sqs_queue" "events" {
  name = "${local.project}-events-queue"
}

resource "aws_dynamodb_table" "events" {
  name         = "${local.project}-events"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "event_id"

  attribute {
    name = "event_id"
    type = "S"
  }
}

output "queue_url" {
  value = aws_sqs_queue.events.url
}

output "table_name" {
  value = aws_dynamodb_table.events.name
}
