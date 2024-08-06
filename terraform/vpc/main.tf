resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main"
  }
}

resource "aws_subnet" "main_subnet" {
    vpc_id = aws_vpc.main
    cidr_block = "10.0.1.0/24"
}