---
layout: "enterprise"
page_title: "Uninstall - Terraform Enterprise"
---

# Uninstall Terraform Enterprise

If you installed Terraform Enterprise on VMWare instances, you may not be able to easily request new virtual machines for a broken or corrupted installation. Instead, you can use the `uninstall` script to remove Terraform Enterprise and all its services (excluding Docker) from a system.

Please contact [support][support] with questions or issues.

## While the Script Runs

After you initiate `uninstall`:

1. Enter `yes` when asked if you want to continue with the installation.
   ![Uninstall - Do you want to continue?][uninstall-prompt]

	 The script stops the Replicated services, removes the Docker containers, and removes replicated executables and configuration files from the system.
   ![Uninstall - Application removed][uninstall-uninstalled]
2. Choose an option to prune Docker volumes:
   - Select `Prune all Docker volumes` if you only use this system for Terraform Enterprise.
   - Select `Prune only application Docker volumes` to prune only Replicated and Hashicorp Docker volumes and leave the rest intact.
   - Select `Skip this step` to leave all Docker volumes intact.

3. The script removes dangling Docker volumes and the Docker networks that were created for the application. Terraform Enterprise has been removed from the system.

![uninstall-cleanup][uninstall-cleanup]

~> **Important**: This script does not touch the mounted disk path, so you will need to manually clean it up if necessary.

## Run the Uninstaller

### Online

If the system can reach [releases.hashicorp.com][releases], go to a shell on your instance and run one of the following:

- **Execute uninstaller**: Run `curl https://install.terraform.io/tfe/uninstall | sudo bash`.

- **Inspect script locally**: Run `curl https://install.terraform.io/tfe/uninstall > uninstall.sh`, check the script content, and run `sudo bash uninstall.sh` to execute the script.

### Airgapped

If the system cannot reach [releases.hashicorp.com][releases]:

1. [Download the uninstall script][uninstall link] from a machine that has access to [releases.hashicorp.com][releases], and upload the script to the Terraform Enterprise server.

2. From a shell on your instance, run `sudo bash uninstall.sh`.


## When to contact support

If you have any questions about this process or the script, or run into any issues, please contact [support][support] for assistance.


[uninstall-prompt]: ./assets/uninstall-prompt.png
[uninstall-uninstalled]: ./assets/uninstall-uninstalled.png
[uninstall-prune]: ./assets/uninstall-prune.png
[uninstall-prune-all]: ./assets/uninstall-prune-all.png
[uninstall-cleanup]: ./assets/uninstall-cleanup.png
[releases]: https://releases.hashicorp.com
[uninstall link]: https://releases.hashicorp.com/tfe/uninstall.sh
[support]: https://support.hashicorp.com