---
layout: "extend"
page_title: "Extending Terraform: Debugging Providers"
sidebar_current: "docs-extend-debugging-providers"
description: |-
  How to debug providers.
---

# Debugging Providers

This guide documents a few different ways to access more information about the
runtime operations of Terraform providers. It is intended for Terraform
provider developers, though sufficiently advanced users may also be able to use
it.

There are two available approaches to debugging Terraform providers. We'll talk
about each of them separately and in turn.

## Log-Based Debugging

Log-based debugging is a method of using logging calls to record what is
happening in a provider as it happens, and then examining that record to piece
together what happened after the fact. Usefully, end users can capture logs and
share them with developers, allowing developers to sometimes debug providers
without needing access to the environment or configuration. Unfortunately,
developers need to think ahead about what information they'll need when
debugging, because the log lines need to be injected into the provider when
it's built and cannot be inserted into the binary after it has been built. This
makes it harder to ask new questions when doing log-based debugging, as the log
line needs to be added and the provider needs to be recompiled before new
information can be surfaced.

### Inserting Log Lines Into A Provider

Terraform providers all log to `stderr`. Any output to `stderr` will be passed
over the gRPC protocol to Terraform, which will then write it to its
destination.

~> **Important:** Don't write to `stdout` on any Terraform providers! It can cause
   problems with our plugin system, which uses `stdout` as a communication
   channel.

We recommend using the standard library `log` package to achieve this,
via `log.Println` or `log.Printf` or similar functions.

Log lines must be prefixed with the level of the log in square brackets. Valid
levels, in decreasing order of severity, are:

* ERROR
* WARN
* INFO
* DEBUG
* TRACE

A full log line, then, may look like this:

```go
log.Println("[DEBUG] Something happened!")
```

### Turning On Logging

Terraform controls which log levels are recorded for all providers and
Terraform itself using the `TF_LOG` environment variable. Set it to `TRACE` to
output all log lines, `DEBUG` to output all log lines except `TRACE` lines,
etc.

~> **NOTE:** prior to v0.15.0 of Terraform, levels besides `TRACE` may not be
   entirely reliable. See [this
   PR](https://github.com/hashicorp/terraform/pull/26632) for more details.

By default, log output will be recorded to `stderr` when `TF_LOG` is set. To
write log output to a file instead, set `TF_LOG_PATH` to a file's path. Log
output will be appended there. It's worth noting that this file will not be
truncated before log output is written.

#### Separating Out Provider Logs

Terraform can have some verbose logging and it can be difficult to parse log
files when both Terraform and providers are writing to the same log file. In
Terraform 0.15.0 and later, you can address this by setting the `TF_LOG_CORE`
and `TF_LOG_PROVIDER` environment variables to different log levels.
Set either to `off` to turn off its logging entirely.

## Debugger-Based Debugging

Debugger-based debugging is a method of using a debugging tool similar to
[delve](https://github.com/go-delve/delve) to inspect what is happening in a
provider as it is happening, often using breakpoints to pause execution of the
provider and examine the values of variables. This method of debugging must be
done contemporaneously; the developer doing the debugging needs to actively run
Terraform using the appropriate configuration and in the appropriate
environment to induce the behavior being examined. It is therefore most useful
when a bug is reliably reproducible. This level of analysis enables developers to
ask arbitrary questions and step through provider executions, allowing them to 
explore what is happening in the provider during runtime.

-> **Note**: Debugger-based debugging only works with Terraform versions
   0.12.26 and higher.

### Enabling Debugging In A Provider

Debugging is available for providers using Terraform Plugin SDK versions 2.0.0
and above. The plugin must also be started in debug
mode, called `plugin.Debug` instead of `plugin.Serve`. We recommend that you
enable this using a flag, as the provider should use `plugin.Serve` under
normal operation, when not being debugged.

```go
func main() {
	var debugMode bool

	flag.BoolVar(&debugMode, "debug", false, "set to true to run the provider with support for debuggers like delve")
	flag.Parse()

	opts := &plugin.ServeOpts{ProviderFunc: provider.New}

	if debugMode {
		// TODO: update this string with the full name of your provider as used in your configs
		err := plugin.Debug(context.Background(), "registry.terraform.io/my-org/my-provider", opts)
		if err != nil {
			log.Fatal(err.Error())
		}
		return
	}

	plugin.Serve(opts)
}
```

It is important to start a provider in debug mode only when you intend
to debug it, as its behavior will change in minor ways from normal operation of
providers. The main differences are:

* Terraform will not start the provider process; it must be run manually.
* The provider's constraints will no longer be checked as part of `terraform
  init`.
* The provider will no longer be restarted once per walk of the Terraform
  graph; instead the same provider process will be reused until the command is
  completed.

### Starting A Provider In Debug Mode

Once a provider has a debug mode added to its `main` function, it can be
activated. Run your debugger, and pass it the provider binary as the command to
run, specifying whatever flags, environment variables, or other input is
necessary to start your provider in debug mode:

```sh
$ dlv exec --headless ./terraform-provider-my-provider -- --debug
```

Connect your debugger (whether it's your IDE or the debugger client) to the
debugger server. Have it continue execution (it pauses the process by default)
and it will print output like the following to `stdout`:

```
Provider started, to attach Terraform set the TF_REATTACH_PROVIDERS env var:

        TF_REATTACH_PROVIDERS='{"registry.terraform.io/my-org/my-provider":{"Protocol":"grpc","Pid":3382870,"Test":true,"Addr":{"Network":"unix","String":"/tmp/plugin713096927"}}}'
```

### Running Terraform With A Provider In Debug Mode

Copy the line starting with `TF_REATTACH_PROVIDERS` from your provider's
output. Either export it, or prefix every Terraform command with it:

```sh
TF_REATTACH_PROVIDERS='{"registry.terraform.io/my-org/my-provider":{"Protocol":"grpc","Pid":3382870,"Test":true,"Addr":{"Network":"unix","String":"/tmp/plugin713096927"}}}' terraform apply
```

Run Terraform as usual. Any breakpoints you have set will halt execution and
show you the current variable values.
