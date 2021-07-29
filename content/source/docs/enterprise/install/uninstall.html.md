---
layout: "enterprise"
page_title: "Uninstall - Terraform Enterprise"
---

# Uninstalling Terraform Enterprise

While Terraform Enterprise is most often installed on a cloud provider, where creating and destroying instances is simple and fast, it is also commonly installed onto VMWare instances. Some customers may not be able to easily request new virtual machines in situations where a Terraform Enterprise installation has become broken or corrupted. As such, we have provided a simple script that will remove Terraform Enterprise and all its various services (excluding Docker) from a system. 

## What does this script do?

This script will first determine some basic information about the system it's being run on (operating system, init system). You will be presented with a warning that you are about to uninstall Terraform Enterprise and Replicated from the system. 
![Uninstall - Do you want to continue?][uninstall-prompt]

After confirming you wish to continue, the script will stop the Replicated services, if they are running, and then remove the Docker containers. Replicated executables and configuration files will be removed from the system. 
![Uninstall - Application removed][uninstall-uninstalled]

You will then be presented with the options around pruning Docker volumes. 
![Uninstall - Prune all docker volumes?][uninstall-prune]

If the system was only utilized for Terraform Enterprise, you can select `Prune all Docker volumes`.
![Uninstall - Prune all][uninstall-prune-all]

If the system has other Docker containers running, and you wish to keep them, you'll need to select `Prune only application Docker volumes`. This option will specifically prune Replicated and Hashicorp Docker volumes. Lastly, you can opt to skip this step entirely, leaving any Docker volumes intact.  

Finally, the script will clean up any dangling Docker volumes and the Docker networks that were created for the application. 
![uninstall-cleanup][uninstall-cleanup]

Terraform Enteprise mounted disk installations will need to clean up the mounted disk path manually, if they wish to remove that data. This script does not touch the mounted disk path.

## How to run the uninstaller

### Online

If the system is able to reach [releases.hashicorp.com][releases].

1. From a shell on your instance:
	* To execute the uninstaller directly, run `curl https://releases.hashicorp.com/tfe/uninstall.sh | sudo bash`. 
	* To inspect the script locally before running, run `curl https://releases.hashicorp.com/tfe/uninstall.sh > uninstall.sh` and, once you are satisfied with the script's content, execute it with `sudo bash uninstall.sh`.

### Airgapped

If the system cannot reach [releases.hashicorp.com][releases].

1. You'll need to [download the uninstall script][uninstall link] from a machine that has access to [releases.hashicorp.com][releases], and then upload or copy the script to the Terraform Enterprise server. 

1. Then, you can run the script with `sudo bash uninstall.sh`.

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