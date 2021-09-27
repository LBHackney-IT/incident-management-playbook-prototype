provider "aws" {
  region  = "eu-west-2"
  version = "~> 2.0"
}

terraform {
  backend "s3" {
    bucket  = "terraform-state-development-apis"
    encrypt = true
    region  = "eu-west-2"
    key     = "services/incident-management-prototype-dev/state"
  }
}

resource "aws_s3_bucket" "frontend-bucket-development" {
  bucket = "incident-management-playbooks-prototype-development"
  acl    = "private"
  versioning {
    enabled = true
  }
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

module "cloudfront-development" {
  source = "github.com/LBHackney-IT/aws-hackney-common-terraform.git//modules/cloudfront/s3_distribution"
  s3_domain_name = aws_s3_bucket.frontend-bucket-development.bucket_regional_domain_name
  origin_id = "incident-management-prototype-dev"
  s3_bucket_arn = aws_s3_bucket.frontend-bucket-development.arn
  s3_bucket_id = aws_s3_bucket.frontend-bucket-development.id
  orginin_access_identity_desc = "Incident Management Playbook cloudfront identity"
  cname_aliases = ["incident-management-prototype-dev.hackney.gov.uk"]
  environment_name = "development"
  cost_code= "B0811"
  project_name= "Incident Management Playbook"
  use_cloudfront_cert = false
  hackney_cert_arn = "arn:aws:acm:us-east-1:859159924354:certificate/dbb3198e-b779-41b6-80b3-4ffd5dd19bf4"
}