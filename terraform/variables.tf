variable "aws_region" {
  type        = string
  default     = "eu-west-2"
  description = "London"
}

variable "lambda_role_arn" {
  type        = string
  default     = "arn:aws:iam::339712790115:role/lambda-comprehend-dynamodb-role"
  description = "IAM Role ARN for Lambda execution"
}
