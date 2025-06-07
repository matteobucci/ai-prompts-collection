# Kubernetes Deployment Guide

## 🎯 Overview

Complete guide for deploying applications to Kubernetes with modern practices, GitOps workflows, and production-ready configurations.

## 🚀 Kubernetes Setup Options

### Local Development
```bash
# Minikube (Cross-platform)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start --driver=docker

# Kind (Kubernetes in Docker)
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind create cluster --name development

# Docker Desktop (Built-in Kubernetes)
# Enable Kubernetes in Docker Desktop settings
```

### Cloud Managed Kubernetes
```bash
# AWS EKS
eksctl create cluster \
  --name my-cluster \
  --region us-west-2 \
  --node-type t3.medium \
  --nodes 3

# Google GKE
gcloud container clusters create my-cluster \
  --zone us-central1-a \
  --machine-type e2-medium \
  --num-nodes 3

# Azure AKS
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 3 \
  --node-vm-size Standard_B2s
```

## 📁 Project Structure

```
kubernetes/
├── base/                   # Base configurations
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── kustomization.yaml
├── overlays/               # Environment-specific overlays
│   ├── development/
│   │   ├── kustomization.yaml
│   │   └── patch-replicas.yaml
│   ├── staging/
│   └── production/
├── helm/                   # Helm charts
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── manifests/              # Generated manifests
└── scripts/                # Deployment scripts
```

## 🛠️ Core Application Manifests

### Deployment Configuration
```yaml
# kubernetes/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1
    spec:
      containers:
      - name: app
        image: my-registry/my-app:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      serviceAccountName: my-app
      securityContext:
        fsGroup: 1000
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app
  labels:
    app: my-app
```

### Service Configuration
```yaml
# kubernetes/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
  - name: http
    port: 80
    targetPort: http
    protocol: TCP
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  labels:
    app: my-app
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.myapp.com
    secretName: my-app-tls
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
```

### ConfigMap and Secrets
```yaml
# kubernetes/base/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-app-config
  labels:
    app: my-app
data:
  LOG_LEVEL: "info"
  MAX_CONNECTIONS: "100"
  CACHE_TTL: "3600"
  app.properties: |
    server.port=3000
    spring.profiles.active=production
    logging.level.com.myapp=INFO
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  labels:
    app: my-app
type: Opaque
data:
  database-url: <base64-encoded-database-url>
  jwt-secret: <base64-encoded-jwt-secret>
  api-key: <base64-encoded-api-key>
```

## 🎯 Kustomize Configuration

### Base Kustomization
```yaml
# kubernetes/base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

metadata:
  name: my-app-base

resources:
- deployment.yaml
- service.yaml
- configmap.yaml

commonLabels:
  app: my-app
  managed-by: kustomize

images:
- name: my-registry/my-app
  newTag: latest

configMapGenerator:
- name: my-app-env-config
  envs:
  - .env

secretGenerator:
- name: my-app-secrets
  envs:
  - .env.secret
```

### Environment Overlays
```yaml
# kubernetes/overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: production

resources:
- ../../base

patchesStrategicMerge:
- patch-replicas.yaml
- patch-resources.yaml

images:
- name: my-registry/my-app
  newTag: v1.2.3

configMapGenerator:
- name: my-app-env-config
  behavior: merge
  literals:
  - LOG_LEVEL=warn
  - MAX_CONNECTIONS=200

replicas:
- name: my-app
  count: 5
```

```yaml
# kubernetes/overlays/production/patch-resources.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: app
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

## ⛵ Helm Chart Configuration

### Chart.yaml
```yaml
# helm/Chart.yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
type: application
version: 0.1.0
appVersion: "1.0.0"
keywords:
- web
- api
- nodejs
home: https://github.com/myorg/my-app
sources:
- https://github.com/myorg/my-app
maintainers:
- name: Development Team
  email: dev@myorg.com
dependencies:
- name: postgresql
  version: 12.1.0
  repository: https://charts.bitnami.com/bitnami
  condition: postgresql.enabled
- name: redis
  version: 17.3.0
  repository: https://charts.bitnami.com/bitnami
  condition: redis.enabled
```

### Values Configuration
```yaml
# helm/values.yaml
replicaCount: 3

image:
  repository: my-registry/my-app
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
  - host: api.myapp.com
    paths:
    - path: /
      pathType: Prefix
  tls:
  - secretName: my-app-tls
    hosts:
    - api.myapp.com

resources:
  requests:
    memory: 256Mi
    cpu: 250m
  limits:
    memory: 512Mi
    cpu: 500m

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

