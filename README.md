# Hackney Incident Management playbook generator

> Generates a [Docusaurus](https://docusaurus.io/) site containing incident management guidance for your service at Hackney.

## Why?

This tool gives your team the power to take ownership of your incident management process and document it in a way that makes it easy to understand and share across the whole organisation.

Your team can discuss and capture all the useful information needed for managing an incident effectively and store it in a single configuration file alongside your code. This makes it easy to update when your services change!

It's recommended you run a semi-regular workshop with your entire team to review your incident management process and update the configuration as necessary. You can follow [this guide](./workshop-guide.md) to help you run those sessions!

## What will your playbook will cover?

- What is an incident, and what is incident managment?
- What are the roles involved in incident management?
- Where can the health of your service be checked and monitored?
- Who are the key contacts for your service?
- How do you communicate issues with your users (residents or staff)?
- How does the team learn from incidents?
- **...and much more!**

## Getting started

1. Install the library

   ```bash
   # Yarn
   yarn add --dev @lbhackney/incident-management-documentation-generator

   # NPM
   npm install --save-dev @lbhackney/incident-management-documentation-generator
   ```

2. Create your configuration file

   ```bash
   touch your-service-name.json
   ```

   > See [`example-service.json`](./example-service.json) for a reference structure

3. Run the generator

   ```bash
   yarn run incident-management-documentation-generator
   ```

4. Build and deploy the generated Docusaurus site as you need!
