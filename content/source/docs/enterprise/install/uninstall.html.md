---
layout: "enterprise"
page_title: "Uninstall - Terraform Enterprise"
description: |-
  Learn to run a script that removes Terraform Enterprise and all of its services (excluding Docker) from a system.
---

# Uninstall Terraform Enterprise

If you installed Terraform Enterprise on VMWare instances, you may not be able to easily request new virtual machines for a broken or corrupted installation. Instead, you can use the `uninstall` script to remove Terraform Enterprise and all of its services (excluding Docker) from a system. This includes the default Replicated snapshot directory - `/var/lib/replicated/snapshots`. If you have Replicated snapshots you wish to keep, please back up this directory before running the uninstall script.

~> **Important**: This script does not touch the mounted disk path, so you will need to manually clean that up if necessary.

Please contact [support][support] with questions or issues.

## While the Script Runs

After you initiate `uninstall`:

1. Enter `yes` when asked if you want to continue with the installation.

	```
	$ sudo ./uninstall.sh
	This script will completely uninstall Terraform Enterprise and Replicated on this system, as well as remove associated files.
	Do you wish to continue? (y/n)yes
	Proceeding with uninstall...
	```

	If there are snapshots present on the system, you will be prompted to move them, proceed with deleting them, or abort.
	
	```
	There appear to be Replicated snapshots stored in /var/lib/replicated/snapshots.
	1) Move the snapshots to another directory
	2) Continue uninstall and delete the snapshots
	3) Cancel the uninstall
	Select an option: 1
	Enter the directory to move the snapshots to: /tmp
	The snapshots will be moved to /tmp.
	Press Y to continue or N to cancel.yMoving snapshots...
	Files moved.
	```
	The uninstall will then continue...
	
	```
	Stopping and disabling the replicated services...
	Removed /etc/systemd/system/docker.service.wants/replicated-operator.service.
	Removed /etc/systemd/system/docker.service.wants/replicated.service.
	Removed /etc/systemd/system/docker.service.wants/replicated-ui.service.
	Replicated services stopped and disabled.
	Stopping any running application containers
	a8dd38ebcc67
	11a3c7d476a3
	45f786c7c632
	31664ff29012
	c0122c1dce13
	8c6b98b6d498
	d3856e83038d
	b5e160999e2b
	a7f69f5507de
	45a07127fa15
	7a364889673d
	d5f6218e1d3c
	3f10e192a503
	818bb2464291
	1bd96c43b48d
	8388555131dd
	0a0cb265a2bf
	rabbitmq
	telegraf
	influxdb
	anchor_isolation_network
	Removing Replicated Docker containers...
	replicated
	replicated-ui
	replicated-operator
	replicated-premkit
	replicated-statsd
	retraced-api
	retraced-processor
	retraced-cron
	retraced-nsqd
	retraced-postgres
	Removing Replicated files and executables...
	Run systemctl daemon-reload...
	Terraform Enterprise and Replicated should now be uninstalled.
	```

   	The script stops the Replicated services, removes the Docker containers, and removes Replicated executables and configuration files from the system.  


