# Mapbender 3D Element

Visualise 3D content in the Mapbender framework using MapComponents. This library is currently in development.

## Installation

(in your mapbender installation while the working directory is the application directory)  

while the library is in development and not published on Packagist:
```bash
composer config repositories.mapbender-3d vcs https://github.com/mapbender/mapbender-3d
composer require "mapbender/mapbender-3d":"dev-main"
```

later:
```bash
composer require "mapbender/mapbender-3d"
```

## Development - Mapbender

The module is a regular symfony bundle. Its source is in `src-php`. The bundle supplies the ThreeDView element that shows a button (to switch to the 3D view) as well as the iframe to include
the MapComponents application.

## Development - MapComponents

```bash
npm i # local npm installation (npm i --force might be necessary)
npm run dev # local test with live reload at localhost:5173
npm run build # compiling for the Mapbender library
```

The build output directory is `src-php/Mapbender/Mapbender3DBundle/Resources/public/iframe`. This code should be committed to the repository. 
The mapbender installation where the library is used will use this compiled code in the iframe.

If during testing you want to test the live reload version of the MapComponents application, add the following in your `parameters.yaml`:

`mapbender.3d.iframe_url: http://localhost:5173/`

This will override the default iframe url location.
