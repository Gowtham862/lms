
terraform {
  backend "gcs" {
    bucket  = "lms-terraform-state-862"
    prefix  = "terraform/state"
  }
}






provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registry
resource "google_artifact_registry_repository" "lms_repo" {
  location      = var.region
  repository_id = "lms-repo"
  format        = "DOCKER"
  project       = var.project_id
}

# GKE Cluster
resource "google_container_cluster" "lms_cluster" {
  name     = var.cluster_name
  location = var.region
  project  = var.project_id

  enable_autopilot = true

  deletion_protection       = false
  in_transit_encryption_config = "IN_TRANSIT_ENCRYPTION_DISABLED"
}