2. Choose an option to prune Docker volumes:  
  - Select `Prune all Docker volumes` if you only use this system for Terraform Enterprise.  
  - Select `Prune only application Docker volumes` to prune only Replicated and Hashicorp Docker volumes and leave the rest intact.  
  - Select `Skip this step` to leave all Docker volumes intact.  

	```
	I can now clean up the Docker images for you.
	1) Prune all Docker volumes
	2) Prune only application Docker volumes
	3) Skip this step
	Select an option: 1
	Prunning all Docker volumes...
	WARNING! This will remove:
	  - all stopped containers
	  - all networks not used by at least one container
	  - all volumes not used by at least one container
	  - all images without at least one container associated to them
	  - all build cache

	Are you sure you want to continue? [y/N] y
	Deleted Containers:
	a8dd38ebcc67ab878ba60fa740df494ff91922aba04f205d675b6a7e4c6d451e
	11a3c7d476a3e1515c97d882c4cc7db8df64b9b7b491575197e57decb45b525c
	45f786c7c632aac83e4ebf5e939a20651fb8026e1123977eee8a842f1bbcbed1
	31664ff29012ee7192abb82e8dcbce4ee564e92a24e6de8a03e948a5ca2eb8c5
	848813ade8b911d356945e309194deed2ba73f165b36ed252a01b2206366ef1c
	1e040b17eb8aca1275dff36dc7175edcb32ab684a697380e9862c436fae8d9f1
	c0122c1dce13b85177987c53c41cbbaf9cf39442601a5360a066e527c022275a
	8c6b98b6d498114a2e71e979dd3c6ef01006b4b80d94a5f39a1b850c6aaae8f0
	5f2760b94e171fd86c643096f0df6603477899abf4fdde690e40dc35d1bdfd8b
	d3856e83038dad46cfbdfe8e39ad57a5896d29b2feab6d4ac1089b18e51e2c9c
	83e2a6ffe045b97cdcec150f3e283e53b19bd90380359fa3db85ba6706a3ca46
	b5e160999e2b7c9d82cbb1217463a844c0a9c54af6c0f4129640e780d712bee8
	c638514eecccff260aabd7d634fd49c34d3938d679d485beb463eb0c58821ca8
	a7f69f5507de8e1501ee9324fc2a82f4e12d2784143ced4500d4036f8f807317
	45a07127fa15d75161b1764dba060bae6b1115fd567cf9966a59c200d912ad23
	7a364889673df8a645776b36d538c1429559673d3cc808e68f408939faa6cb35
	01b60968a765c70c9a72b901ac8e6389805e65c6e158eee9ac588f347b6aaa33
	d5f6218e1d3c016a95740affdd591c64d34dfb8bb2717c18ce4b667fafc272ff
	3f10e192a5038fabc94fda54cad3877ff88865d34f460fe0d02500eca965ea9a
	818bb2464291c5e0b7c6d65c0d10790a57ad95e040d770b1a5df2e7efe093242
	a3ddfd00b603a5dd71f382f9312965de222544fc5938b3f968df36b4c7cab8e3
	715e6c1fe62eada1da160d0011bc2c26e336a233be5543dabad2dd67cd99994c
	d851bcb83703d95553b1a276532861d7e6b790166609102b5134b6befdb9c905
	16da96c20b2f43d849703524effddf6100a54a6aed3bee9878ca4e3b2b47f742
	c10e0d567406699e3c3bb97225f4ebe94541e8a4a1edf77592b68e06ee778a4b
	1bd96c43b48d2634b251ead68575a7bfba255f52a9909d2f0c00a5f5dd6cd14e
	8388555131dd1ec8f9d9d218295d35ff287f9038430848ee2d721fd92c896b83
	473ec860bc666b3265e4c50415bca607011f857024b8469f5aeffe0a251935e8
	0a0cb265a2bfa773086d2a98a3a6412c1d54eaacad6706f319315485c9825996
	dbf1b59e8b8451c0ece04fb57fc42aef4b6accb53fbcbe5850ed873a806f64a9
	73bccf22ef84311ccf6dc2fa608191c8321fd77b4444c0406933c0eca7886bc9
	```


