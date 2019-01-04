---
page_title: "Index - Troubleshooting Private Terraform Enterprise"
layout: "guides"
sidebar_current: "troubleshooting-ptfe"
---

# Troubleshooting Private Terraform Enterprise

Private Terraform Enterprise is our on-prem solution that allows customers that allows full use of Terraform Enterprise in a private, isolated environment.

For most issues, as a paying customer, it's best to open a Support issue via the web portal at https://support.hashicorp.com or by email at support@hashicorp.com. But there are some common troubleshooting steps you can try yourself to solve the problem and narrow down issues.

## Docker Networking Issues

Private Terraform Enterprise is delivered as a series of containers and run using Docker.

Docker makes some assumptions about the networking of the system. By default, it will use the DNS settings it can find on the host system's `/etc/resolv.conf`file.

If it cannot find DNS settings in the systems `/etc/resolv.conf` file, or it only contains the `127.0.0.1`local address, it will default to using Google's DNS resolvers (`8.8.8.8`, `8.8.4.4`).

However, operating systems such as Ubuntu 16.04 use `dnsmasq` by default, which sets `/etc/resolv.conf` to `127.0.0.1`.

This normally is not an issue if the PTFE host has access to `8.8.8.8`, but if the machine cannot access the `8.8.8.8,8.8.4.4` domains, you will get errors like the following in logs:

```
Error contacting host: lookup ptfe.example.com on 8.8.4.4:53: read udp 172.17.0.2:51388->8.8.4.4:53: i/o timeout
```

You can also test this directly with the following:

```
$ docker exec -it replicated sh -c "nslookup ptfe.example.com"
nslookup: can't resolve '(null)': Name does not resolve
nslookup: can't resolve 'ptfe.example.com': Try again
```

> Note: Ignore the error nslookup: can't resolve '(null)': Name does not resolve, as this is a red-herring caused by a bug in Busybox

One solution to resolve this is to set the DNS server in the Docker daemon file:

```
$ cat /etc/docker/daemon.json`
{
    "dns": ["10.0.0.2", "8.8.8.8"]
}
```

Then restart the docker service: `sudo service docker restart`

You can then test it can resolve the PTFE address with the following:

```
root@ptfe:~# docker exec -it replicated sh -c "nslookup ptfe.example.com"
nslookup: can't resolve '(null)': Name does not resolve
Name:      ptfe.example.com
Address 1: 3.8.84.111 ec2-3-8-84-111.eu-west-2.compute.amazonaws.com
```

## Replicated Running but PTFE giving errors

Sometimes, there is an error during installation, and the Replicated Dashboard will be running (on port :8080) but PTFE will fail to start.

Generally, the logs from the replicated container may shed some light on the issue:

```
sudo docker logs replicated 2>&1 | tee /tmp/replicated.log
```

For example, In my install, I’ve not given the `replicated.conf` file the correct permissions, causing the installer to ignore the automated install:

```
$ cat /tmp/replicated.log
Failed to read config: open /host/etc/replicated.conf: permission denied
```

I do a quick `chmod 0644 /etc/replicated.conf`, and then everything works as expected.

## Certificate Errors when connecting to a Git server

When debugging failures of VCS connections due to certificate errors, running additional diagnostics using the OpenSSL command may provide more information about the failure.

First, attach a bash session to the application container:

```
docker exec -it ptfe_atlas sh -c "stty rows 50 && stty cols 150 && bash"
```

Then run the openssl s_client command, using the certificate at /tmp/cust-ca-certificates.crt in the container:

```
openssl s_client -showcerts -CAfile /tmp/cust-ca-certificates.crt -connect git-server-hostname:443
```

For example, a Gitlab server that uses a self-signed certificate might result in an error like `verify error:num=18:self signed certificate`, as shown in the output below:

```
bash-4.3# openssl s_client -showcerts -CAfile /tmp/cust-ca-certificates.crt -connect gitlab.example.com:443
CONNECTED(00000003)
depth=0 CN = gitlab.example.com
verify error:num=18:self signed certificate
verify return:1
depth=0 CN = gitlab.example.com
verify return:1
---
Certificate chain
 0 s:/CN=gitlab.example.com
   i:/CN=gitlab.example.com
