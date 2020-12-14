# A Next.js dashboard starter with Material-UI and Parse SDK

## How to setup

### 1. Download the sources

Download the zip file from the [github repo](https://github.com/zipang/parse-materia-dashboard-next) and unzip it.

Or with [degit](https://github.com/Rich-Harris/degit) : 
```sh
degit zipang/parse-materia-dashboard-next my-dashboard
cd my-dashboard
```

Install the dependencies :

```sh
yarn
```

### 2. Create your backend as a service with back4app

[Create an application](https://youtu.be/JWMv2aEx5G0), then copy the required application key and js api key inside `env.local`

```sh
cp .env.local.sample .env.local
nano .env.local
```

which should now contain something like this with the values of your backend :

```properties
PARSE_APP_ID=xxxxx
PARSE_JS_KEY=xxxxx
```

## Troubleshooting

### `Warning: Prop className did not match.`
