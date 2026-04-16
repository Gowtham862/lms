variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "project-ea2672a1-081c-4491-a51"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-south1"
}

variable "cluster_name" {
  description = "GKE Cluster Name"
  type        = string
  default     = "clusterlms"
}