nodeSelector: {}
tolerations: []
affinity: {}

postgresql:
  enabled: true
  auth:
    postgresPassword: "secretpassword"
    database: "myapp"
  primary:
    persistence:
      enabled: true
      size: 10Gi

redis:
  enabled: true
  auth:
    enabled: false

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    path: /metrics
    port: http

env:
  NODE_ENV: production
  LOG_LEVEL: info
  
envSecrets: {}

volumes: []
volumeMounts: []
```

### Deployment Template
```yaml
# helm/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        checksum/secret: {{ include (print $.Template.BasePath "/secret.yaml") . | sha256sum }}
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "my-app.serviceAccountName" . }}
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.service.targetPort }}
          protocol: TCP
        env:
        {{- range $key, $value := .Values.env }}
        - name: {{ $key }}
          value: {{ $value | quote }}
        {{- end }}
        {{- range $key, $value := .Values.envSecrets }}
        - name: {{ $key }}
          valueFrom:
            secretKeyRef:
              name: {{ include "my-app.fullname" $ }}-secrets
              key: {{ $key }}
        {{- end }}
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
        {{- with .Values.volumeMounts }}
        volumeMounts:
          {{- toYaml . | nindent 12 }}
        {{- end }}
      {{- with .Values.volumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

## 🔄 GitOps with ArgoCD

### ArgoCD Application
```yaml
# argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-app
    targetRevision: main
    path: kubernetes/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  revisionHistoryLimit: 3
```

### ArgoCD Project
```yaml
# argocd/project.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: my-app-project
  namespace: argocd
spec:
  description: Project for my application
  sourceRepos:
  - https://github.com/myorg/my-app
  destinations:
  - namespace: '*'
    server: https://kubernetes.default.svc
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  namespaceResourceWhitelist:
  - group: apps
    kind: Deployment
  - group: ''
    kind: Service
  - group: networking.k8s.io
    kind: Ingress
  roles:
  - name: developer
    description: Developer access
    policies:
    - p, proj:my-app-project:developer, applications, get, my-app-project/*, allow
    - p, proj:my-app-project:developer, applications, sync, my-app-project/*, allow
    groups:
    - my-org:developers
```

## 📊 Monitoring and Observability

### Prometheus ServiceMonitor
```yaml
# kubernetes/base/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
    scrapeTimeout: 10s
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: my-app-alerts
  labels:
    app: my-app
spec:
  groups:
  - name: my-app.rules
    rules:
    - alert: HighCPUUsage
      expr: rate(container_cpu_usage_seconds_total{pod=~"my-app-.*"}[5m]) > 0.8
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage on {{ $labels.pod }}"
        description: "CPU usage is above 80% for more than 5 minutes"
    
    - alert: HighMemoryUsage
      expr: container_memory_usage_bytes{pod=~"my-app-.*"} / container_spec_memory_limit_bytes > 0.9
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High memory usage on {{ $labels.pod }}"
        description: "Memory usage is above 90% for more than 5 minutes"
```

### Horizontal Pod Autoscaler
```yaml
# kubernetes/base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
  labels:
    app: my-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
```

## 🚀 CI/CD Pipeline

### GitHub Actions for Kubernetes
```yaml
# .github/workflows/deploy-k8s.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: Deploy with Kustomize
        run: |
          cd kubernetes/overlays/production
          kustomize edit set image ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:main-${{ github.sha }}
          kustomize build . | kubectl apply -f -

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/my-app -n production
          kubectl get pods -n production -l app=my-app
```

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Kubernetes cluster is running and accessible
- [ ] kubectl configured with appropriate permissions
- [ ] Container images built and pushed to registry
- [ ] Secrets and ConfigMaps configured
- [ ] Ingress controller installed (if using Ingress)
- [ ] Cert-manager installed (for TLS certificates)

### Deployment Commands
```bash
# Using kubectl and Kustomize
kubectl apply -k kubernetes/overlays/production

# Using Helm
helm upgrade --install my-app ./helm \
  --namespace production \
  --create-namespace \
  --values helm/values-production.yaml

# Using ArgoCD
kubectl apply -f argocd/application.yaml

# Verify deployment
kubectl get pods -n production
kubectl logs -f deployment/my-app -n production
kubectl port-forward svc/my-app-service 8080:80 -n production
```

### Post-deployment
- [ ] Verify pods are running and ready
- [ ] Check application health endpoints
- [ ] Test ingress and external connectivity
- [ ] Verify metrics and logging
- [ ] Test auto-scaling behavior
- [ ] Validate backup procedures