---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Troubleshooting (Installer)"
sidebar_current: "docs-enterprise2-private-troubleshooting"
---

# Private Terraform Enterprise Troubleshooting

For most issues, it is best to open a Support issue via the web portal at https://support.hashicorp.com or
by email at <support@hashicorp.com>. But there are some common troubleshooting steps you can try yourself to solve the problem and narrow down issues.

## Replicated Running but PTFE not starting

This is generally observed in an Airgap installation on a system with no direct internet access or via an internal proxy. This is often manifest as the Replicated dashboard (running on `:8080`) but PTFE itself not running.

Generally, the logs from the `replicated` container may shed some light on the issue:

```
sudo docker logs replicated 2>&1 | tee /tmp/replicated.log
```

A common error is a message such as `'Container ptfe_migrations failed: Timeout waiting for event migrations completed'`, where the temorary container used to run database migrations errors out, generally due to networking issues.

These can be investigated further by investigating the Docker networking on the host-machine, detailed below.

## Docker Networking Issues

Docker makes some assumptions about the networking of the system. [By default, it will use the DNS settings it can find on the host system's `/etc/resolv.conf` file.](https://docs.docker.com/config/containers/container-networking/#dns-services)

If it cannot find DNS settings in the systems `/etc/resolv.conf` file, or it only contains the `127.0.0.1` local address, it will default to using Google's DNS resolvers.

However, operating systems such as Ubuntu 16.04 use `dnsmasq` by default, which sets `/etc/resolv.conf` to 127.0.0.1.

This normally is not an issue if the PTFE VM has access to `8.8.8.8`, but if the machine cannot access the `8.8.8.8,8.8.4.4` domains, you will get errors like the following in logs:

```
Error contacting host: lookup ptfe.example.com on 8.8.4.4:53: read udp 172.17.0.2:51388->8.8.4.4:53: i/o timeout
```

You can also test this directly with the following:

```
docker exec -it replicated sh -c "nslookup ptfe.example.com"
nslookup: can't resolve '(null)': Name does not resolve
nslookup: can't resolve 'ptfe.petems.xyz': Try again
```

> Note: Ignore the error `nslookup: can't resolve '(null)': Name does not resolve`, as this is a red-herring caused by a bug in Busybox

One solution to resolve this is to set the DNS server in the Docker daemon file:

```
$ cat /etc/docker/daemon.json`
{
    "dns": ["10.0.0.2", "8.8.8.8"]
}
```

Then restart the docker service:

```
sudo service docker restart
```

You can then test it can resolve the PTFE address with the following:

```
root@ptfe:~# docker exec -it replicated sh -c "nslookup ptfe.example.com"
nslookup: can't resolve '(null)': Name does not resolve

Name:      ptfe.example.com
Address 1: 3.8.84.111 ec2-3-8-84-111.eu-west-2.compute.amazonaws.com
```

