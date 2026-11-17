class ThreeDTilesSource extends Mapbender.Source {

    createNativeLayers(srsName, mapOptions) {
        return [];
    }

    getPrintConfigs(bounds, scale, srsName) {
        return [];
    }

    getSelected() {
        return this.getRootLayer().getSelected();
    }

    updateEngine() {

    }

    featureInfoEnabled() {
        return this.getRootLayer().state.info;
    }

    loadFeatureInfo(mapModel, x, y, options, elementId) {
        return [null, Promise.resolve([])];
    }
}

window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSource = ThreeDTilesSource;
Mapbender.Source.typeMap['3d_tiles'] = ThreeDTilesSource;
