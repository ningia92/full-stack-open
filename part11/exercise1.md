- Linting, testing and building tools in the Python ecosystem:
	- Ruff: is a Python linter free and open-source. Ruff is written in Rust and is, therefore, incredibly fast compared to other linters;
	- Pytest framework: is one of the most popularly used Python testing frameworks. It is a open-source testing frameworks. It supports unit testing, functional testing, and API tests.
	- Poetry: command-line tool to handle dependency installation and isolation as well as building and packaging of Python packages.

- Alternatives to Jenkins and GitHub Actions are:
	- Spacelift: is an IaC (Infrastructure-as-code) management platform. It provides an automated CI/CD workflow for your infrastructure changes, letting you stop writing flaky pipeline scripts to apply your Terraform plans or Kubernetes deployments;
	- GitLab CI/CD: provides a platform for running pipelines directly alongside your GitLab repositories. Available in both self-hosted and managed SaaS forms, it's a powerful system that integrates well with other GitLab components and cloud deployment environments. It can directly connect to Kubernetes clusters to run jobs and launch your apps;
	- AWS CodePipeline: is a cloud-hosted CI/CD service that's available as part of AWS. Similarly to Jenkins, it supports the use of plugins to enable robust customization of your pipeline steps.
	- Others: CircleCI, Travis CI, Azure DevOps, etc.

- To make this decision I would need to know what type of application is and if it require many computational resources. In general, if it's a small software project that doesn't have any special requirements, a cloud-based solution is best. For larger project, where more resources are needed or in larger companies where there are multiple teams and projects to take advantage of it, a self-hosted CI setup is the way to go.