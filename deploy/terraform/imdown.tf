provider "aws" {
  profile = "imdown"
  region  = "us-west-1"
}

data "aws_ami" "ubuntu_1804" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"]
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu_1804.id
  instance_type          = "t2.micro"
  key_name               = "imdown"
  vpc_security_group_ids = [aws_security_group.web.id]
  tags = {
    Name = "Web Server"
  }
}

resource "aws_eip" "web" {
  vpc      = true
  instance = aws_instance.web.id
}

resource "aws_route53_record" "web" {
  zone_id = "Z04140101TH7MU41O0R7U"
  name    = "app.imhelladown.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.web.public_ip]
}

resource "aws_security_group" "web" {
  name        = "https_and_ssh"
  description = "Allow SSH and HTTPS traffic"
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