The script removes dangling Docker volumes and the Docker networks that were created for the application. You may see errors such as the ones below, these are normal and just mean the script is attempting to clean up something that's already been removed.

	```
	Deleted Networks:
	tfe_terraform_isolation
	replicated_retraced
	tfe_services

	Deleted Volumes:
	rabbitmq
	d8e5aa7b8454be6b2a1e3e230170eccd6b4e46e1a79af86bb2bcbfbc09665a04
	17e584502a4b54a28ef5a54bdf884f0e8f4912071e52db2786379197f12d2c45
	cf8a92056862b7e6322658c900162d5fdf6d4528b4a247139a7dcf33b7d689aa
	70ff9f127bfab073cf6d855bde073f2f97d715ab5af6fa28908d54ba31204608
	88189c95b0bdc5dc97e027dafd9ac077838d6ddbf295273c1c44c44478f1c815
	influxdb
	config
	66e70bcfc0cf10f28c2d4e0dbe445d37d7953b4a20e010f3b23790901f49f95a
	a063cc63466436ef9992c03936c0c26d0cfa150d3f3ffaa7156cec62b788903c
	10f6c1f088586fbb903cb5f368fd3f14eed47803d91df9c75d1d976f00b17af9
	471f949aff03bd40f9bcf61d4da0e0fd1c2aab7f49e0673fa2a469442eb3c78c
	6b973f2ec922cfe902a0fb8d2fc6dead476c0f55f1ab9b73833665a2330ad947
	a5abdb8ab07d354cd1cc2a0368681718da632527e0efd79593e3805ac517261c
	f3777b2b116e9734fa8e10514caeb1f51f4a1770896094fbb74904346fa5f18b
	redis
	e9c8c5566302e65db0d39c1c7c8ca5d886599f535eec5c655b9e99eac73042e8
	5a41d77a1085b1fccd450804484f989e9bc5c21351666e7dcfe4d20a56c4fd4b
	090ed8544eb926967c55d5343bc291d14a95534fb6ed3d7c2cd510af83c11786
	79e2e42e6a316129c0c9ff0314c774652b1c8d70029385ec55583cd6efbae8a8
	nomad-workers
	b0c7e5919e3185bf09a15fd8e466db614a82aaf6987f38ac656a396561499f30
	cc70bd77c11fedf6d0b656eb474e83893fd9a0d0db6e421686adf2defb4eade1
	aux
	c749451acfc48aa4b355248d90aaf667c7ab2bc1818fadfbd9fd91b7c9710b34
	09a6d3e6ac704ac1e151ae925f0bb25ce24f5a330b9d2ffd69f2a9fa0db1abc9

	Deleted Images:
	untagged: hashicorp/build-worker:now
	deleted: sha256:378b3ecd0a947d834964ab4f690189923c884417d6c9a6fa58989b99330c570f
	deleted: sha256:c7155461ae7897540d42450b157c5584a3ca53a92c0fca151c1b163fd6458176
	deleted: sha256:82c7cbdecbe94986e0a3880702679a42badfc925eb81a5f0e1d23be4a1c4375d
	untagged: 10.1.0.20:9874/hashicorp-ptfe-rabbitmq:9e22de8
	untagged: registry.replicated.com/terraformenterprise/uagwz2oacr7rk.hashicorp-ptfe-rabbitmq:9e22de8
	untagged: registry.replicated.com/terraformenterprise/uagwz2oacr7rk.hashicorp-ptfe-rabbitmq@sha256:b70a3d010ff77616b1036d96942aa016973ef58c60faf3030c94ceb84cd2867b
	deleted: sha256:11de65e463132236bd73df48a8ffa490ff2b525a6fadf8f89e876b7a50c59efc
	deleted: sha256:e50dc68f15e464a836e20ff11ce3d436c0950ffdf81669987a91b5f67a600222
	deleted: sha256:931118288655ef2e98fa288528cfe5bc325a092d9a729e0ed663ac95cb4c3643
	deleted: sha256:b41fbc32924dfe39aa506aacc31029ac0cae428e0afc48ce710abadf6c3c248b
	deleted: sha256:d2fafd954f9d13009ae22483bc6767f8c13621f0a00fe7516f6a53ca02b872e9
	deleted: sha256:11d8011c83b4c445be64bab28e30c8776e69cda90a739663c3f57b55ed83a519
	deleted: sha256:751e8ca997e66f4b7892df7c90f70933380598e9c32394ff787642988272a679
	deleted: sha256:56cedf40e0080b58fe0bda77607e4321b658f6486de25f6750334e60827d239c
	deleted: sha256:5987af1ce8b66c0ac9bc8fca0a58b29dcf283e756bafad1b9347a1e6a6f907e3
	deleted: sha256:58f67ec54ffec23435af7a061e142547586ad71d2ca083845bc3b5a024965143
	untagged: 10.1.0.20:9874/hashicorp-tfe-telegraf:1.16.3-alpine
	...

	Total reclaimed space: 6.168GB
	Done.
	Removing the Replicated and TFE Docker networks...
	Error: No such network: replicated_retraced
	Error: No such network: tfe_services
	Error: No such network: tfe_terraform_isolation
	Unable to remove all Docker application networks, or none to be removed.
	Done.
	Removing any dangling Docker volumes...
	"docker volume rm" requires at least 1 argument.
	See 'docker volume rm --help'.

	Usage:  docker volume rm [OPTIONS] VOLUME [VOLUME...]

	Remove one or more volumes
	Unable to remove dangling Docker volumes, or none to be removed.

	Uninstall Complete
	```

## Run the Uninstaller

### Online

If the system can reach [install.terraform.io][install], go to a shell on your instance and run one of the following:

- **Download the uninstaller**: Run `curl https://install.terraform.io/tfe/uninstall > uninstall.sh`.

- **Make the script executable**: Run `chmod +x uninstall.sh`.

- **Execute the uninstaller**: Run `sudo bash uninstall.sh` to execute the script.

### Airgapped

If the system cannot reach [install.terraform.io][install]:

1. [Download the uninstall script][uninstall link] from a machine that has access to [install.terraform.io][install], and upload the script to the Terraform Enterprise server.

2. From a shell on your instance, run `sudo bash uninstall.sh`.



[install]: https://install.terraform.io
[uninstall link]: https://install.terraform.io/tfe/uninstall
[support]: https://support.hashicorp.com