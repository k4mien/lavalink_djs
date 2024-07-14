terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.54.1"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_instance" "lavalink_djs" {
  ami           = "ami-0faab6bdbac9486fb"
  instance_type = "t2.micro"

  tags = {
    Name = var.instance_name
  }
}
