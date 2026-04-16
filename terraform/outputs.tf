output "cluster_name" {
  value = google_container_cluster.lms_cluster.name
}

output "cluster_location" {
  value = google_container_cluster.lms_cluster.location
}

output "artifact_registry" {
  value = google_artifact_registry_repository.lms_repo.name
}
