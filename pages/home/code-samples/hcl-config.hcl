variable "ami_id" {
  type        = string
  description = "AMI ID to use"
  default     = "ami-09d95fab7fff3776c"
}

variable "instance_type" {
  type        = string
  description = "Instance type to use"
  default     = "t3.micro"
}

variable "availability_zone" {
  type        = string
  description = "Availability Zone to use"
  default     = "us-east-1a"
}