-----BEGIN CERTIFICATE-----
MIIC/DCCAeSgAwIBAgIJAIhG2GWtcj7lMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMMFWdpdGxhYi1sb2NhbC5oYXNoaS5jbzAeFw0xODA2MDQyMjAwMDhaFw0xOTA2
MDQyMjAwMDhaMCAxHjAcBgNVBAMMFWdpdGxhYi1sb2NhbC5oYXNoaS5jbzCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMMgrpo3zsoy2BP/AoGIgrYwEMnj
PwSOFGNHbclmiVBCW9jvrZrtva8Qh+twU7CSQdkeSP34ZgLrRp1msmLvUuVMgPts
i7isrI5hug/IHLLOGO5xMvxOcrHknvySYJRmvYFriEBPNRPYJGJ9O1ZUVUYeNwW/
l9eegBDpJrdsjGmFKCOzZEdUA3zu7PfNgf788uIi4UkVXZNa/OFHsZi63OYyfOc2
Zm0/vRKOn17dewOOesHhw77yYbBH8OFsEiC10JCe5y3MD9yrhV1h9Z4niK8rHPXz
XEh3JfV+BBArodmDbvi4UtT+IGdDueUllXv7kbwqvQ67OFmmek0GZOY7ZvMCAwEA
AaM5MDcwIAYDVR0RBBkwF4IVZ2l0bGFiLWxvY2FsLmhhc2hpLmNvMBMGA1UdJQQM
MAoGCCsGAQUFBwMBMA0GCSqGSIb3DQEBCwUAA4IBAQCfkukNV/9vCA/8qoEbPt1M
mvf2FHyUD69p/Gq/04IhGty3sno4eVcwWEc5EvfNt8vv1FykFQ6zMJuWA0jL9x2s
LbC8yuRDnsAlukSBvyazCZ9pt3qseGOLskaVCeOqG3b+hJqikZihFUD95IvWNFQs
RpvGvnA/AH2Lqqeyk2ITtLYj1AcSB1hBSnG/0fdtao9zs0JQsrS59CD1lbbTPPRN
orbKtVTWF2JlJxl2watfCNTw6nTCPI+51CYd687T3MuRN7LsTgglzP4xazuNjbWB
QGAiQRd6aKj+xAJnqjzXt9wl6a493m8aNkyWrxZGHfIA1W70RtMqIC/554flZ4ia
-----END CERTIFICATE-----
---
Server certificate
subject=/CN=gitlab.example.com
issuer=/CN=gitlab.example.com
---
No client certificate CA names sent
Peer signing digest: SHA512
Server Temp Key: ECDH, P-256, 256 bits
---
SSL handshake has read 1443 bytes and written 433 bytes
---
New, TLSv1/SSLv3, Cipher is ECDHE-RSA-AES256-GCM-SHA384
Server public key is 2048 bit
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
SSL-Session:
    Protocol  : TLSv1.2
    Cipher    : ECDHE-RSA-AES256-GCM-SHA384
    Session-ID: AF5286FB7C7725D377B4A5F556DEB6DDC38B302153DDAE90C552ACB5DC4D86B8
    Session-ID-ctx:
    Master-Key: DB75AEC12C6E7B62246C653C8CB8FC3B90DE86886D68CB09898A6A6F5D539007F7760BC25EC4563A893D34ABCFAAC28A
    Key-Arg   : None
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 03 c1 35 c4 ff 6d 24 a8-6c 70 61 fb 2c dc 2e b8   ..5..m$.lpa.,...
    0010 - de 4c 6d b0 2c 13 8e b6-63 95 18 ee 4d 33 a6 dc   .Lm.,...c...M3..
    0020 - 0d 64 24 f0 8d 3f 9c aa-b8 a4 e2 4f d3 c3 4d 88   .d$..?.....O..M.
    0030 - 58 99 10 73 83 93 70 4a-2c 61 e7 2d 41 74 d3 e9   X..s..pJ,a.-At..
    0040 - 83 8c 4a 7f ae 7b e8 56-5c 51 fc 6f fe e3 a0 ec   ..J..{.V\Q.o....
    0050 - 3c 2b 6b 13 fc a0 e5 15-a8 31 16 19 11 98 56 43   <+k......1....VC
    0060 - 16 86 c4 cd 53 e6 c3 61-e2 6c 1b 99 86 f5 a8 bd   ....S..a.l......
    0070 - 3c 49 c0 0a ce 81 a9 33-9b 95 2c e1 f4 6d 05 1e   <I.....3..,..m..
    0080 - 18 fa bf 2e f2 27 cc 0b-df 08 13 7e 4d 5a c8 41   .....'.....~MZ.A
    0090 - 93 26 23 90 f1 bb ba 3a-15 17 1b 09 6a 14 a8 47   .&#....:....j..G
    00a0 - 61 eb d9 91 0a 5c 4d e0-4a 8f 4d 50 ab 4b 81 aa   a....\M.J.MP.K..

    Start Time: 1528152434
    Timeout   : 300 (sec)
    Verify return code: 18 (self signed certificate)
---
closed
```
